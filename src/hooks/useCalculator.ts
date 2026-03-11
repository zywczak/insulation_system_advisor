import { useState, useCallback, useMemo } from 'react';
import { CalculatorData, CalculationResults } from '@/lib/calculator/types';
import { calculateSavings } from '@/lib/calculator/calculations';
import { HOUSE_TYPES, FUEL_TYPES, WALL_TYPES, calculateRequiredThickness, calculateWallArea, sqftToM2, getExposedWallCount } from '@/lib/calculator/constants';
import { steps } from '@/data/stepdata';

const initialData: CalculatorData = {
  houseType: '',
  floorArea: 0,
  wallArea: 0,
  unitSystem: 'metric',
  useManualWallArea: false,
  manualWallAreas: [],
  manualWallMode: 'total',
  region: '',
  wallType: '',
  fuelType: '',
  fuelPrice: 0,
  insulationMaterial: 'grey-eps',
  insulationThickness: 0,
};

function computeManualWallAreaM2(manualWallAreas: number[], unitSystem: 'metric' | 'imperial'): number {
  const total = manualWallAreas.reduce((sum, v) => sum + (v || 0), 0);
  const totalM2 = unitSystem === 'imperial' ? sqftToM2(total) : total;
  return Math.round(totalM2 * 0.82); // deduct 18% for windows/doors
}

