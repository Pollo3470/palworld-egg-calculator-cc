'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Pal } from '@/types';

interface BreedingStepDisplayProps {
  from: Pal;
  partner: Pal;
  result: Pal;
  stepNumber: number;
}

// 图片占位符组件
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

export default function BreedingStepDisplay({
  from,
  partner,
  result,
  stepNumber,
}: BreedingStepDisplayProps) {
  const renderPal = (pal: Pal, label?: string) => (
    <div className="flex flex-col items-center">
      {label && (
        <div className="text-xs text-gray-500 mb-1">{label}</div>
      )}
      <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-gray-50 shadow-sm">
        <PalImage pal={pal} />
      </div>
      <div className="mt-1 text-sm font-medium text-gray-900 text-center max-w-16 truncate">
        {pal.name}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
      <div className="text-sm font-semibold text-gray-500 w-8">
        {stepNumber}.
      </div>

      {renderPal(from)}

      <div className="text-xl text-gray-400 px-1">+</div>

      {renderPal(partner, '配对')}

      <div className="text-xl text-gray-400 px-2">→</div>

      {renderPal(result, '后代')}
    </div>
  );
}
