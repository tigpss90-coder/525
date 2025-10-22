'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { assignIdsToElements, isTextElement, isImageElement } from '@/lib/html-utils';
import { SelectedElement } from '@/lib/types';

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

    if (stageRef.current) {
      onContentChange(stageRef.current.innerHTML);
    }
  }, [isDragging, selectedElement, dragStart, elementStart, onContentChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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

  return (
    <div className="flex items-center justify-center p-8 bg-gray-100 flex-1 overflow-auto">
      <div
        ref={stageRef}
        className="relative bg-white shadow-lg cursor-pointer"
        style={{
          width: '720px',
          height: '720px',
          overflow: 'hidden',
        }}
        onMouseDown={handleMouseDown}
      >
        {!htmlContent && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Import HTML to start editing
          </div>
        )}
      </div>

      {selectedElement && (
        <style jsx global>{`
          #${selectedElement.id} {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px;
          }
        `}</style>
      )}
    </div>
  );
}