export function useCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CalculatorData>(initialData);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const updateData = useCallback((updates: Partial<CalculatorData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const selectHouseType = useCallback((houseTypeId: string) => {
    const houseType = HOUSE_TYPES.find(h => h.id === houseTypeId);
    if (houseType) {
      const floorArea = houseType.defaultArea;
      const wallArea = calculateWallArea(floorArea, houseTypeId);
      const wallCount = getExposedWallCount(houseTypeId);
      setData(prev => ({
        ...prev,
        houseType: houseTypeId,
        floorArea,
        wallArea: prev.useManualWallArea ? prev.wallArea : wallArea,
        manualWallAreas: prev.manualWallMode === 'per-wall' ? new Array(wallCount).fill(0) : prev.manualWallAreas,
      }));
      // If not manual, set wallArea
      if (!data.useManualWallArea) {
        setData(prev => ({ ...prev, wallArea }));
      }
    }
  }, [data.useManualWallArea]);

  const updateFloorArea = useCallback((floorArea: number) => {
    setData(prev => {
      const autoWall = calculateWallArea(floorArea, prev.houseType);
      return {
        ...prev,
        floorArea,
        wallArea: prev.useManualWallArea ? prev.wallArea : autoWall,
      };
    });
  }, []);

  const setUnitSystem = useCallback((unitSystem: 'metric' | 'imperial') => {
    setData(prev => ({ ...prev, unitSystem }));
  }, []);

  const setUseManualWallArea = useCallback((useManual: boolean) => {
    setData(prev => {
      if (useManual) {
        const wallCount = getExposedWallCount(prev.houseType);
        const initialAreas = prev.manualWallMode === 'per-wall' ? new Array(wallCount).fill(0) : [0];
        return { ...prev, useManualWallArea: true, manualWallAreas: initialAreas };
      } else {
        const autoWall = calculateWallArea(prev.floorArea, prev.houseType);
        return { ...prev, useManualWallArea: false, wallArea: autoWall, manualWallAreas: [] };
      }
    });
  }, []);

  const setManualWallMode = useCallback((mode: 'total' | 'per-wall') => {
    setData(prev => {
      const wallCount = getExposedWallCount(prev.houseType);
      const newAreas = mode === 'per-wall' ? new Array(wallCount).fill(0) : [0];
      return { ...prev, manualWallMode: mode, manualWallAreas: newAreas, wallArea: 0 };
    });
  }, []);

  const updateManualWallArea = useCallback((index: number, value: number) => {
    setData(prev => {
      const newAreas = [...prev.manualWallAreas];
      newAreas[index] = value;
      const wallAreaM2 = computeManualWallAreaM2(newAreas, prev.unitSystem);
      return { ...prev, manualWallAreas: newAreas, wallArea: wallAreaM2 };
    });
  }, []);

  const selectFuelType = useCallback((fuelTypeId: string) => {
    const fuel = FUEL_TYPES.find(f => f.id === fuelTypeId);
    if (fuel) {
      setData(prev => ({
        ...prev,
        fuelType: fuelTypeId,
        fuelPrice: fuel.defaultPrice,
      }));
    }
  }, []);

  const selectWallType = useCallback((wallTypeId: string) => {
    const wall = WALL_TYPES.find(w => w.id === wallTypeId);
    if (wall) {
      const calculatedThickness = calculateRequiredThickness(wall.uValue);
      setData(prev => ({
        ...prev,
        wallType: wallTypeId,
        insulationThickness: calculatedThickness,
      }));
    }
  }, []);

  const isInputValid = useCallback((input: typeof steps[0]['inputs'][0], value: unknown): boolean => {
    // Check if value is missing or empty
    if (value === undefined || value === null || value === '') {
      return false;
    }
    
    // For number inputs, 0 or negative might be invalid if it's required
    if (input.type === 'number' && typeof value === 'number' && value <= 0) {
      return false;
    }
    
    // For multiSelect radio inputs, check if it's an empty array
    if (input.type === 'radio' && 'multiSelect' in input && input.multiSelect && Array.isArray(value) && value.length === 0) {
      return false;
    }

    return true;
  }, []);

  const canProceed = useCallback((step: number): boolean => {
    const stepData = steps[step - 1]; // steps is 0-indexed, step param is 1-indexed
    if (!stepData) return false;

    // Check all required inputs for the current step
    for (const input of stepData.inputs) {
      // Skip if input has a parent condition that's not met
      if (input.parentCondition) {
        const parentValue = data[input.parentCondition.name as keyof CalculatorData];
        if (parentValue !== input.parentCondition.value) {
          continue; // This input is not visible, skip validation
        }
      }

      // Check if the input is required (only radio and number types have this property)
      const hasRequired = 'required' in input && input.required;
      if (!hasRequired) {
        continue;
      }

      const value = data[input.name as keyof CalculatorData];
      if (!isInputValid(input, value)) {
        return false;
      }
    }

    return true;
  }, [data, isInputValid]);

  const nextStep = useCallback(() => {
    if (canProceed(currentStep) && currentStep <= steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, canProceed]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= steps.length + 1) {
      let canGo = true;
      for (let i = 1; i < step; i++) {
        if (!canProceed(i)) {
          canGo = false;
          break;
        }
      }
      if (canGo) {
        setCurrentStep(step);
      }
    }
  }, [canProceed]);

  const results = useMemo((): CalculationResults | null => {
    if (currentStep >= steps.length && canProceed(steps.length)) {
      try {
        return calculateSavings(data);
      } catch {
        return null;
      }
    }
    return null;
  }, [currentStep, data, canProceed]);

  const openContactModal = useCallback(() => {
    setIsContactModalOpen(true);
  }, []);

  const closeContactModal = useCallback(() => {
    setIsContactModalOpen(false);
  }, []);

  // Create a generic form update function for compatibility with DynamicStepRenderer
  const updateFormData = useCallback((name: string, value: string | number) => {
    setData(prev => ({ ...prev, [name]: value }));
  }, []);

  const totalSteps = steps.length;

  return {
    currentStep,
    data,
    results,
    isContactModalOpen,
    totalSteps,
    updateData,
    updateFormData,
    selectHouseType,
    updateFloorArea,
    setUnitSystem,
    setUseManualWallArea,
    setManualWallMode,
    updateManualWallArea,
    selectFuelType,
    selectWallType,
    canProceed,
    nextStep,
    prevStep,
    goToStep,
    openContactModal,
    closeContactModal,
  };
}
