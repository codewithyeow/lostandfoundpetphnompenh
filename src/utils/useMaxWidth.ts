// utils/useMaxWidth.ts
'use client';
import { useState, useEffect } from 'react';
import { deviceSize } from './constants';

export function useMaxWidth(size: keyof typeof deviceSize) {
  const [maxWidth, setMaxWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= deviceSize.xxs) {
        setMaxWidth(deviceSize.xxs);
      } else if (width <= deviceSize.xs) {
        setMaxWidth(deviceSize.xs);
      } else if (width <= deviceSize.sm) {
        setMaxWidth(deviceSize.sm);
      } else if (width <= deviceSize.md) {
        setMaxWidth(deviceSize.md);
      } else if (width <= deviceSize.lg) {
        setMaxWidth(deviceSize.lg);
      } else if (width <= deviceSize.xl) {
        setMaxWidth(deviceSize.xl);
      } else {
        setMaxWidth(deviceSize.xxl);
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return maxWidth;
}