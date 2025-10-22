import { useState, useCallback } from 'react';

interface SnapGuide {
  type: 'vertical' | 'horizontal';
  position: number;
}

interface SnappingResult {
  x: number;
  y: number;
  guides: SnapGuide[];
}

const SNAP_THRESHOLD = 5;

export function useSnapping(stageRef: React.MutableRefObject<HTMLDivElement | null>) {
  const [guides, setGuides] = useState<SnapGuide[]>([]);

  const getElementBounds = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const stageRect = stageRef.current?.getBoundingClientRect();
    if (!stageRect) return null;

    return {
      left: rect.left - stageRect.left,
      right: rect.right - stageRect.left,
      top: rect.top - stageRect.top,
      bottom: rect.bottom - stageRect.top,
      centerX: (rect.left + rect.right) / 2 - stageRect.left,
      centerY: (rect.top + rect.bottom) / 2 - stageRect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const snapPosition = useCallback((
    element: HTMLElement,
    proposedX: number,
    proposedY: number,
    excludeIds: string[] = []
  ): SnappingResult => {
    if (!stageRef.current) {
      return { x: proposedX, y: proposedY, guides: [] };
    }

    const snapGuides: SnapGuide[] = [];
    let snappedX = proposedX;
    let snappedY = proposedY;

    const movingBounds = {
      left: proposedX,
      right: proposedX + element.offsetWidth,
      top: proposedY,
      bottom: proposedY + element.offsetHeight,
      centerX: proposedX + element.offsetWidth / 2,
      centerY: proposedY + element.offsetHeight / 2,
    };

    const stageWidth = stageRef.current.offsetWidth;
    const stageHeight = stageRef.current.offsetHeight;
    const stageCenterX = stageWidth / 2;
    const stageCenterY = stageHeight / 2;

    let minXDiff = SNAP_THRESHOLD + 1;
    let minYDiff = SNAP_THRESHOLD + 1;

    Array.from(stageRef.current.children).forEach(child => {
      if (!(child instanceof HTMLElement) || !child.id || excludeIds.includes(child.id)) {
        return;
      }

      const bounds = getElementBounds(child);
      if (!bounds) return;

      const snapPoints = [
        { x: bounds.left, type: 'left' as const },
        { x: bounds.right, type: 'right' as const },
        { x: bounds.centerX, type: 'center' as const },
      ];

      const verticalSnapPoints = [
        { y: bounds.top, type: 'top' as const },
        { y: bounds.bottom, type: 'bottom' as const },
        { y: bounds.centerY, type: 'center' as const },
      ];

      snapPoints.forEach(({ x }) => {
        const diffs = [
          { diff: Math.abs(movingBounds.left - x), snap: x },
          { diff: Math.abs(movingBounds.right - x), snap: x - element.offsetWidth },
          { diff: Math.abs(movingBounds.centerX - x), snap: x - element.offsetWidth / 2 },
        ];

        diffs.forEach(({ diff, snap }) => {
          if (diff < minXDiff && diff <= SNAP_THRESHOLD) {
            minXDiff = diff;
            snappedX = snap;
            snapGuides.push({ type: 'vertical', position: x });
          }
        });
      });

      verticalSnapPoints.forEach(({ y }) => {
        const diffs = [
          { diff: Math.abs(movingBounds.top - y), snap: y },
          { diff: Math.abs(movingBounds.bottom - y), snap: y - element.offsetHeight },
          { diff: Math.abs(movingBounds.centerY - y), snap: y - element.offsetHeight / 2 },
        ];

        diffs.forEach(({ diff, snap }) => {
          if (diff < minYDiff && diff <= SNAP_THRESHOLD) {
            minYDiff = diff;
            snappedY = snap;
            snapGuides.push({ type: 'horizontal', position: y });
          }
        });
      });
    });

    if (Math.abs(movingBounds.centerX - stageCenterX) <= SNAP_THRESHOLD) {
      snappedX = stageCenterX - element.offsetWidth / 2;
      snapGuides.push({ type: 'vertical', position: stageCenterX });
    }

    if (Math.abs(movingBounds.centerY - stageCenterY) <= SNAP_THRESHOLD) {
      snappedY = stageCenterY - element.offsetHeight / 2;
      snapGuides.push({ type: 'horizontal', position: stageCenterY });
    }

    const uniqueGuides = snapGuides.filter((guide, index, self) =>
      index === self.findIndex(g => g.type === guide.type && g.position === guide.position)
    );

    return { x: snappedX, y: snappedY, guides: uniqueGuides };
  }, [stageRef]);

  return { snapPosition, guides, setGuides };
}
