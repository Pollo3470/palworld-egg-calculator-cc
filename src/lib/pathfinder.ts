/**
 * 帕鲁配种路径查找算法
 * 使用 BFS 查找从起始帕鲁到目标帕鲁的最短配种路径
 */

import type { BreedingPath, BreedingStep, SearchState } from '@/types';
import { getBreedingGraph, getPalById } from './breeding';

/**
 * 查找从起始帕鲁到目标帕鲁的最短配种路径
 * @param startPalId 起始帕鲁 ID
 * @param targetPalId 目标帕鲁 ID
 * @param maxPaths 最大返回路径数量
 * @param maxDepth 最大搜索深度（防止无限搜索）
 * @returns 配种路径数组
 */
export function findBreedingPaths(
  startPalId: string,
  targetPalId: string,
  maxPaths: number = 5,
  maxDepth: number = 10
): BreedingPath[] {
  // 验证输入
  const startPal = getPalById(startPalId);
  const targetPal = getPalById(targetPalId);

  if (!startPal || !targetPal) {
    return [];
  }

  // 如果起始帕鲁和目标帕鲁相同
  if (startPalId === targetPalId) {
    return [{
      steps: [],
      depth: 0,
    }];
  }

  const graph = getBreedingGraph();
  const paths: BreedingPath[] = [];

  // BFS 队列
  const queue: SearchState[] = [{
    palId: startPalId,
    path: [],
    depth: 0,
  }];

  // 记录到达每个帕鲁的最短深度
  const minDepthToTarget = new Map<string, number>();
  let targetDepth = -1;

  while (queue.length > 0 && paths.length < maxPaths) {
    const current = queue.shift()!;

    // 如果已经找到了路径，只继续搜索同深度的路径
    if (targetDepth >= 0 && current.depth > targetDepth) {
      break;
    }

    // 超过最大深度
    if (current.depth >= maxDepth) {
      continue;
    }

    // 获取当前帕鲁的所有可能配种结果
    const edges = graph.get(current.palId) || [];

    // 按后代 ID 分组，避免重复搜索
    const childToPartners = new Map<string, string[]>();
    for (const edge of edges) {
      if (!childToPartners.has(edge.child)) {
        childToPartners.set(edge.child, []);
      }
      childToPartners.get(edge.child)!.push(edge.partner);
    }

    for (const [childId, partners] of childToPartners) {
      const newDepth = current.depth + 1;

      // 检查是否已经有更短的路径到达这个帕鲁
      const existingMinDepth = minDepthToTarget.get(childId);
      if (existingMinDepth !== undefined && existingMinDepth < newDepth) {
        continue;
      }

      // 为每个可能的配对创建新路径（限制数量避免爆炸）
      const limitedPartners = partners.slice(0, 3);

      for (const partnerId of limitedPartners) {
        const newStep: BreedingStep = {
          from: current.palId,
          partner: partnerId,
          result: childId,
        };

        const newPath = [...current.path, newStep];

        // 找到目标帕鲁
        if (childId === targetPalId) {
          if (targetDepth < 0) {
            targetDepth = newDepth;
          }

          paths.push({
            steps: newPath,
            depth: newDepth,
          });

          if (paths.length >= maxPaths) {
            break;
          }
        } else {
          // 继续搜索
          // 更新到达该帕鲁的最短深度
          if (existingMinDepth === undefined || existingMinDepth >= newDepth) {
            minDepthToTarget.set(childId, newDepth);

            queue.push({
              palId: childId,
              path: newPath,
              depth: newDepth,
            });
          }
        }
      }

      if (paths.length >= maxPaths) {
        break;
      }
    }
  }

  return paths;
}

/**
 * 查找可以产生目标帕鲁的所有父母组合
 * @param targetPalId 目标帕鲁 ID
 * @returns 父母组合数组
 */
export function findParentCombinations(
  targetPalId: string
): Array<{ parent1: string; parent2: string }> {
  const graph = getBreedingGraph();
  const combinations: Array<{ parent1: string; parent2: string }> = [];

  // 遍历所有帕鲁
  for (const [palId, edges] of graph) {
    for (const edge of edges) {
      if (edge.child === targetPalId) {
        // 避免重复（A+B 和 B+A 是同一个组合）
        const existing = combinations.find(
          c =>
            (c.parent1 === palId && c.parent2 === edge.partner) ||
            (c.parent1 === edge.partner && c.parent2 === palId)
        );

        if (!existing) {
          combinations.push({
            parent1: palId,
            parent2: edge.partner,
          });
        }
      }
    }
  }

  return combinations;
}
