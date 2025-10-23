'use client';

import { useState, useRef, useEffect } from 'react';
import { ImportPanel } from '@/components/ImportPanel';
import { Toolbar } from '@/components/Toolbar';
import { CanvasStage } from '@/components/CanvasStage';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { ElementTreePanel } from '@/components/ElementTreePanel';
import { SelectedElement } from '@/lib/types';
import { exportToHTML, downloadHTML, generateUniqueId } from '@/lib/html-utils';
import { useHistory } from '@/hooks/use-history';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function AppPage() {
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const stageContentRef = useRef('');
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { state: htmlContent, set: setHtmlContent, undo, redo, canUndo, canRedo, reset } = useHistory('');

  useEffect(() => {
    stageContentRef.current = htmlContent;
  }, [htmlContent]);

  const handleImport = (html: string) => {
    reset(html);
    setSelectedElement(null);
  };

  const handleContentChange = (html: string) => {
    setHtmlContent(html);
  };

  const handleAddText = () => {
    const newTextId = generateUniqueId();
    const newText = `<p id="${newTextId}" style="position: absolute; left: 50px; top: 50px; font-size: 16px; color: #000000;">New Text</p>`;
    const updatedContent = stageContentRef.current + newText;
    setHtmlContent(updatedContent);
  };

  const handleAddImage = (imageUrl: string, width?: number, height?: number) => {
    const newImageId = generateUniqueId();
    const widthStyle = width ? `${width}px` : '200px';
    const heightStyle = height ? `${height}px` : '200px';
    const newImage = `<img id="${newImageId}" src="${imageUrl}" alt="Image" style="position: absolute; left: 100px; top: 100px; width: ${widthStyle}; height: ${heightStyle}; object-fit: cover;" />`;
    const updatedContent = stageContentRef.current + newImage;
    setHtmlContent(updatedContent);
  };

  const handleDelete = () => {
    if (selectedElement) {
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = () => {
    if (selectedElement) {
      selectedElement.element.remove();
      setSelectedElement(null);
      setShowDeleteDialog(false);
      handleContentChange(stageContentRef.current);
    }
  };

  const handleExport = () => {
    const fullHTML = exportToHTML(stageContentRef.current);
    downloadHTML(fullHTML, 'edited-poster.html');
  };

  return (
    <div className="h-screen flex bg-slate-50">
      <Toolbar
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onDelete={handleDelete}
        onExport={handleExport}
        onImport={handleImport}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        hasSelection={!!selectedElement}
      />

      <div className="flex flex-1 overflow-hidden">
        <ElementTreePanel
          htmlContent={htmlContent}
          selectedElement={selectedElement}
          onSelect={setSelectedElement}
          stageRef={stageRef.current}
        />

        <CanvasStage
          htmlContent={htmlContent}
          onSelect={setSelectedElement}
          selectedElement={selectedElement}
          onContentChange={handleContentChange}
          stageRef={stageRef}
        />

        <PropertiesPanel
          selectedElement={selectedElement}
          onContentChange={handleContentChange}
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
