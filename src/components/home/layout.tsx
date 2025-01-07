'use client';

import React from 'react';
import { PropsWithChildren } from 'react';
import { deviceSize } from '../../utils/constants';
import { useMaxWidth } from '../../utils/useMaxWidth';

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
    <div className="bg-[#F8F9FA] w-full">
      <div 
        style={{ 
          maxWidth: maxWidth ? `${maxWidth}px` : '100%',
          margin: '0 auto', 
        }}
        className={className} 
      >
        {children}
      </div>
    </div>
  );
}
