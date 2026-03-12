import { AssessmentAnswers, ExcludedSystem, HardConstraintResult, SystemId } from '@/types/assessment';
import { SYSTEMS, SYSTEM_IDS } from '@/data/systems';
import config from '@/data/systemsConfig.json';

const systemConfigs = new Map(config.systems.map((s) => [s.id as SystemId, s]));

function mapWallType(wallType: string | null): string {
  switch (wallType) {
    case 'Solid Brick Walls': return 'solidBrick';
    case 'Solid Stone Walls': return 'solidStone';
    case 'Concrete Blocks': return 'concreteBlocks';
    case 'Cavity Walls - Unfilled': return 'cavityUnfilled';
    case 'Timber Frame': return 'timberFrame';
    default: return 'solidStone';
  }
}
export function evaluateHardConstraints(answers: AssessmentAnswers): HardConstraintResult {
  const excludedMap = new Map<SystemId, ExcludedSystem>();

  for (const [id, cfg] of systemConfigs) {
    // Regulatory fire exclusion: buildings >11m require A1/A2 non-combustible systems
    const isHighRise = (answers.buildingHeight ?? 0) > 11;
    const fireRating = cfg.constraints.fireRatingAchievable;
    const isNonCombustible = fireRating === 'A1' || fireRating.startsWith('A2');

    if (isHighRise && !isNonCombustible) {
      excludedMap.set(id, {
        systemId: id,
        reasonCode: 'FIRE_HEIGHT_REG',
        humanReason: `UK Building Regs require non-combustible (A1/A2) systems for buildings over 11m. ${SYSTEMS[id].name} (${fireRating}) does not qualify.`,
        triggerField: 'buildingHeight',
        severity: 'hard',
      });
    }

    // Fire class exclusion (user-selected fire requirement)
    if (
      !excludedMap.has(id) &&
      answers.fireRequirements.length > 0 &&
      answers.fireClass &&
      cfg.constraints.excludeWhenFireClass.includes(answers.fireClass)
    ) {
      excludedMap.set(id, {
        systemId: id,
        reasonCode: 'FIRE_CLASS',
        humanReason: `${SYSTEMS[id].name} (${fireRating}) does not meet the required ${answers.fireClass} fire classification.`,
        triggerField: 'fireClass',
        severity: 'hard',
      });
    }

    // Height limit
    if (
      cfg.constraints.maxHeightM !== null &&
      answers.buildingHeight !== null &&
      answers.buildingHeight > cfg.constraints.maxHeightM
    ) {
      if (!excludedMap.has(id)) {
        excludedMap.set(id, {
          systemId: id,
          reasonCode: 'HEIGHT_LIMIT',
          humanReason: `Building height (${answers.buildingHeight}m) exceeds ${cfg.constraints.maxHeightM}m limit for ${SYSTEMS[id].name}.`,
          triggerField: 'buildingHeight',
          severity: 'hard',
        });
      }
    }

    // Thickness limit
    if (answers.hasThicknessLimit && answers.maxThickness) {
      const wallTypeKey = mapWallType(answers.wallType);
      const thicknessMap = (cfg.technical).minThicknessPerWallType as Record<string, number>;
      const minThickness = thicknessMap[wallTypeKey] ?? Math.max(...Object.values(thicknessMap));
      if (minThickness > answers.maxThickness && !excludedMap.has(id)) {
        excludedMap.set(id, {
          systemId: id,
          reasonCode: 'THICKNESS_LIMIT',
          humanReason: `${SYSTEMS[id].name} needs ${minThickness}mm minimum for your wall type but only ${answers.maxThickness}mm available.`,
          triggerField: 'maxThickness',
          severity: 'hard',
        });
      }
    }
  }

  const excluded = Array.from(excludedMap.values());
  const excludedIds = new Set(excluded.map((e) => e.systemId));
  const eligible = SYSTEM_IDS.filter((id) => !excludedIds.has(id));

  return { eligible, excluded };
}
