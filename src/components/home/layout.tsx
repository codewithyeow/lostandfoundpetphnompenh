///src/components/home/layout.tsx
'use client';
import React from 'react';
import { PropsWithChildren } from 'react';

export default function HomeLayout({ children }: PropsWithChildren) {
    return (
        <div className="p-8 ">
         {children}
      </div>
      
    );
}
