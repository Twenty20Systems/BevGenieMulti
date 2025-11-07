'use client';

import React from 'react';
import { DynamicPageRenderer } from '@/components/dynamic-page-renderer';
import type { BevGeniePage } from '@/lib/ai/page-specs';

interface DynamicContentProps {
  specification: BevGeniePage;
  onNavigationClick?: (action: string, context?: any) => void;
  onBackToHome?: () => void;
}

/**
 * Dynamic Content Component
 *
 * Renders AI-generated page specifications with:
 * - White background (no gradients)
 * - Professional B2B SaaS layout
 * - Interactive CTA handlers
 * - Pages stack vertically below home
 * - Responsive design
 */
export function DynamicContent({
  specification,
  onNavigationClick,
  onBackToHome
}: DynamicContentProps) {
  return (
    <div className="h-full w-full overflow-hidden">
      {/* Page Content - fills parent h-screen container */}
      <DynamicPageRenderer
        page={specification}
        onNavigationClick={onNavigationClick}
        onBackToHome={onBackToHome}
      />
    </div>
  );
}
