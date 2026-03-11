import { HouseType, Region, WallType, FuelType, InsulationMaterial } from './types';

// Unit conversion
export const SQ_FT_PER_M2 = 10.764;
export const sqftToM2 = (sqft: number): number => sqft / SQ_FT_PER_M2;
export const m2ToSqft = (m2: number): number => m2 * SQ_FT_PER_M2;

// Wall names per house type
export const WALL_NAMES: Record<string, string[]> = {
  'detached': ['Front', 'Back', 'Left', 'Right'],
  'semi-detached': ['Front', 'Back', 'Side'],
  'mid-terrace': ['Front', 'Back'],
  'end-terrace': ['Front', 'Back', 'Side'],
  'bungalow': ['Front', 'Back', 'Left', 'Right'],
  'cottage': ['Front', 'Back', 'Left', 'Right'],
};

export function getExposedWallCount(houseTypeId: string): number {
  return WALL_NAMES[houseTypeId]?.length ?? 4;
}

export const HOUSE_TYPES: HouseType[] = [
  { id: 'detached', name: 'Detached', defaultArea: 110, icon: '🏠', floors: 2, referenceNettoWallArea: 164 },
  { id: 'semi-detached', name: 'Semi-Detached', defaultArea: 80, icon: '🏡', floors: 2, referenceNettoWallArea: 111 },
  { id: 'mid-terrace', name: 'Mid-Terrace', defaultArea: 65, icon: '🏘️', floors: 2, referenceNettoWallArea: 75 },
  { id: 'end-terrace', name: 'End-Terrace', defaultArea: 75, icon: '🏚️', floors: 2, referenceNettoWallArea: 92 },
  { id: 'bungalow', name: 'Bungalow', defaultArea: 70, icon: '🏕️', floors: 1, referenceNettoWallArea: 103 },
  { id: 'cottage', name: 'Cottage', defaultArea: 80, icon: '🛖', floors: 1, referenceNettoWallArea: 91 },
];

/**
 * Calculate external wall area from floor area and house type.
 * Uses UK reference netto wall areas scaled proportionally by floor area.
 */
export function calculateWallArea(floorArea: number, houseTypeId: string): number {
  const house = HOUSE_TYPES.find(h => h.id === houseTypeId);
  if (!house || floorArea <= 0) return 0;

  return Math.round(house.referenceNettoWallArea * (floorArea / house.defaultArea));
}

export const UK_REGIONS: Region[] = [
  // Scotland & Northern Ireland
  { id: 'scottish-highlands', name: 'Scottish Highlands', hdd: 3000, windZone: 4, windMultiplier: 1.45 },
  { id: 'scottish-lowlands', name: 'Scottish Lowlands', hdd: 2650, windZone: 3, windMultiplier: 1.3 },
  { id: 'northern-ireland', name: 'Northern Ireland', hdd: 2650, windZone: 3, windMultiplier: 1.3 },
  
  // Northern England
  { id: 'northumberland', name: 'Northumberland', hdd: 2650, windZone: 3, windMultiplier: 1.25 },
  { id: 'cumbria', name: 'Cumbria', hdd: 2700, windZone: 4, windMultiplier: 1.4 },
  { id: 'north-east', name: 'North East', hdd: 2600, windZone: 3, windMultiplier: 1.2 },
  { id: 'north-west', name: 'North West', hdd: 2500, windZone: 3, windMultiplier: 1.2 },
  
  // Central England
  { id: 'yorkshire-west', name: 'West Yorkshire', hdd: 2400, windZone: 2, windMultiplier: 1.15 },
  { id: 'yorkshire-south', name: 'South Yorkshire', hdd: 2350, windZone: 2, windMultiplier: 1.1 },
  { id: 'east-midlands', name: 'East Midlands', hdd: 2350, windZone: 2, windMultiplier: 1.1 },
  { id: 'west-midlands', name: 'West Midlands', hdd: 2300, windZone: 2, windMultiplier: 1.1 },
  { id: 'lincolnshire', name: 'Lincolnshire', hdd: 2250, windZone: 2, windMultiplier: 1.1 },
  
  // Wales
  { id: 'wales-north', name: 'North Wales', hdd: 2500, windZone: 4, windMultiplier: 1.4 },
  { id: 'wales-south', name: 'South Wales', hdd: 2300, windZone: 3, windMultiplier: 1.25 },
  
  // Eastern England
  { id: 'east-england', name: 'East of England', hdd: 2200, windZone: 2, windMultiplier: 1.15 },
  { id: 'kent', name: 'Kent', hdd: 2050, windZone: 2, windMultiplier: 1.1 },
  { id: 'sussex', name: 'Sussex', hdd: 2100, windZone: 2, windMultiplier: 1.1 },
  
  // Southern & South West
  { id: 'london', name: 'London', hdd: 2100, windZone: 1, windMultiplier: 1 },
  { id: 'hampshire', name: 'Hampshire', hdd: 2150, windZone: 2, windMultiplier: 1.1 },
  { id: 'south-east', name: 'South East', hdd: 2150, windZone: 2, windMultiplier: 1.1 },
  { id: 'south-west', name: 'South West', hdd: 2200, windZone: 3, windMultiplier: 1.25 },
  { id: 'devon', name: 'Devon', hdd: 2100, windZone: 3, windMultiplier: 1.2 },
  { id: 'cornwall', name: 'Cornwall', hdd: 1950, windZone: 3, windMultiplier: 1.3 },
];

// Wind zone descriptions
export const WIND_ZONE_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: 'Sheltered',
  2: 'Moderate',
  3: 'Severe',
  4: 'Very Severe',
};

