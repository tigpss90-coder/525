'use client';

import { useState } from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ImportPanelProps {
  onImport: (html: string) => void;
}

export function ImportPanel({ onImport }: ImportPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [htmlInput, setHtmlInput] = useState('');

  const handleImport = () => {
    if (htmlInput.trim()) {
      onImport(htmlInput);
      setIsOpen(false);
      setHtmlInput('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setHtmlInput(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-amber-600/20 hover:text-amber-300 transition-all duration-200 group"
        >
          <FileUp className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
          Import HTML
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Import HTML</DialogTitle>
          <DialogDescription className="text-base">
            Paste your HTML code or upload an HTML file to start editing your poster.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
            <label className="block text-sm font-semibold mb-3 text-slate-700">
              <FileUp className="w-4 h-4 inline mr-2" />
              Upload HTML File
            </label>
            <input
              type="file"
              accept=".html"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer file:transition-colors"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-slate-500 font-medium">OR</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-700">
              Paste HTML Code
            </label>
            <Textarea
              placeholder="<div>Paste your HTML here...</div>"
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              className="min-h-[320px] font-mono text-sm bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="px-6">
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!htmlInput.trim()}
            className="px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import & Start Editing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
