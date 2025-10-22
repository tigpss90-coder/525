'use client';

import { useState, useRef, useEffect } from 'react';
import { ImportPanel } from '@/components/ImportPanel';
import { Toolbar } from '@/components/Toolbar';
import { CanvasStage } from '@/components/CanvasStage';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { SelectedElement } from '@/lib/types';
import { exportToHTML, downloadHTML, generateUniqueId } from '@/lib/html-utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useHistory } from '@/hooks/use-history';
import { useClipboard } from '@/hooks/use-clipboard';
import { toast } from 'sonner';
import { ElementTree } from '@/components/ElementTree';

export default function AppPage() {
  const [htmlContent, setHtmlContent] = useState('');
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const stageContentRef = useRef<HTMLDivElement | null>(null);
  const { addToHistory, undo, redo, canUndo, canRedo } = useHistory('');
  const { copy, paste, hasClipboard } = useClipboard();

  const handleImport = (html: string) => {
    setHtmlContent(html);
    setSelectedElement(null);
    addToHistory(html);
  };

  const handleContentChange = (html: string, addHistory?: boolean) => {
    if (addHistory !== false) {
      addToHistory(html);
    }
  };

  const handleAddText = () => {
    if (!stageContentRef.current) return;
    const newTextId = generateUniqueId();
    const newText = `<p id="${newTextId}" style="position: absolute; left: 50px; top: 50px; font-size: 16px; color: #000000;">New Text</p>`;
    const updatedContent = stageContentRef.current.innerHTML + newText;
    setHtmlContent(updatedContent);
    addToHistory(updatedContent);
  };

  const handleAddImage = () => {
    if (!stageContentRef.current) return;
    const newImageId = generateUniqueId();
    const newImage = `<img id="${newImageId}" src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&h=300&fit=crop" alt="Placeholder" style="position: absolute; left: 100px; top: 100px; width: 200px; height: 200px; object-fit: cover;" />`;
    const updatedContent = stageContentRef.current.innerHTML + newImage;
    setHtmlContent(updatedContent);
    addToHistory(updatedContent);
  };

  const handleDelete = () => {
    if (selectedElement || selectedElements.length > 0) {
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = () => {
    if (stageContentRef.current) {
      if (selectedElements.length > 0) {
        selectedElements.forEach(el => el.element.remove());
        setSelectedElements([]);
      } else if (selectedElement) {
        selectedElement.element.remove();
        setSelectedElement(null);
      }
      setShowDeleteDialog(false);
      addToHistory(stageContentRef.current.innerHTML);
    }
  };

  const handleUndo = () => {
    const prevContent = undo();
    if (prevContent !== null) {
      setHtmlContent(prevContent);
      setSelectedElement(null);
      toast.success('Undo successful');
    }
  };

  const handleRedo = () => {
    const nextContent = redo();
    if (nextContent !== null) {
      setHtmlContent(nextContent);
      setSelectedElement(null);
      toast.success('Redo successful');
    }
  };

  const handleCopy = () => {
    if (selectedElement) {
      copy(selectedElement);
      toast.success('Element copied');
    } else if (selectedElements.length > 0) {
      toast.info('Multi-element copy not yet supported');
    }
  };

  const handlePaste = () => {
    if (stageContentRef.current) {
      const newElement = paste(stageContentRef.current);
      if (newElement) {
        setSelectedElement(newElement);
        addToHistory(stageContentRef.current.innerHTML);
        toast.success('Element pasted');
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if (ctrlKey && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      } else if (ctrlKey && e.key === 'v') {
        e.preventDefault();
        handlePaste();
      } else if (e.key === 'Delete' && (selectedElement || selectedElements.length > 0)) {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedElement(null);
        setSelectedElements([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, selectedElements, canUndo, canRedo, hasClipboard]);

  const handleExport = () => {
    if (!stageContentRef.current) return;
    const fullHTML = exportToHTML(stageContentRef.current.innerHTML);
    downloadHTML(fullHTML, 'edited-poster.html');
  };

  return (
    <div className="h-screen flex">
      <Toolbar
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onDelete={handleDelete}
        onExport={handleExport}
        onImport={handleImport}
        hasSelection={!!selectedElement}
      />

      <div className="flex flex-1 overflow-hidden">
        <CanvasStage
          htmlContent={htmlContent}
          onSelect={setSelectedElement}
          selectedElement={selectedElement}
          onContentChange={handleContentChange}
          stageRef={stageContentRef}
          selectedElements={selectedElements}
          onMultiSelect={setSelectedElements}
        />

        <PropertiesPanel
          selectedElement={selectedElement}
          onContentChange={() => {
            if (stageContentRef.current) {
              handleContentChange(stageContentRef.current.innerHTML);
            }
          }}
        />

        <ElementTree
          stageRef={stageContentRef}
          selectedElement={selectedElement}
          selectedElements={selectedElements}
          onSelect={setSelectedElement}
          onMultiSelect={setSelectedElements}
        />
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Element</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this element? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
