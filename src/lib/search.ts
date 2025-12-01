/**
 * 帕鲁模糊搜索
 */

import type { Pal } from '@/types';
import { getAllPals, getBreedablePals } from './breeding';

/**
 * 模糊搜索帕鲁
 * @param query 搜索关键词（支持中文名、英文名、ID）
 * @param onlyBreedable 是否只搜索可配种的帕鲁
 * @param limit 最大返回数量
 * @returns 匹配的帕鲁列表
 */
export function searchPals(
  query: string,
  onlyBreedable: boolean = true,
  limit: number = 20
): Pal[] {
  if (!query || query.trim() === '') {
    // 空查询返回所有帕鲁（限制数量）
    const pals = onlyBreedable ? getBreedablePals() : getAllPals();
    return pals.slice(0, limit);
  }

  const normalizedQuery = query.toLowerCase().trim();
  const pals = onlyBreedable ? getBreedablePals() : getAllPals();

  // 计算每个帕鲁的匹配分数
  const scoredPals: Array<{ pal: Pal; score: number }> = [];

  for (const pal of pals) {
    const score = calculateMatchScore(pal, normalizedQuery);
    if (score > 0) {
      scoredPals.push({ pal, score });
    }
  }

  // 按分数降序排序
  scoredPals.sort((a, b) => b.score - a.score);

  return scoredPals.slice(0, limit).map(item => item.pal);
}

/**
 * 计算帕鲁与搜索关键词的匹配分数
 */
function calculateMatchScore(pal: Pal, query: string): number {
  let score = 0;

  const nameLower = pal.name.toLowerCase();
  const nameEnLower = pal.nameEn.toLowerCase();
  const idLower = pal.id.toLowerCase();

  // 精确匹配 ID
  if (idLower === query) {
    score += 100;
  }
  // ID 前缀匹配
  else if (idLower.startsWith(query)) {
    score += 80;
  }
  // ID 包含
  else if (idLower.includes(query)) {
    score += 40;
  }

  // 精确匹配中文名
  if (nameLower === query) {
    score += 100;
  }
  // 中文名前缀匹配
  else if (nameLower.startsWith(query)) {
    score += 70;
  }
  // 中文名包含
  else if (nameLower.includes(query)) {
    score += 50;
  }

  // 精确匹配英文名
  if (nameEnLower === query) {
    score += 90;
  }
  // 英文名前缀匹配
  else if (nameEnLower.startsWith(query)) {
    score += 60;
  }
  // 英文名包含
  else if (nameEnLower.includes(query)) {
    score += 30;
  }

  return score;
}

/**
 * 高亮搜索结果中的匹配文字
 * @param text 原始文字
 * @param query 搜索关键词
 * @returns 带高亮标记的文字片段数组
 */
export function highlightMatch(
  text: string,
  query: string
): Array<{ text: string; highlight: boolean }> {
  if (!query || query.trim() === '') {
    return [{ text, highlight: false }];
  }

  const normalizedQuery = query.toLowerCase();
  const normalizedText = text.toLowerCase();
  const index = normalizedText.indexOf(normalizedQuery);

  if (index === -1) {
    return [{ text, highlight: false }];
  }

  const result: Array<{ text: string; highlight: boolean }> = [];

  if (index > 0) {
    result.push({ text: text.slice(0, index), highlight: false });
  }

  result.push({
    text: text.slice(index, index + query.length),
    highlight: true,
  });

  if (index + query.length < text.length) {
    result.push({
      text: text.slice(index + query.length),
      highlight: false,
    });
  }

  return result;
}
