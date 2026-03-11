import { CalculatorData, CalculationResults, ProjectionDataPoint } from './types';
import { 
  UK_REGIONS, 
  WALL_TYPES, 
  FUEL_TYPES, 
  CO2_PER_TREE_KG, 
  GREY_EPS_LAMBDA,
  R_SI,
  R_SE,
  R_RENDER,
  EWI_COST_PER_SQM,
  ENERGY_INFLATION_RATE,
  PROJECTION_YEARS,
  WALL_CONTRIBUTION,
  calculateVentilationLoss
} from './constants';

export function calculateSavings(data: CalculatorData): CalculationResults {
  // Get reference data
  const region = UK_REGIONS.find(r => r.id === data.region);
  const wallType = WALL_TYPES.find(w => w.id === data.wallType);
  const fuelType = FUEL_TYPES.find(f => f.id === data.fuelType);

  if (!region || !wallType || !fuelType) {
    throw new Error('Invalid calculator data');
  }

  const hdd = region.hdd;
  const windMultiplier = region.windMultiplier;
  const uInitial = wallType.uValue;
  const lambda = GREY_EPS_LAMBDA; // Always use Grey EPS
  const thicknessMeters = data.insulationThickness / 1000;

  // Calculate thermal resistance using full heat-flow path
  // R_total = R_si + R_wall + R_insulation + R_render + R_se
  // Note: the existing wall U-value already includes surface resistances,
  // so R_wall_only = 1/U - R_si - R_se (strip them out first)
  const rWallOnly = (1 / uInitial) - R_SI - R_SE;
  const rInsulation = thicknessMeters / lambda;
  const rTotal = R_SI + rWallOnly + rInsulation + R_RENDER + R_SE;
  const uImproved = 1 / rTotal;

  // Calculate energy consumption (kWh/year)
  // Formula: Area × U-value × 24 hours × HDD × Wind Multiplier / 1000
  const energyBefore = (data.wallArea * uInitial * 24 * hdd * windMultiplier) / 1000;
  const energyAfter = (data.wallArea * uImproved * 24 * hdd * windMultiplier) / 1000;
  const annualSavingsKwh = energyBefore - energyAfter;

  // Ventilation heat loss (constant before and after EWI)
  const ventilationLossKwh = Math.round(calculateVentilationLoss(data.floorArea, data.houseType, hdd));
  const totalEnergyBefore = energyBefore + ventilationLossKwh;
  const totalEnergyAfter = energyAfter + ventilationLossKwh;

  // Calculate cost savings
  let pricePerKwh: number;
  if (fuelType.id === 'oil' || fuelType.id === 'lpg') {
    pricePerKwh = data.fuelPrice / fuelType.kwhPerUnit;
  } else {
    pricePerKwh = data.fuelPrice;
  }

  // Savings in pence, accounting for boiler efficiency
  const savingsPence = (annualSavingsKwh * pricePerKwh) / fuelType.efficiency;
  const annualSavingsPounds = savingsPence / 100;

  // CO2 reduction
  const co2Before = energyBefore * fuelType.co2Factor;
  const co2After = energyAfter * fuelType.co2Factor;
  const co2ReductionKg = co2Before - co2After;

  // Trees equivalent
  const treesEquivalent = co2ReductionKg / CO2_PER_TREE_KG;

  // Savings percentage (wall only)
  const savingsPercentage = ((energyBefore - energyAfter) / energyBefore) * 100;
  
  // Total savings percentage (including ventilation in denominator)
  const totalSavingsPercentage = totalEnergyBefore > 0 
    ? ((annualSavingsKwh / totalEnergyBefore) * 100) 
    : 0;

  // ROI / Payback calculation (discounted, with energy inflation)
  const estimatedCost = data.wallArea * EWI_COST_PER_SQM;
  let paybackYears = 0;
  if (annualSavingsPounds > 0) {
    let remaining = estimatedCost;
    let year = 0;
    let lastYearSavings = 0;
    while (remaining > 0 && year < 50) {
      year++;
      lastYearSavings = annualSavingsPounds * Math.pow(1 + ENERGY_INFLATION_RATE, year - 1);
      remaining -= lastYearSavings;
    }
    if (remaining <= 0 && lastYearSavings > 0) {
      // Interpolate final year for precision
      paybackYears = year - 1 + (remaining + lastYearSavings) / lastYearSavings;
    } else {
      paybackYears = 50; // Never pays back within 50 years
    }
  }

  // 25-year projection with energy inflation
  const projectionData = calculateProjection(annualSavingsPounds, PROJECTION_YEARS, ENERGY_INFLATION_RATE);
  const totalSavings25Years = projectionData.at(-1)?.cumulative ?? 0;

  // EPC improvement estimate
  const { pointsGained } = estimateEPCImprovement(savingsPercentage, data.wallType, data.houseType, uImproved);

  // Financial reframing - Net Profit and ROI
  const roundedEstimatedCost = Math.round(estimatedCost);
  const roundedTotalSavings = Math.round(totalSavings25Years);
  const netProfit25Years = roundedTotalSavings - roundedEstimatedCost;
  const lifetimeROI = roundedEstimatedCost > 0 
    ? Math.round((netProfit25Years / roundedEstimatedCost) * 100) 
    : 0;

  return {
    annualSavingsKwh: Math.round(annualSavingsKwh),
    annualSavingsPounds: Math.round(annualSavingsPounds),
    co2ReductionKg: Math.round(co2ReductionKg),
    treesEquivalent: Math.round(treesEquivalent * 10) / 10,
    uValueBefore: Math.round(uInitial * 100) / 100,
    uValueAfter: Math.round(uImproved * 100) / 100,
    energyBefore: Math.round(energyBefore),
    energyAfter: Math.round(energyAfter),
    savingsPercentage: Math.round(savingsPercentage),
    ventilationLossKwh,
    totalEnergyBefore: Math.round(totalEnergyBefore),
    totalEnergyAfter: Math.round(totalEnergyAfter),
    totalSavingsPercentage: Math.round(totalSavingsPercentage),
    estimatedCost: roundedEstimatedCost,
    paybackYears: Math.round(paybackYears * 10) / 10,
    projectionData,
    totalSavings25Years: roundedTotalSavings,
    epcPointsGained: pointsGained,
    
    netProfit25Years,
    lifetimeROI,
  };
}

