import { SystemProfile, SystemId } from '@/types/assessment';
import config from './systemsConfig.json';

const SCORE_KEY_MAP: Record<string, keyof SystemProfile['features']> = {
  investmentCost: 'cost',
  thicknessEfficiency: 'thicknessEfficiency',
  fireSafety: 'fire',
  breathability: 'breathability',
  acoustics: 'acoustics',
  summerComfort: 'summerComfort',
  installationRobustness: 'robustness',
  environmental: 'eco',
};

function buildSystems(): Record<SystemId, SystemProfile> {
  const result = {} as Record<SystemId, SystemProfile>;

  for (const sys of config.systems) {
    const id = sys.id as SystemId;
    const features = {} as SystemProfile['features'];

    for (const [jsonKey, internalKey] of Object.entries(SCORE_KEY_MAP)) {
      features[internalKey] = (sys.scores as Record<string, number>)[jsonKey] / 100;
    }

    result[id] = {
      id,
      name: sys.name,
      fullName: sys.fullName,
      color: sys.color,
      features,
      lambdaValue: sys.technical.lambdaValue,
      typicalCostRange: sys.technical.costRange as [number, number],
      minThicknessPerWallType: (sys.technical).minThicknessPerWallType as Record<string, number>,
      minThicknessFor03U: Math.max(...Object.values((sys.technical).minThicknessPerWallType as Record<string, number>)),
      fireClass: sys.technical.fireClass,
      pros: sys.strengths,
      cons: sys.considerations,
      components: (sys).components || {},
      technicalNotes: (sys).technicalNotes || [],
    };
  }

  return result;
}

export const SYSTEMS = buildSystems();

export const SYSTEM_IDS: SystemId[] = config.systems.map((s) => s.id as SystemId);

export const getSystem = (id: SystemId): SystemProfile => SYSTEMS[id];

export const FEATURE_LABELS: Record<string, string> = Object.entries(config.featureLabels).reduce(
  (acc, [jsonKey, label]) => {
    const internalKey = SCORE_KEY_MAP[jsonKey] || jsonKey;
    acc[internalKey] = label;
    return acc;
  },
  {} as Record<string, string>,
);
