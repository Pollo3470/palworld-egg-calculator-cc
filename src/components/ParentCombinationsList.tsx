'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Pal, BreedingCombination } from '@/types';
import { getPalById } from '@/lib/breeding';

interface ParentCombinationsListProps {
  childPal: Pal;
  combinations: BreedingCombination[];
}

function PalImage({ pal }: { pal: Pal }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs font-medium">
        {pal.name.slice(0, 2)}
      </div>
    );
  }

  return (
    <Image
      src={pal.iconUrl}
      alt={pal.name}
      fill
      className="object-contain"
      unoptimized
      onError={() => setHasError(true)}
    />
  );
}

export default function ParentCombinationsList({
  childPal,
  combinations,
}: ParentCombinationsListProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {childPal.name} 的配种方案
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        共 {combinations.length} 种父母组合可以产出该帕鲁
      </p>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {combinations.map((combo) => {
          const parent1 = getPalById(combo.parent1);
          const parent2 = getPalById(combo.parent2);

          if (!parent1 || !parent2) return null;

          return (
            <div
              key={`${combo.parent1}_${combo.parent2}`}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0">
                <PalImage pal={parent1} />
              </div>
              <div className="text-xs text-gray-700 min-w-12 truncate">
                {parent1.name}
              </div>

              <div className="text-lg text-gray-400">+</div>

              <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0">
                <PalImage pal={parent2} />
              </div>
              <div className="text-xs text-gray-700 min-w-12 truncate">
                {parent2.name}
              </div>

              <div className="text-lg text-gray-400 mx-2">=</div>

              <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0">
                <PalImage pal={childPal} />
              </div>
              <div className="text-xs text-gray-700 min-w-12 truncate">
                {childPal.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