export const WALL_TYPES: WallType[] = [
  {
    id: 'solid-brick',
    name: 'Solid Brick Walls',
    uValue: 2.1,
    description: 'Pre-1920s, 220–250mm',
  },
  {
    id: 'solid-stone',
    name: 'Solid Stone Walls',
    uValue: 2,
    description: 'Pre-1900, 450–600mm',
  },
  {
    id: 'concrete-block',
    name: 'Concrete Block Walls',
    uValue: 1.8,
    description: '1930s–1960s, 200–250mm',
  },
  {
    id: 'cavity-unfilled',
    name: 'Cavity Walls (Unfilled)',
    uValue: 1.5,
    description: '1920s–1980s, 250–270mm',
  },
];

export const FUEL_TYPES: FuelType[] = [
  {
    id: 'gas',
    name: 'Natural Gas',
    unit: 'p/kWh',
    defaultPrice: 7,
    efficiency: 0.9,
    kwhPerUnit: 1,
    co2Factor: 0.203,
  },
  {
    id: 'electricity',
    name: 'Electricity',
    unit: 'p/kWh',
    defaultPrice: 24.5,
    efficiency: 1,
    kwhPerUnit: 1,
    co2Factor: 0.233,
  },
  {
    id: 'oil',
    name: 'Heating Oil',
    unit: 'p/litre',
    defaultPrice: 65,
    efficiency: 0.85,
    kwhPerUnit: 10.35,
    co2Factor: 0.265,
  },
  {
    id: 'lpg',
    name: 'LPG',
    unit: 'p/litre',
    defaultPrice: 58,
    efficiency: 0.85,
    kwhPerUnit: 6.9,
    co2Factor: 0.214,
  },
];

export const INSULATION_MATERIALS: InsulationMaterial[] = [
  {
    id: 'grey-eps',
    name: 'Grey EPS',
    lambda: 0.032,
    description: 'High-performance graphite-enhanced polystyrene.',
    thicknesses: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
  },
];

// Grey EPS thermal conductivity for auto-calculation
export const GREY_EPS_LAMBDA = 0.032; // W/mK

// Surface thermal resistances (BS EN ISO 6946)
export const R_SI = 0.13; // m²K/W — internal surface resistance
export const R_SE = 0.04; // m²K/W — external surface resistance

// EWI render (silicone/acrylic render coat)
export const RENDER_THICKNESS = 0.006; // 6mm in metres
export const RENDER_LAMBDA = 0.8; // W/mK — typical render conductivity
export const R_RENDER = RENDER_THICKNESS / RENDER_LAMBDA; // ~0.0075 m²K/W

// Ventilation heat loss constants
export const AIR_HEAT_CAPACITY = 0.34; // Wh/m³K
export const DEFAULT_ACH = 1; // Air Changes per Hour (typical UK 1970-1990)
const STOREY_HEIGHT_VENT = 2.4; // metres (reuse same value)

/**
 * Calculate annual ventilation heat loss using Degree Days method
 * Formula: V * n * 0.34 * 24 * HDD / 1000 [kWh/year]
 * V = floorArea * (floors * storeyHeight)
 */
export function calculateVentilationLoss(floorArea: number, houseTypeId: string, hdd: number): number {
  const house = HOUSE_TYPES.find(h => h.id === houseTypeId);
  if (!house || floorArea <= 0 || hdd <= 0) return 0;

  const volume = floorArea * (house.floors * STOREY_HEIGHT_VENT);
  return (volume * DEFAULT_ACH * AIR_HEAT_CAPACITY * 24 * hdd) / 1000;
}

// Target U-value per UK Building Regulations
export const TARGET_U_VALUE = 0.3; // W/m²K

export const TOTAL_STEPS = 5;

// CO2 absorbed by one tree per year (kg)
export const CO2_PER_TREE_KG = 21;

// EWI installation cost (£/m²) - UK market average
export const EWI_COST_PER_SQM = 120;

// Energy price inflation rate (5% annually)
export const ENERGY_INFLATION_RATE = 0.05;

// Projection horizon (typical EWI warranty period)
export const PROJECTION_YEARS = 25;

// EPC base points by wall type (SAP-based starting points)
export const EPC_BASE_POINTS: Record<string, number> = {
  'solid-brick': 48,
  'solid-stone': 45,
  'concrete-block': 50,
  'cavity-unfilled': 55,
};

// Wall contribution to total heat loss by house type
export const WALL_CONTRIBUTION: Record<string, number> = {
  'detached': 0.35,
  'semi-detached': 0.3,
  'mid-terrace': 0.2,
  'end-terrace': 0.3,
  'bungalow': 0.35,
  'cottage': 0.35,
};


/**
 * Calculate required insulation thickness to reach target U-value
 * Uses full thermal path: R_si + R_wall + R_insulation + R_render + R_se = 1/U_target
 * @param uInitial - Initial wall U-value in W/m²K
 * @returns Thickness in mm, rounded up to nearest 10mm
 */
export function calculateRequiredThickness(uInitial: number): number {
  const rWallOnly = (1 / uInitial) - R_SI - R_SE;
  const rTargetTotal = 1 / TARGET_U_VALUE;
  const rInsulationNeeded = rTargetTotal - R_SI - rWallOnly - R_RENDER - R_SE;
  const dMillimeters = Math.max(0, rInsulationNeeded * 1000 * GREY_EPS_LAMBDA);
  // Round up to nearest 10mm
  return Math.ceil(dMillimeters / 10) * 10;
}
