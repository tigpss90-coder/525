export interface SnapGuide {
  position: number;
  orientation: 'horizontal' | 'vertical';
  type: 'edge' | 'center';
}

export interface SnapResult {
  x: number;
  y: number;
  guides: SnapGuide[];
}

export interface ElementBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

const SNAP_THRESHOLD = 5;

export function getElementBounds(element: HTMLElement, stageRect: DOMRect): ElementBounds {
  const rect = element.getBoundingClientRect();
  const left = rect.left - stageRect.left;
  const top = rect.top - stageRect.top;
  const width = rect.width;
  const height = rect.height;

  return {
    left,
    right: left + width,
    top,
    bottom: top + height,
    centerX: left + width / 2,
    centerY: top + height / 2,
    width,
    height,
  };
}

export function calculateSnapping(
  targetBounds: ElementBounds,
  otherElements: ElementBounds[],
  canvasBounds: { width: number; height: number }
): SnapResult {
  const guides: SnapGuide[] = [];
  let snappedX = targetBounds.left;
  let snappedY = targetBounds.top;
  let hasSnappedX = false;
  let hasSnappedY = false;

  const canvasCenter = {
    x: canvasBounds.width / 2,
    y: canvasBounds.height / 2,
  };

  if (!hasSnappedX && Math.abs(targetBounds.centerX - canvasCenter.x) < SNAP_THRESHOLD) {
    snappedX = canvasCenter.x - targetBounds.width / 2;
    guides.push({
      position: canvasCenter.x,
      orientation: 'vertical',
      type: 'center',
    });
    hasSnappedX = true;
  }

  if (!hasSnappedY && Math.abs(targetBounds.centerY - canvasCenter.y) < SNAP_THRESHOLD) {
    snappedY = canvasCenter.y - targetBounds.height / 2;
    guides.push({
      position: canvasCenter.y,
      orientation: 'horizontal',
      type: 'center',
    });
    hasSnappedY = true;
  }

  if (!hasSnappedX && Math.abs(targetBounds.left) < SNAP_THRESHOLD) {
    snappedX = 0;
    guides.push({
      position: 0,
      orientation: 'vertical',
      type: 'edge',
    });
    hasSnappedX = true;
  }

  if (!hasSnappedX && Math.abs(targetBounds.right - canvasBounds.width) < SNAP_THRESHOLD) {
    snappedX = canvasBounds.width - targetBounds.width;
    guides.push({
      position: canvasBounds.width,
      orientation: 'vertical',
      type: 'edge',
    });
    hasSnappedX = true;
  }

  if (!hasSnappedY && Math.abs(targetBounds.top) < SNAP_THRESHOLD) {
    snappedY = 0;
    guides.push({
      position: 0,
      orientation: 'horizontal',
      type: 'edge',
    });
    hasSnappedY = true;
  }

  if (!hasSnappedY && Math.abs(targetBounds.bottom - canvasBounds.height) < SNAP_THRESHOLD) {
    snappedY = canvasBounds.height - targetBounds.height;
    guides.push({
      position: canvasBounds.height,
      orientation: 'horizontal',
      type: 'edge',
    });
    hasSnappedY = true;
  }

  for (const other of otherElements) {
    if (!hasSnappedX) {
      if (Math.abs(targetBounds.left - other.left) < SNAP_THRESHOLD) {
        snappedX = other.left;
        guides.push({
          position: other.left,
          orientation: 'vertical',
          type: 'edge',
        });
        hasSnappedX = true;
      } else if (Math.abs(targetBounds.left - other.right) < SNAP_THRESHOLD) {
        snappedX = other.right;
        guides.push({
          position: other.right,
          orientation: 'vertical',
          type: 'edge',
        });
        hasSnappedX = true;
      } else if (Math.abs(targetBounds.right - other.left) < SNAP_THRESHOLD) {
        snappedX = other.left - targetBounds.width;
        guides.push({
          position: other.left,
          orientation: 'vertical',
          type: 'edge',
        });
        hasSnappedX = true;
      } else if (Math.abs(targetBounds.right - other.right) < SNAP_THRESHOLD) {
        snappedX = other.right - targetBounds.width;
        guides.push({
          position: other.right,
          orientation: 'vertical',
          type: 'edge',
        });
        hasSnappedX = true;
      } else if (Math.abs(targetBounds.centerX - other.centerX) < SNAP_THRESHOLD) {
        snappedX = other.centerX - targetBounds.width / 2;
        guides.push({
          position: other.centerX,
          orientation: 'vertical',
          type: 'center',
        });
        hasSnappedX = true;
      }
    }

    if (!hasSnappedY) {
      if (Math.abs(targetBounds.top - other.top) < SNAP_THRESHOLD) {
        snappedY = other.top;
        guides.push({
          position: other.top,
          orientation: 'horizontal',
          type: 'edge',
        });
        hasSnappedY = true;
      } else if (Math.abs(targetBounds.top - other.bottom) < SNAP_THRESHOLD) {
        snappedY = other.bottom;
        guides.push({
          position: other.bottom,
          orientation: 'horizontal',
          type: 'edge',
        });
        hasSnappedY = true;
      } else if (Math.abs(targetBounds.bottom - other.top) < SNAP_THRESHOLD) {
        snappedY = other.top - targetBounds.height;
        guides.push({
          position: other.top,
          orientation: 'horizontal',
          type: 'edge',
        });
        hasSnappedY = true;
      } else if (Math.abs(targetBounds.bottom - other.bottom) < SNAP_THRESHOLD) {
        snappedY = other.bottom - targetBounds.height;
        guides.push({
          position: other.bottom,
          orientation: 'horizontal',
          type: 'edge',
        });
        hasSnappedY = true;
      } else if (Math.abs(targetBounds.centerY - other.centerY) < SNAP_THRESHOLD) {
        snappedY = other.centerY - targetBounds.height / 2;
        guides.push({
          position: other.centerY,
          orientation: 'horizontal',
          type: 'center',
        });
        hasSnappedY = true;
      }
    }

    if (hasSnappedX && hasSnappedY) break;
  }

  return { x: snappedX, y: snappedY, guides };
}
