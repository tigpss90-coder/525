'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { assignIdsToElements, isTextElement, isImageElement } from '@/lib/html-utils';
import { SelectedElement, SelectionBox } from '@/lib/types';
import { useSnapping } from '@/hooks/use-snapping';

interface CanvasStageProps {
  htmlContent: string;
  onSelect: (element: SelectedElement | null) => void;
  selectedElement: SelectedElement | null;
  onContentChange: (html: string, addHistory?: boolean) => void;
  stageRef: React.MutableRefObject<HTMLDivElement | null>;
  selectedElements: SelectedElement[];
  onMultiSelect: (elements: SelectedElement[]) => void;
}

export function CanvasStage({ htmlContent, onSelect, selectedElement, onContentChange, stageRef, selectedElements, onMultiSelect }: CanvasStageProps) {
  const internalStageRef = stageRef;
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [multiDragStarts, setMultiDragStarts] = useState<Map<string, { x: number; y: number }>>(new Map());
  const { snapPosition, guides, setGuides } = useSnapping(stageRef);

  useEffect(() => {
    if (internalStageRef.current && htmlContent) {
      internalStageRef.current.innerHTML = htmlContent;
      assignIdsToElements(internalStageRef.current);

      internalStageRef.current.querySelectorAll('*').forEach(el => {
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

    if (target === internalStageRef.current) {
      if (!e.shiftKey) {
        onSelect(null);
        onMultiSelect([]);
      }
      setIsSelecting(true);
      const rect = internalStageRef.current.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      setSelectionBox({ startX, startY, endX: startX, endY: startY });
      return;
    }

    let clickedElement = target;
    while (clickedElement && clickedElement.parentElement !== internalStageRef.current) {
      clickedElement = clickedElement.parentElement as HTMLElement;
    }

    if (clickedElement && clickedElement !== internalStageRef.current) {
      e.stopPropagation();

      const selection: SelectedElement = {
        id: clickedElement.id,
        element: clickedElement,
        tagName: clickedElement.tagName,
        isImage: isImageElement(clickedElement),
        isText: isTextElement(clickedElement),
      };

      if (e.shiftKey) {
        const isAlreadySelected = selectedElements.some(el => el.id === selection.id);
        if (isAlreadySelected) {
          onMultiSelect(selectedElements.filter(el => el.id !== selection.id));
        } else {
          onMultiSelect([...selectedElements, selection]);
        }
        return;
      }

      const isPartOfMultiSelection = selectedElements.some(el => el.id === selection.id);
      if (isPartOfMultiSelection && selectedElements.length > 1) {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        const starts = new Map<string, { x: number; y: number }>();
        selectedElements.forEach(sel => {
          const computedStyle = window.getComputedStyle(sel.element);
          const currentLeft = parseInt(computedStyle.left) || 0;
          const currentTop = parseInt(computedStyle.top) || 0;
          starts.set(sel.id, { x: currentLeft, y: currentTop });
          if (computedStyle.position === 'static' || !sel.element.style.position) {
            sel.element.style.position = 'absolute';
            sel.element.style.left = `${currentLeft}px`;
            sel.element.style.top = `${currentTop}px`;
          }
        });
        setMultiDragStarts(starts);
      } else {
        onSelect(selection);
        onMultiSelect([]);

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
    }
  }, [onSelect, onMultiSelect, selectedElements]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isSelecting && selectionBox && internalStageRef.current) {
      const rect = internalStageRef.current.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      setSelectionBox({ ...selectionBox, endX, endY });
      return;
    }

    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      if (selectedElements.length > 0) {
        selectedElements.forEach(sel => {
          const start = multiDragStarts.get(sel.id);
          if (start) {
            const proposedX = start.x + deltaX;
            const proposedY = start.y + deltaY;
            const excludeIds = selectedElements.map(s => s.id);
            const snapped = snapPosition(sel.element, proposedX, proposedY, excludeIds);
            sel.element.style.left = `${snapped.x}px`;
            sel.element.style.top = `${snapped.y}px`;
            if (snapped.guides.length > 0) {
              setGuides(snapped.guides);
            }
          }
        });
      } else if (selectedElement) {
        const proposedX = elementStart.x + deltaX;
        const proposedY = elementStart.y + deltaY;
        const snapped = snapPosition(selectedElement.element, proposedX, proposedY, [selectedElement.id]);
        selectedElement.element.style.left = `${snapped.x}px`;
        selectedElement.element.style.top = `${snapped.y}px`;
        setGuides(snapped.guides);
      }

      if (internalStageRef.current) {
        onContentChange(internalStageRef.current.innerHTML, false);
      }
    }
  }, [isDragging, isSelecting, selectedElement, selectedElements, dragStart, elementStart, onContentChange, selectionBox, multiDragStarts, snapPosition, setGuides]);

  const handleMouseUp = useCallback(() => {
    setGuides([]);

    if (isSelecting && selectionBox && internalStageRef.current) {
      const minX = Math.min(selectionBox.startX, selectionBox.endX);
      const maxX = Math.max(selectionBox.startX, selectionBox.endX);
      const minY = Math.min(selectionBox.startY, selectionBox.endY);
      const maxY = Math.max(selectionBox.startY, selectionBox.endY);

      const elementsInBox: SelectedElement[] = [];
      Array.from(internalStageRef.current.children).forEach(child => {
        const el = child as HTMLElement;
        if (el.id) {
          const rect = el.getBoundingClientRect();
          const stageRect = internalStageRef.current!.getBoundingClientRect();
          const elLeft = rect.left - stageRect.left;
          const elTop = rect.top - stageRect.top;
          const elRight = elLeft + rect.width;
          const elBottom = elTop + rect.height;

          if (elLeft < maxX && elRight > minX && elTop < maxY && elBottom > minY) {
            elementsInBox.push({
              id: el.id,
              element: el,
              tagName: el.tagName,
              isImage: isImageElement(el),
              isText: isTextElement(el),
            });
          }
        }
      });

      if (elementsInBox.length > 0) {
        onMultiSelect(elementsInBox);
        onSelect(null);
      }
    }

    setIsDragging(false);
    setIsSelecting(false);
    setSelectionBox(null);
  }, [isSelecting, selectionBox, onMultiSelect, onSelect]);

  useEffect(() => {
    if (isDragging || isSelecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isSelecting, handleMouseMove, handleMouseUp]);


  return (
    <div className="flex items-center justify-center p-8 bg-gray-100 flex-1 overflow-auto">
      <div
        ref={internalStageRef}
        className="relative bg-white shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          width: '720px',
          height: '720px',
          overflow: 'hidden',
        }}
        onMouseDown={handleMouseDown}
        tabIndex={0}
        role="region"
        aria-label="Canvas stage for editing HTML elements"
      >
        {!htmlContent && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Import HTML to start editing
          </div>
        )}
      </div>

      {selectionBox && isSelecting && (
        <div
          style={{
            position: 'absolute',
            left: `${Math.min(selectionBox.startX, selectionBox.endX)}px`,
            top: `${Math.min(selectionBox.startY, selectionBox.endY)}px`,
            width: `${Math.abs(selectionBox.endX - selectionBox.startX)}px`,
            height: `${Math.abs(selectionBox.endY - selectionBox.startY)}px`,
            border: '2px dashed #3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      )}

      {selectedElement && (
        <>
          <style jsx global>{`
            #${selectedElement.id} {
              outline: 2px solid #3b82f6 !important;
              outline-offset: 2px;
            }
          `}</style>
          <div
            role="status"
            aria-live="polite"
            className="sr-only"
          >
            Selected {selectedElement.tagName} element
          </div>
        </>
      )}

      {selectedElements.length > 0 && (
        <style jsx global>{`
          ${selectedElements.map(el => `
            #${el.id} {
              outline: 2px solid #10b981 !important;
              outline-offset: 2px;
            }
          `).join('')}
        `}</style>
      )}

      {guides.map((guide, index) => (
        <div
          key={`guide-${index}`}
          style={{
            position: 'absolute',
            ...(guide.type === 'vertical'
              ? {
                  left: `${guide.position}px`,
                  top: 0,
                  width: '1px',
                  height: '100%',
                }
              : {
                  left: 0,
                  top: `${guide.position}px`,
                  width: '100%',
                  height: '1px',
                }),
            backgroundColor: '#f59e0b',
            pointerEvents: 'none',
            zIndex: 999,
          }}
        />
      ))}
    </div>
  );
}
