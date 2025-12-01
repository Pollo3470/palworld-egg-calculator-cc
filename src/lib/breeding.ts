/**
 * 帕鲁配种逻辑
 */

import type { Pal, PalData, BreedingGraph, BreedingEdge, UniqueBreeding } from '@/types';
import palDataJson from '@/data/pals.json';

// 加载帕鲁数据
const palData: PalData = palDataJson as PalData;

// 获取所有帕鲁列表
export function getAllPals(): Pal[] {
  return palData.pals;
}

// 获取可配种的帕鲁列表（排除 ignoreCombi 的帕鲁）
export function getBreedablePals(): Pal[] {
  return palData.pals.filter(pal => !pal.ignoreCombi);
}

// 根据 ID 获取帕鲁
export function getPalById(id: string): Pal | undefined {
  return palData.pals.find(pal => pal.id === id);
}

// 根据 Code 获取帕鲁
export function getPalByCode(code: string): Pal | undefined {
  return palData.pals.find(pal => pal.code === code);
}

// 创建 ID -> Pal 映射
const palMap = new Map<string, Pal>();
for (const pal of palData.pals) {
  palMap.set(pal.id, pal);
}

export function getPalMap(): Map<string, Pal> {
  return palMap;
}

// 特殊配种组合映射：`parent1_parent2` -> childId
const uniqueBreedingMap = new Map<string, string>();
for (const combo of palData.uniqueBreedings) {
  // 双向添加，因为父母顺序不影响结果
  uniqueBreedingMap.set(`${combo.parent1}_${combo.parent2}`, combo.child);
  uniqueBreedingMap.set(`${combo.parent2}_${combo.parent1}`, combo.child);
}

/**
 * 计算两个帕鲁配种后的后代配种力
 */
export function calculateOffspringBreedingPower(parent1Power: number, parent2Power: number): number {
  return Math.floor((parent1Power + parent2Power + 1) / 2);
}

/**
 * 根据配种力找到最接近的帕鲁
 */
export function findPalByBreedingPower(targetPower: number, excludeIds: Set<string>): Pal | undefined {
  const breedablePals = getBreedablePals();

  let closestPal: Pal | undefined;
  let closestDiff = Infinity;

  for (const pal of breedablePals) {
    if (excludeIds.has(pal.id)) continue;

    const diff = Math.abs(pal.breedingPower - targetPower);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestPal = pal;
    } else if (diff === closestDiff && closestPal) {
      // 如果配种力差距相同，优先选择 ID 较小的（非变体）
      if (pal.id < closestPal.id) {
        closestPal = pal;
      }
    }
  }

  return closestPal;
}

/**
 * 计算两个帕鲁配种产生的后代
 */
export function getBreedingChild(parent1Id: string, parent2Id: string): string | undefined {
  const parent1 = getPalById(parent1Id);
  const parent2 = getPalById(parent2Id);

  if (!parent1 || !parent2) return undefined;
  if (parent1.ignoreCombi || parent2.ignoreCombi) return undefined;

  // 检查是否是特殊组合
  const uniqueKey = `${parent1Id}_${parent2Id}`;
  if (uniqueBreedingMap.has(uniqueKey)) {
    return uniqueBreedingMap.get(uniqueKey);
  }

  // 普通配种：计算配种力平均值，找最接近的帕鲁
  const targetPower = calculateOffspringBreedingPower(parent1.breedingPower, parent2.breedingPower);

  // 特殊组合产物不能通过普通配种获得，需要排除
  const uniqueChildIds = new Set(palData.uniqueBreedings.map(b => b.child));

  const child = findPalByBreedingPower(targetPower, uniqueChildIds);
  return child?.id;
}

/**
 * 获取特殊配种组合列表
 */
export function getUniqueBreedings(): UniqueBreeding[] {
  return palData.uniqueBreedings;
}

/**
 * 构建配种图
 * 对每个帕鲁，计算它与所有其他帕鲁配种能产生的后代
 */
export function buildBreedingGraph(): BreedingGraph {
  const graph: BreedingGraph = new Map();
  const breedablePals = getBreedablePals();

  for (const pal1 of breedablePals) {
    const edges: BreedingEdge[] = [];

    for (const pal2 of breedablePals) {
      const childId = getBreedingChild(pal1.id, pal2.id);
      if (childId && childId !== pal1.id) {
        // 检查是否已经存在相同的边（避免重复）
        const existingEdge = edges.find(e => e.child === childId && e.partner === pal2.id);
        if (!existingEdge) {
          edges.push({
            partner: pal2.id,
            child: childId,
          });
        }
      }
    }

    graph.set(pal1.id, edges);
  }

  return graph;
}

// 缓存配种图
let cachedBreedingGraph: BreedingGraph | null = null;

/**
 * 获取配种图（带缓存）
 */
export function getBreedingGraph(): BreedingGraph {
  if (!cachedBreedingGraph) {
    cachedBreedingGraph = buildBreedingGraph();
  }
  return cachedBreedingGraph;
}
