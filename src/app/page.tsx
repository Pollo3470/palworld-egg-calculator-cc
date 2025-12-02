'use client';

import { useState, useMemo } from 'react';
import type { Pal } from '@/types';
import PalSelector from '@/components/PalSelector';
import PathDisplay from '@/components/PathDisplay';
import SingleBreedingResult from '@/components/SingleBreedingResult';
import BreedingCombinationsList from '@/components/BreedingCombinationsList';
import ParentCombinationsList from '@/components/ParentCombinationsList';
import { findBreedingPaths } from '@/lib/pathfinder';
import {
  getBreedingChild,
  getPalById,
  getBreedingOptionsForParent,
  getParentCombinationsForChild,
} from '@/lib/breeding';

// 结构化数据
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "帕鲁配种计算器",
  "description": "幻兽帕鲁配种计算器，支持查询配种结果、父母组合、配种路径。选择父母查看子代，选择子代查看所有父母组合，实时计算最短配种路线。",
  "url": "https://palworld-egg.pollochen.com",
  "applicationCategory": "GameApplication",
  "operatingSystem": "Web",
  "softwareVersion": "2.0",
  "featureList": [
    "选择两个父母查看配种结果",
    "选择单个父母查看所有配种方案",
    "选择子代查看所有父母组合",
    "计算最短配种路径",
    "支持中文搜索"
  ],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CNY"
  },
  "author": {
    "@type": "Person",
    "name": "Pollo"
  }
};

export default function Home() {
  const [parent1, setParent1] = useState<Pal | null>(null);
  const [parent2, setParent2] = useState<Pal | null>(null);
  const [child, setChild] = useState<Pal | null>(null);

  // 互斥逻辑：选择第三个时自动清空
  const handleParent1Change = (pal: Pal | null) => {
    if (pal && parent2 && child) {
      setChild(null);
    }
    setParent1(pal);
  };

  const handleParent2Change = (pal: Pal | null) => {
    if (pal && parent1 && child) {
      setChild(null);
    }
    setParent2(pal);
  };

  const handleChildChange = (pal: Pal | null) => {
    if (pal && parent1 && parent2) {
      setParent2(null);
    }
    setChild(pal);
  };

  // 实时计算结果
  const result = useMemo(() => {
    // 双亲本 → 单个配种结果
    if (parent1 && parent2) {
      const childId = getBreedingChild(parent1.id, parent2.id);
      const childPal = childId ? getPalById(childId) : undefined;
      if (childPal) {
        return { type: 'single' as const, parent1, parent2, child: childPal };
      }
      return null;
    }

    // 亲本 + 子代 → 配种路径
    if ((parent1 || parent2) && child) {
      const startPal = parent1 || parent2;
      if (startPal) {
        const paths = findBreedingPaths(startPal.id, child.id, 5, 8);
        return { type: 'paths' as const, paths, startPal, targetPal: child };
      }
    }

    // 单亲本 → 分组配种方案
    if (parent1 || parent2) {
      const parentPal = parent1 || parent2;
      if (parentPal) {
        const groups = getBreedingOptionsForParent(parentPal.id);
        return { type: 'groups' as const, parentPal, groups };
      }
    }

    // 单子代 → 父母组合列表
    if (child) {
      const combinations = getParentCombinationsForChild(child.id);
      return { type: 'combinations' as const, childPal: child, combinations };
    }

    return null;
  }, [parent1, parent2, child]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 标题 */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            帕鲁配种计算器
          </h1>
          <p className="text-gray-600">
            选择父母或子代，查看配种方案
          </p>
        </header>

        {/* 选择器区域 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="space-y-6">
            {/* 父母选择行 */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <PalSelector
                  value={parent1}
                  onChange={handleParent1Change}
                  label="父母1"
                  placeholder="搜索帕鲁..."
                />
              </div>

              {/* 加号 */}
              <div className="flex items-center justify-center pt-8">
                <div className="p-2 bg-gray-100 rounded-full">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <PalSelector
                  value={parent2}
                  onChange={handleParent2Change}
                  label="父母2"
                  placeholder="搜索帕鲁..."
                />
              </div>
            </div>

            {/* 箭头 */}
            <div className="flex justify-center">
              <div className="p-2 bg-gray-100 rounded-full">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>

            {/* 子代选择 */}
            <div className="max-w-xs mx-auto">
              <PalSelector
                value={child}
                onChange={handleChildChange}
                label="子代"
                placeholder="搜索帕鲁..."
              />
            </div>
          </div>
        </div>

        {/* 结果区域 */}
        {result && (
          <div className="bg-white rounded-xl shadow-sm">
            {result.type === 'single' && (
              <SingleBreedingResult
                parent1={result.parent1}
                parent2={result.parent2}
                child={result.child}
              />
            )}

            {result.type === 'paths' && (
              <PathDisplay
                paths={result.paths}
                startPal={result.startPal}
                targetPal={result.targetPal}
              />
            )}

            {result.type === 'groups' && (
              <BreedingCombinationsList
                parentPal={result.parentPal}
                groups={result.groups}
              />
            )}

            {result.type === 'combinations' && (
              <ParentCombinationsList
                childPal={result.childPal}
                combinations={result.combinations}
              />
            )}
          </div>
        )}

        {/* 使用说明 */}
        {!result && (
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-medium text-gray-900 mb-3">使用说明</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">1.</span>
                <span>选择单个父母，查看该帕鲁的所有配种方案</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">2.</span>
                <span>选择两个父母，查看配种结果</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">3.</span>
                <span>选择父母和子代，查看最短配种路径</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">4.</span>
                <span>只选择子代，查看所有可产出该帕鲁的父母组合</span>
              </li>
            </ul>
          </section>
        )}

        {/* 页脚 */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>帕鲁配种数据来自 Palworld v0.6</p>
        </footer>
      </div>
    </div>
    </>
  );
}
