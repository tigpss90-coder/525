'use client';

import { SnapGuide } from '@/lib/snapping';

interface AlignmentGuidesProps {
  guides: SnapGuide[];
  canvasWidth: number;
  canvasHeight: number;
}

export function AlignmentGuides({ guides, canvasWidth, canvasHeight }: AlignmentGuidesProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {guides.map((guide, index) => {
        if (guide.orientation === 'vertical') {
          return (
            <div
              key={`guide-${index}`}
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${guide.position}px`,
                height: `${canvasHeight}px`,
                background: guide.type === 'center'
                  ? 'linear-gradient(to bottom, transparent 0%, #3b82f6 50%, transparent 100%)'
                  : '#3b82f6',
                boxShadow: '0 0 4px rgba(59, 130, 246, 0.5)',
              }}
            />
          );
        } else {
          return (
            <div
              key={`guide-${index}`}
              className="absolute left-0 right-0 h-px"
              style={{
                top: `${guide.position}px`,
                width: `${canvasWidth}px`,
                background: guide.type === 'center'
                  ? 'linear-gradient(to right, transparent 0%, #3b82f6 50%, transparent 100%)'
                  : '#3b82f6',
                boxShadow: '0 0 4px rgba(59, 130, 246, 0.5)',
              }}
            />
          );
        }
      })}
    </div>
  );
}
