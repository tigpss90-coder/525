'use client';

import { useState, useEffect, useCallback } from 'react';

interface ResizeHandlesProps {
  element: HTMLElement;
  stageRef: HTMLElement;
  onResize: (width: number, height: number) => void;
  onResizeEnd: () => void;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

export function ResizeHandles({ element, stageRef, onResize, onResizeEnd }: ResizeHandlesProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [elementPos, setElementPos] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const elementRect = element.getBoundingClientRect();
      const stageRect = stageRef.getBoundingClientRect();

      setElementPos({
        top: elementRect.top - stageRect.top,
        left: elementRect.left - stageRect.left,
        width: elementRect.width,
        height: elementRect.height,
      });
    };

    updatePosition();
    const interval = setInterval(updatePosition, 100);
    return () => clearInterval(interval);
  }, [element, stageRef]);

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setActiveHandle(handle);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: elementPos.width, height: elementPos.height });
  }, [elementPos]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !activeHandle) return;

    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    let newWidth = startSize.width;
    let newHeight = startSize.height;

    switch (activeHandle) {
      case 'se':
        newWidth = Math.max(20, startSize.width + deltaX);
        newHeight = Math.max(20, startSize.height + deltaY);
        break;
      case 'sw':
        newWidth = Math.max(20, startSize.width - deltaX);
        newHeight = Math.max(20, startSize.height + deltaY);
        break;
      case 'ne':
        newWidth = Math.max(20, startSize.width + deltaX);
        newHeight = Math.max(20, startSize.height - deltaY);
        break;
      case 'nw':
        newWidth = Math.max(20, startSize.width - deltaX);
        newHeight = Math.max(20, startSize.height - deltaY);
        break;
      case 'e':
        newWidth = Math.max(20, startSize.width + deltaX);
        break;
      case 'w':
        newWidth = Math.max(20, startSize.width - deltaX);
        break;
      case 's':
        newHeight = Math.max(20, startSize.height + deltaY);
        break;
      case 'n':
        newHeight = Math.max(20, startSize.height - deltaY);
        break;
    }

    onResize(newWidth, newHeight);
  }, [isResizing, activeHandle, startPos, startSize, onResize]);

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      setActiveHandle(null);
      onResizeEnd();
    }
  }, [isResizing, onResizeEnd]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleStyle = "absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-lg hover:scale-125 transition-transform cursor-pointer z-50";
  const edgeHandleStyle = "absolute bg-blue-500 hover:bg-blue-600 transition-colors";

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: elementPos.top,
        left: elementPos.left,
        width: elementPos.width,
        height: elementPos.height,
      }}
    >
      <div
        className={handleStyle}
        style={{ top: -6, left: -6, cursor: 'nw-resize', pointerEvents: 'auto' }}
        onMouseDown={(e) => handleMouseDown(e, 'nw')}
      />
      <div
        className={handleStyle}
        style={{ top: -6, right: -6, cursor: 'ne-resize', pointerEvents: 'auto' }}
        onMouseDown={(e) => handleMouseDown(e, 'ne')}
      />
      <div
        className={handleStyle}
        style={{ bottom: -6, left: -6, cursor: 'sw-resize', pointerEvents: 'auto' }}
        onMouseDown={(e) => handleMouseDown(e, 'sw')}
      />
      <div
        className={handleStyle}
        style={{ bottom: -6, right: -6, cursor: 'se-resize', pointerEvents: 'auto' }}
        onMouseDown={(e) => handleMouseDown(e, 'se')}
      />

      <div
        className={`${edgeHandleStyle} rounded-full`}
        style={{
          top: '50%',
          left: -4,
          width: 8,
          height: 24,
          transform: 'translateY(-50%)',
          cursor: 'w-resize',
          pointerEvents: 'auto'
        }}
        onMouseDown={(e) => handleMouseDown(e, 'w')}
      />
      <div
        className={`${edgeHandleStyle} rounded-full`}
        style={{
          top: '50%',
          right: -4,
          width: 8,
          height: 24,
          transform: 'translateY(-50%)',
          cursor: 'e-resize',
          pointerEvents: 'auto'
        }}
        onMouseDown={(e) => handleMouseDown(e, 'e')}
      />
      <div
        className={`${edgeHandleStyle} rounded-full`}
        style={{
          top: -4,
          left: '50%',
          width: 24,
          height: 8,
          transform: 'translateX(-50%)',
          cursor: 'n-resize',
          pointerEvents: 'auto'
        }}
        onMouseDown={(e) => handleMouseDown(e, 'n')}
      />
      <div
        className={`${edgeHandleStyle} rounded-full`}
        style={{
          bottom: -4,
          left: '50%',
          width: 24,
          height: 8,
          transform: 'translateX(-50%)',
          cursor: 's-resize',
          pointerEvents: 'auto'
        }}
        onMouseDown={(e) => handleMouseDown(e, 's')}
      />
    </div>
  );
}
