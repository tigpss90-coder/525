'use client';

import { Type, Image, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ToolbarProps {
  onAddText: () => void;
  onAddImage: () => void;
  onDelete: () => void;
  onExport: () => void;
  hasSelection: boolean;
}

export function Toolbar({ onAddText, onAddImage, onDelete, onExport, hasSelection }: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-white border-b">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddText}
          className="flex items-center gap-2"
        >
          <Type className="w-4 h-4" />
          Add Text
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddImage}
          className="flex items-center gap-2"
        >
          <Image className="w-4 h-4" />
          Add Image
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        disabled={!hasSelection}
        className="flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </Button>

      <div className="ml-auto">
        <Button
          variant="default"
          size="sm"
          onClick={onExport}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export HTML
        </Button>
      </div>
    </div>
  );
}
