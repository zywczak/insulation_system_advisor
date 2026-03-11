export interface HouseType {
  id: string;
  name: string;
  defaultArea: number; // default floor area in m²
  icon: string;
  floors: number;
  referenceNettoWallArea: number; // net external wall area in m² (after -18% windows)
}

export interface Region {
  id: string;
  name: string;
  hdd: number; // Heating Degree Days
  windZone: 1 | 2 | 3 | 4; // Wind exposure zone
  windMultiplier: number; // Heat loss multiplier (1.0 - 1.35)
}

export interface WallType {
  id: string;
  name: string;
  uValue: number; // W/m²K
  description: string;
}

export interface FuelType {
  id: string;
  name: string;
  unit: string;
  defaultPrice: number;
  efficiency: number; // 0-1
  kwhPerUnit: number; // kWh per unit (for oil/LPG conversion)
  co2Factor: number; // kg CO2 per kWh
}

export interface InsulationMaterial {
  id: string;
  name: string;
  lambda: number; // W/mK - thermal conductivity
  description: string;
  thicknesses: number[]; // available thicknesses in mm
}

export interface CalculatorData {
  // Step 1
  houseType: string;
  floorArea: number;
  wallArea: number; // auto-calculated or manual override (always in m²)
  unitSystem: 'metric' | 'imperial';
  useManualWallArea: boolean;
  manualWallAreas: number[]; // values in display unit
  manualWallMode: 'total' | 'per-wall';
  // Step 2
  region: string;
  // Step 3
  wallType: string;
  // Step 4
  fuelType: string;
  fuelPrice: number;
  // Step 5
  insulationMaterial: string;
  insulationThickness: number;
}

export interface ProjectionDataPoint {
  year: number;
  annual: number;
  cumulative: number;
}

export interface CalculationResults {
  annualSavingsKwh: number;
  annualSavingsPounds: number;
  co2ReductionKg: number;
  treesEquivalent: number;
  uValueBefore: number;
  uValueAfter: number;
  energyBefore: number;
  energyAfter: number;
  savingsPercentage: number;
  // Ventilation losses
  ventilationLossKwh: number;
  totalEnergyBefore: number;
  totalEnergyAfter: number;
  totalSavingsPercentage: number;
  // ROI / Payback
  estimatedCost: number;
  paybackYears: number;
  // 25-year projection
  projectionData: ProjectionDataPoint[];
  totalSavings25Years: number;
  // EPC improvement
  epcPointsGained: number;
  // Financial reframing
  netProfit25Years: number;
  lifetimeROI: number;
}

export interface ContactFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  emailAddress: string;
  telephoneNumber: string;
  // Property Address
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  postcode: string;
  // Additional Details (optional)
  wallsRequiringWork?: number;
  completionDate?: string;
}
