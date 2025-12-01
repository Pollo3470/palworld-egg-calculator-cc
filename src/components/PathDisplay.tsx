'use client';

import type { BreedingPath } from '@/types';
import type { Pal } from '@/types';
import { getPalById } from '@/lib/breeding';
import BreedingStepDisplay from './BreedingStep';

interface PathDisplayProps {
  paths: BreedingPath[];
  startPal: Pal;
  targetPal: Pal;
}

export default function PathDisplay({
  paths,
  startPal,
  targetPal,
}: PathDisplayProps) {
  if (paths.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <div className="text-gray-500">
          未找到从 <span className="font-medium">{startPal.name}</span> 到{' '}
          <span className="font-medium">{targetPal.name}</span> 的配种路径
        </div>
        <div className="text-sm text-gray-400 mt-2">
          可能原因：两个帕鲁之间没有可行的配种路线
        </div>
      </div>
    );
  }

  // 如果起始和目标相同
  if (paths[0].depth === 0) {
    return (
      <div className="p-6 bg-green-50 rounded-lg text-center">
        <div className="text-green-700">
          <span className="font-medium">{startPal.name}</span> 就是目标帕鲁！
        </div>
      </div>
    );
  }

  const minDepth = paths[0].depth;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          配种路径
        </h3>
        <div className="text-sm text-gray-500">
          共 {paths.length} 条路径，最短 {minDepth} 代
        </div>
      </div>

      <div className="space-y-6">
        {paths.map((path, pathIndex) => (
          <div
            key={pathIndex}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                路径 {pathIndex + 1}
              </span>
              <span className="text-sm text-gray-500">
                {path.depth} 代配种
              </span>
            </div>

            <div className="space-y-3">
              {path.steps.map((step, stepIndex) => {
                const fromPal = getPalById(step.from);
                const partnerPal = getPalById(step.partner);
                const resultPal = getPalById(step.result);

                if (!fromPal || !partnerPal || !resultPal) {
                  return null;
                }

                return (
                  <BreedingStepDisplay
                    key={stepIndex}
                    from={fromPal}
                    partner={partnerPal}
                    result={resultPal}
                    stepNumber={stepIndex + 1}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
