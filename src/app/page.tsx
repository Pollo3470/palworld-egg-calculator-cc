'use client';

import { useState, useCallback } from 'react';
import type { Pal, BreedingPath } from '@/types';
import PalSelector from '@/components/PalSelector';
import PathDisplay from '@/components/PathDisplay';
import { findBreedingPaths } from '@/lib/pathfinder';

export default function Home() {
  const [startPal, setStartPal] = useState<Pal | null>(null);
  const [targetPal, setTargetPal] = useState<Pal | null>(null);
  const [paths, setPaths] = useState<BreedingPath[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleCalculate = useCallback(() => {
    if (!startPal || !targetPal) return;

    setIsCalculating(true);
    setHasSearched(false);

    // 使用 setTimeout 让 UI 有机会更新
    setTimeout(() => {
      const result = findBreedingPaths(startPal.id, targetPal.id, 5, 8);
      setPaths(result);
      setIsCalculating(false);
      setHasSearched(true);
    }, 50);
  }, [startPal, targetPal]);

  const canCalculate = startPal && targetPal && !isCalculating;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 标题 */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            帕鲁配种路径计算器
          </h1>
          <p className="text-gray-600">
            选择起始帕鲁和目标帕鲁，计算最短配种路径
          </p>
        </header>

        {/* 选择器区域 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="space-y-6">
            {/* 起始帕鲁选择 */}
            <div>
              <PalSelector
                value={startPal}
                onChange={setStartPal}
                label="起始帕鲁"
                placeholder="搜索起始帕鲁（输入名称或 ID）..."
              />
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

            {/* 目标帕鲁选择 */}
            <div>
              <PalSelector
                value={targetPal}
                onChange={setTargetPal}
                label="目标帕鲁"
                placeholder="搜索目标帕鲁（输入名称或 ID）..."
              />
            </div>
          </div>

          {/* 计算按钮 */}
          <div className="mt-6">
            <button
              onClick={handleCalculate}
              disabled={!canCalculate}
              className={`
                w-full py-3 px-4 rounded-lg font-medium text-white transition-all
                ${canCalculate
                  ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              {isCalculating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  计算中...
                </span>
              ) : (
                '计算配种路径'
              )}
            </button>
          </div>
        </div>

        {/* 结果区域 */}
        {hasSearched && startPal && targetPal && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <PathDisplay
              paths={paths}
              startPal={startPal}
              targetPal={targetPal}
            />
          </div>
        )}

        {/* 使用说明 */}
        {!hasSearched && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-medium text-gray-900 mb-3">使用说明</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">1.</span>
                在「起始帕鲁」中选择你当前拥有的帕鲁
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">2.</span>
                在「目标帕鲁」中选择你想要获得的帕鲁
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">3.</span>
                点击「计算配种路径」查看最短的配种方案
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">4.</span>
                每条路径会显示每一步需要配对的帕鲁
              </li>
            </ul>
          </div>
        )}

        {/* 页脚 */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>帕鲁配种数据来自 Palworld v0.6</p>
        </footer>
      </div>
    </div>
  );
}
