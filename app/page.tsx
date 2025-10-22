'use client';

import { useState, useRef } from 'react';
import { ImportPanel } from '@/components/ImportPanel';
import { Toolbar } from '@/components/Toolbar';
import { CanvasStage } from '@/components/CanvasStage';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { SelectedElement } from '@/lib/types';
import { exportToHTML, downloadHTML, generateUniqueId } from '@/lib/html-utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function Home() {
  const [htmlContent, setHtmlContent] = useState('');
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const stageContentRef = useRef('');

  const handleImport = (html: string) => {
    setHtmlContent(html);
    setSelectedElement(null);
    stageContentRef.current = html;
  };

  const handleContentChange = (html: string) => {
    stageContentRef.current = html;
  };

  const handleAddText = () => {
    const newTextId = generateUniqueId();
    const newText = `<p id="${newTextId}" style="position: absolute; left: 50px; top: 50px; font-size: 16px; color: #000000;">New Text</p>`;
    const updatedContent = stageContentRef.current + newText;
    setHtmlContent(updatedContent);
    stageContentRef.current = updatedContent;
  };

  const handleAddImage = () => {
    const newImageId = generateUniqueId();
    const newImage = `<img id="${newImageId}" src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&h=300&fit=crop" alt="Placeholder" style="position: absolute; left: 100px; top: 100px; width: 200px; height: 200px; object-fit: cover;" />`;
    const updatedContent = stageContentRef.current + newImage;
    setHtmlContent(updatedContent);
    stageContentRef.current = updatedContent;
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
    }
  };

  const handleExport = () => {
    const fullHTML = exportToHTML(stageContentRef.current);
    downloadHTML(fullHTML, 'edited-poster.html');
  };

  return (
    <div className="h-screen flex flex-col">
      <ImportPanel onImport={handleImport} />

      <Toolbar
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onDelete={handleDelete}
        onExport={handleExport}
        hasSelection={!!selectedElement}
      />

      <div className="flex flex-1 overflow-hidden">
        <CanvasStage
          htmlContent={htmlContent}
          onSelect={setSelectedElement}
          selectedElement={selectedElement}
          onContentChange={handleContentChange}
        />

        <PropertiesPanel
          selectedElement={selectedElement}
          onContentChange={() => handleContentChange(stageContentRef.current)}
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
