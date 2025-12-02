'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Pal, GroupedBreedingOptions } from '@/types';

interface BreedingCombinationsListProps {
  parentPal: Pal;
  groups: GroupedBreedingOptions[];
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

function CollapsibleGroup({
  parentPal,
  group,
}: {
  parentPal: Pal;
  group: GroupedBreedingOptions;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 transition-colors"
      >
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>

        <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-50 shadow-sm flex-shrink-0">
          <PalImage pal={group.child} />
        </div>

        <div className="flex-1 text-left">
          <span className="font-medium text-gray-900">{group.child.name}</span>
          <span className="text-gray-500 text-sm ml-2">#{group.child.id}</span>
        </div>

        <span className="text-sm text-gray-500">{group.partners.length} 种方案</span>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-3 space-y-2">
          {group.partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center gap-2 p-2 bg-white rounded-lg"
            >
              <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-50 shadow-sm flex-shrink-0">
                <PalImage pal={parentPal} />
              </div>
              <span className="text-xs text-gray-500">{parentPal.name}</span>

              <div className="text-lg text-gray-400">+</div>

              <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-50 shadow-sm flex-shrink-0">
                <PalImage pal={partner} />
              </div>
              <span className="text-xs text-gray-500">{partner.name}</span>

              <div className="text-lg text-gray-400 mx-2">=</div>

              <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-50 shadow-sm flex-shrink-0">
                <PalImage pal={group.child} />
              </div>
              <span className="text-xs text-gray-500">{group.child.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BreedingCombinationsList({
  parentPal,
  groups,
}: BreedingCombinationsListProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {parentPal.name} 的配种方案
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        共 {groups.length} 种不同子代，点击展开查看详情
      </p>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {groups.map((group) => (
          <CollapsibleGroup
            key={group.child.id}
            parentPal={parentPal}
            group={group}
          />
        ))}
      </div>
    </div>
  );
}
