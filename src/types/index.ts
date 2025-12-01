/**
 * 帕鲁配种计算器类型定义
 */

// 帕鲁基础信息
export interface Pal {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  breedingPower: number;
  iconUrl: string;
  ignoreCombi: boolean;
}

// 特殊配种组合
export interface UniqueBreeding {
  parent1: string;
  parent2: string;
  child: string;
}

// 帕鲁数据文件结构
export interface PalData {
  pals: Pal[];
  uniqueBreedings: UniqueBreeding[];
  version: string;
  updatedAt: string;
}

// 配种步骤
export interface BreedingStep {
  from: string;      // 当前帕鲁 ID
  partner: string;   // 配对帕鲁 ID
  result: string;    // 产生的后代 ID
}

// 配种路径
export interface BreedingPath {
  steps: BreedingStep[];
  depth: number;     // 配种代数
}

// 配种图边信息
export interface BreedingEdge {
  partner: string;   // 配对帕鲁 ID
  child: string;     // 后代帕鲁 ID
}

// 配种邻接表：palId -> [可能的配种结果]
export type BreedingGraph = Map<string, BreedingEdge[]>;

// BFS 搜索状态
export interface SearchState {
  palId: string;
  path: BreedingStep[];
  depth: number;
}
