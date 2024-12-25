///src/components/home/layout.tsx
'use client';

import React from 'react';
import { PropsWithChildren } from 'react';
import { deviceSize } from '@/utils/constants';
import { useMaxWidth } from '@/utils/useMaxWidth';

interface HomeLayoutProps extends PropsWithChildren {
  maxWidthSize?: keyof typeof deviceSize;
  className?: string;
}

export default function HomeLayout({ 
  children, 
  maxWidthSize = 'xl',
  className = ''
}: HomeLayoutProps) {
  const maxWidth = useMaxWidth(maxWidthSize);
  
  return (
    <div className="bg-white w-full">
      <div 
        style={{ maxWidth: maxWidth ? `${maxWidth}px` : undefined }}
        className={`mx-auto ${className}`}
      >
        {children}
      </div>
    </div>
  );
}