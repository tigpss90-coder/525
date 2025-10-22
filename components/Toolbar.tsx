'use client';

import { Type, ImageIcon, Trash2, Download, FileUp, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import NextImage from 'next/image';
import { ImportPanel } from './ImportPanel';

interface ToolbarProps {
  onAddText: () => void;
  onAddImage: () => void;
  onDelete: () => void;
  onExport: () => void;
  onImport: (html: string) => void;
  hasSelection: boolean;
}

export function Toolbar({ onAddText, onAddImage, onDelete, onExport, onImport, hasSelection }: ToolbarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <NextImage
              src="/image.png"
              alt="SOL Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold">HTML Editor</h2>
            <p className="text-xs text-slate-400">Poster Designer</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
          >
            <Home className="w-4 h-4 mr-3" />
            Home
          </Button>
        </Link>

        <Separator className="my-4 bg-slate-700" />

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 px-3 mb-2">TOOLS</p>

          <ImportPanel onImport={onImport} />

          <Button
            variant="ghost"
            onClick={onAddText}
            className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
          >
            <Type className="w-4 h-4 mr-3" />
            Add Text
          </Button>

          <Button
            variant="ghost"
            onClick={onAddImage}
            className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
          >
            <ImageIcon className="w-4 h-4 mr-3" />
            Add Image
          </Button>

          <Button
            variant="ghost"
            onClick={onDelete}
            disabled={!hasSelection}
            className="w-full justify-start text-white hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Delete
          </Button>
        </div>

        <Separator className="my-4 bg-slate-700" />

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 px-3 mb-2">ACTIONS</p>

          <Button
            variant="ghost"
            onClick={onExport}
            className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
          >
            <Download className="w-4 h-4 mr-3" />
            Export HTML
          </Button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 text-center">v1.0.0</p>
      </div>
    </aside>
  );
}
