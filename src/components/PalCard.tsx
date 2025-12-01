'use client';

import Image from 'next/image';
import type { Pal } from '@/types';

interface PalCardProps {
  pal: Pal;
  size?: 'small' | 'medium' | 'large';
  showId?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export default function PalCard({
  pal,
  size = 'medium',
  showId = true,
  onClick,
  selected = false,
}: PalCardProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20',
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  return (
    <div
      className={`
        flex flex-col items-center p-2 rounded-lg transition-all
        ${onClick ? 'cursor-pointer hover:bg-gray-100' : ''}
        ${selected ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-white'}
      `}
      onClick={onClick}
    >
      <div className={`${sizeClasses[size]} relative rounded-lg overflow-hidden bg-gray-50 shadow-sm`}>
        <Image
          src={pal.iconUrl}
          alt={pal.name}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <div className={`mt-1 text-center ${textSizeClasses[size]}`}>
        <div className="font-medium text-gray-900 truncate max-w-20">
          {pal.name}
        </div>
        {showId && (
          <div className="text-gray-500 text-xs">
            #{pal.id}
          </div>
        )}
      </div>
    </div>
  );
}
