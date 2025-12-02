'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Pal } from '@/types';

interface SingleBreedingResultProps {
  parent1: Pal;
  parent2: Pal;
  child: Pal;
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

export default function SingleBreedingResult({
  parent1,
  parent2,
  child,
}: SingleBreedingResultProps) {
  const renderPal = (pal: Pal, label: string) => (
    <div className="flex flex-col items-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-50 shadow-sm">
        <PalImage pal={pal} />
      </div>
      <div className="mt-1 text-sm font-medium text-gray-900 text-center max-w-20 truncate">
        {pal.name}
      </div>
      <div className="text-xs text-gray-500">#{pal.id}</div>
    </div>
  );

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">配种结果</h3>
      <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
        {renderPal(parent1, '父母1')}
        <div className="text-2xl text-gray-400">+</div>
        {renderPal(parent2, '父母2')}
        <div className="text-2xl text-gray-400">=</div>
        {renderPal(child, '子代')}
      </div>
    </div>
  );
}
