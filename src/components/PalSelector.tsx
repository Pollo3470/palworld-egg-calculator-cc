'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { Pal } from '@/types';
import { searchPals, highlightMatch } from '@/lib/search';

interface PalSelectorProps {
  value: Pal | null;
  onChange: (pal: Pal | null) => void;
  placeholder?: string;
  label?: string;
}

export default function PalSelector({
  value,
  onChange,
  placeholder = '搜索帕鲁...',
  label,
}: PalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Pal[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 搜索帕鲁
  useEffect(() => {
    const searchResults = searchPals(query, true, 50);
    setResults(searchResults);
  }, [query]);

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 选择帕鲁
  const handleSelect = (pal: Pal) => {
    onChange(pal);
    setIsOpen(false);
    setQuery('');
  };

  // 清除选择
  const handleClear = () => {
    onChange(null);
    setQuery('');
  };

  // 渲染高亮文字
  const renderHighlightedText = (text: string) => {
    const parts = highlightMatch(text, query);
    return parts.map((part, index) => (
      <span
        key={index}
        className={part.highlight ? 'bg-yellow-200' : ''}
      >
        {part.text}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* 已选择的帕鲁显示 */}
      {value ? (
        <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-white">
          <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
            <Image
              src={value.iconUrl}
              alt={value.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900">{value.name}</div>
            <div className="text-sm text-gray-500">#{value.id}</div>
          </div>
          <button
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="清除选择"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          className="relative"
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* 下拉搜索结果 */}
      {isOpen && !value && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              未找到匹配的帕鲁
            </div>
          ) : (
            <div className="py-1">
              {results.map((pal) => (
                <div
                  key={pal.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSelect(pal)}
                >
                  <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image
                      src={pal.iconUrl}
                      alt={pal.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {renderHighlightedText(pal.name)}
                    </div>
                    <div className="text-sm text-gray-500">
                      #{renderHighlightedText(pal.id)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
