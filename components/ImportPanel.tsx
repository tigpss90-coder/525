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
          className="w-full justify-start text-white hover:bg-slate-800 hover:text-white"
        >
          <FileUp className="w-4 h-4 mr-3" />
          Import HTML
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import HTML</DialogTitle>
          <DialogDescription>
            Paste your HTML code or upload an HTML file to start editing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload HTML File
            </label>
            <input
              type="file"
              accept=".html"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Or Paste HTML Code
            </label>
            <Textarea
              placeholder="Paste your HTML here..."
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!htmlInput.trim()}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
