'use client';

import { Type, ImageIcon, Trash2, Download, FileUp, Home, Undo, Redo } from 'lucide-react';
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
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
}

export function Toolbar({ onAddText, onAddImage, onDelete, onExport, onImport, onUndo, onRedo, canUndo, canRedo, hasSelection }: ToolbarProps) {
  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col h-screen shadow-2xl">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2 shadow-lg">
            <NextImage
              src="/image.png"
              alt="SOL Logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">HTML Editor</h2>
            <p className="text-xs text-slate-400">Poster Designer Pro</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200 group"
          >
            <Home className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
            Home
          </Button>
        </Link>

        <Separator className="my-4 bg-slate-700/50" />

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 px-3 mb-3 tracking-wider">HISTORY</p>

          <div className="flex gap-2 px-2">
            <Button
              variant="ghost"
              onClick={onUndo}
              disabled={!canUndo}
              className="flex-1 justify-center text-slate-300 hover:bg-slate-800/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Button>

            <Button
              variant="ghost"
              onClick={onRedo}
              disabled={!canRedo}
              className="flex-1 justify-center text-slate-300 hover:bg-slate-800/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>

        <Separator className="my-4 bg-slate-700/50" />

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 px-3 mb-3 tracking-wider">TOOLS</p>

          <ImportPanel onImport={onImport} />

          <Button
            variant="ghost"
            onClick={onAddText}
            className="w-full justify-start text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 transition-all duration-200 group"
          >
            <Type className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
            Add Text
          </Button>

          <Button
            variant="ghost"
            onClick={onAddImage}
            className="w-full justify-start text-slate-300 hover:bg-cyan-600/20 hover:text-cyan-300 transition-all duration-200 group"
          >
            <ImageIcon className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
            Add Image
          </Button>

          <Button
            variant="ghost"
            onClick={onDelete}
            disabled={!hasSelection}
            className="w-full justify-start text-slate-300 hover:bg-red-600/20 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
          >
            <Trash2 className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
            Delete
          </Button>
        </div>

        <Separator className="my-4 bg-slate-700/50" />

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 px-3 mb-3 tracking-wider">ACTIONS</p>

          <Button
            variant="ghost"
            onClick={onExport}
            className="w-full justify-start text-slate-300 hover:bg-green-600/20 hover:text-green-300 transition-all duration-200 group"
          >
            <Download className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
            Export HTML
          </Button>
        </div>
      </nav>

      <div className="p-6 border-t border-slate-700/50 bg-slate-950/50">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">Version 1.0.0</p>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-500">Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