/**
 * Calculate 25-year savings projection with energy price inflation
 */
export function calculateProjection(
  annualSavings: number, 
  years: number, 
  inflationRate: number
): ProjectionDataPoint[] {
  const data: ProjectionDataPoint[] = [];
  let cumulative = 0;

  for (let year = 1; year <= years; year++) {
    const annual = annualSavings * Math.pow(1 + inflationRate, year - 1);
    cumulative += annual;
    data.push({
      year,
      annual: Math.round(annual),
      cumulative: Math.round(cumulative),
    });
  }

  return data;
}

/**
 * Estimate EPC improvement based on wall insulation savings
 * Uses dynamic base points by wall type, wall contribution by house type,
 * and a U-value bonus for achieving ≤0.30 W/m²K
 */
export function estimateEPCImprovement(
  savingsPercentage: number,
  wallTypeId: string,
  houseTypeId: string,
  uValueAfter: number
): {
  pointsGained: number;
} {
  const wallContribution = WALL_CONTRIBUTION[houseTypeId] ?? 0.3;
  const pointsPerPercent = 0.25; // Conservative estimate
  
  let pointsGained = Math.round(savingsPercentage * wallContribution * pointsPerPercent);
  
  // Golden Rule: bonus for achieving U-value ≤ 0.3
  if (uValueAfter <= 0.3) {
    pointsGained += 2;
  }

  return { pointsGained };
}
