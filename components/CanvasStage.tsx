'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { assignIdsToElements, isTextElement, isImageElement } from '@/lib/html-utils';
import { SelectedElement } from '@/lib/types';
import { ResizeHandles } from './ResizeHandles';

interface CanvasStageProps {
  htmlContent: string;
  onSelect: (element: SelectedElement | null) => void;
  selectedElement: SelectedElement | null;
  onContentChange: (html: string) => void;
}

export function CanvasStage({ htmlContent, onSelect, selectedElement, onContentChange }: CanvasStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (stageRef.current && htmlContent) {
      stageRef.current.innerHTML = htmlContent;
      assignIdsToElements(stageRef.current);

      stageRef.current.querySelectorAll('*').forEach(el => {
        const htmlEl = el as HTMLElement;
        if (!htmlEl.style.position || htmlEl.style.position === 'static') {
          const computedStyle = window.getComputedStyle(htmlEl);
          if (computedStyle.position === 'absolute' || computedStyle.position === 'relative') {
            return;
          }
        }
      });
    }
  }, [htmlContent]);

  useEffect(() => {
    if (selectedElement) {
      setElementRect(selectedElement.element.getBoundingClientRect());
    } else {
      setElementRect(null);
    }
  }, [selectedElement]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target === stageRef.current) {
      onSelect(null);
      return;
    }

    let clickedElement = target;
    while (clickedElement && clickedElement.parentElement !== stageRef.current) {
      clickedElement = clickedElement.parentElement as HTMLElement;
    }

    if (clickedElement && clickedElement !== stageRef.current) {
      e.stopPropagation();

      const selection: SelectedElement = {
        id: clickedElement.id,
        element: clickedElement,
        tagName: clickedElement.tagName,
        isImage: isImageElement(clickedElement),
        isText: isTextElement(clickedElement),
      };
      onSelect(selection);

      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });

      const computedStyle = window.getComputedStyle(clickedElement);
      const currentLeft = parseInt(computedStyle.left) || 0;
      const currentTop = parseInt(computedStyle.top) || 0;

      setElementStart({ x: currentLeft, y: currentTop });

      if (computedStyle.position === 'static' || !clickedElement.style.position) {
        clickedElement.style.position = 'absolute';
        clickedElement.style.left = `${currentLeft}px`;
        clickedElement.style.top = `${currentTop}px`;
      }
    }
  }, [onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedElement) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const newLeft = elementStart.x + deltaX;
    const newTop = elementStart.y + deltaY;

    selectedElement.element.style.left = `${newLeft}px`;
    selectedElement.element.style.top = `${newTop}px`;
  }, [isDragging, selectedElement, dragStart, elementStart]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && stageRef.current) {
      onContentChange(stageRef.current.innerHTML);
    }
    setIsDragging(false);
  }, [isDragging, onContentChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedElement) {
        selectedElement.element.remove();
        onSelect(null);
        if (stageRef.current) {
          onContentChange(stageRef.current.innerHTML);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, onSelect, onContentChange]);

  const handleResize = useCallback((width: number, height: number) => {
    if (!selectedElement || !selectedElement.isImage) return;

    const img = selectedElement.element as HTMLImageElement;
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    img.width = width;
    img.height = height;

    setElementRect(img.getBoundingClientRect());
  }, [selectedElement]);

  const handleResizeEnd = useCallback(() => {
    if (stageRef.current) {
      onContentChange(stageRef.current.innerHTML);
    }
  }, [onContentChange]);

  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 flex-1 overflow-auto">
      <div className="relative">
        <div
          ref={stageRef}
          className="relative bg-white shadow-2xl cursor-pointer rounded-lg overflow-hidden border border-slate-200"
          style={{
            width: '720px',
            height: '720px',
          }}
          onMouseDown={handleMouseDown}
        >
          {!htmlContent && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">Import HTML to start editing</p>
              <p className="text-sm mt-1">Use the sidebar to get started</p>
            </div>
          )}
        </div>

        {selectedElement && elementRect && selectedElement.isImage && stageRef.current && (
          <ResizeHandles
            element={selectedElement.element}
            stageRef={stageRef.current}
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
          />
        )}
      </div>

      {selectedElement && (
        <style jsx global>{`
          #${selectedElement.id} {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
          }
        `}</style>
      )}
    </div>
  );
}
