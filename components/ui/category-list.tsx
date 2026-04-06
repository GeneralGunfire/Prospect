"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Category {
  id: string | number;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  featured?: boolean;
}

export interface CategoryListProps {
  title: string;
  subtitle?: string;
  categories: Category[];
  headerIcon?: React.ReactNode;
  className?: string;
}

export const CategoryList = ({ title, subtitle, categories, headerIcon, className }: CategoryListProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null);

  return (
    <div className={cn("w-full bg-white text-slate-800 p-8", className)}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          {headerIcon && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#176293]/80 to-[#1A3E6F] mb-6 text-white">
              {headerIcon}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-slate-800">{title}</h1>
          {subtitle && (
            <h2 className="text-4xl md:text-5xl font-bold text-slate-400">{subtitle}</h2>
          )}
        </div>

        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group"
              onMouseEnter={() => setHoveredItem(category.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={category.onClick}
            >
              <div
                className={cn(
                  "relative overflow-hidden border bg-white transition-all duration-300 ease-in-out cursor-pointer rounded-lg",
                  hoveredItem === category.id
                    ? 'h-32 border-[#176293] shadow-lg shadow-[#176293]/20 bg-[#176293]/5'
                    : 'h-24 border-slate-200 hover:border-[#176293]/50'
                )}
              >
                {hoveredItem === category.id && (
                  <>
                    <div className="absolute top-3 left-3 w-6 h-6">
                      <div className="absolute top-0 left-0 w-4 h-0.5 bg-[#176293]" />
                      <div className="absolute top-0 left-0 w-0.5 h-4 bg-[#176293]" />
                    </div>
                    <div className="absolute bottom-3 right-3 w-6 h-6">
                      <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-[#176293]" />
                      <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-[#176293]" />
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between h-full px-6 md:px-8">
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-bold transition-colors duration-300",
                      category.featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl',
                      hoveredItem === category.id ? 'text-[#176293]' : 'text-slate-800'
                    )}>
                      {category.title}
                    </h3>
                    {category.subtitle && (
                      <p className={cn(
                        "mt-1 transition-colors duration-300 text-sm md:text-base",
                        hoveredItem === category.id ? 'text-slate-700' : 'text-slate-500'
                      )}>
                        {category.subtitle}
                      </p>
                    )}
                  </div>
                  {category.icon && hoveredItem === category.id && (
                    <div className="text-[#176293] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.icon}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
