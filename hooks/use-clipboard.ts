import { useState, useCallback } from 'react';
import { SelectedElement } from '@/lib/types';

export function useClipboard() {
  const [clipboard, setClipboard] = useState<string | null>(null);

  const copy = useCallback((element: SelectedElement) => {
    const clonedHTML = element.element.outerHTML;
    setClipboard(clonedHTML);
  }, []);

  const paste = useCallback((stageRef: HTMLDivElement | null) => {
    if (!clipboard || !stageRef) return null;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = clipboard;
    const clonedElement = tempDiv.firstElementChild as HTMLElement;

    if (clonedElement) {
      const oldId = clonedElement.id;
      const newId = `element-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      clonedElement.id = newId;

      const currentLeft = parseInt(clonedElement.style.left) || 0;
      const currentTop = parseInt(clonedElement.style.top) || 0;
      clonedElement.style.left = `${currentLeft + 20}px`;
      clonedElement.style.top = `${currentTop + 20}px`;

      stageRef.appendChild(clonedElement);

      return {
        id: newId,
        element: clonedElement,
        tagName: clonedElement.tagName,
        isImage: clonedElement.tagName === 'IMG',
        isText: ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'DIV'].includes(clonedElement.tagName),
      };
    }

    return null;
  }, [clipboard]);

  return { copy, paste, hasClipboard: !!clipboard };
}
