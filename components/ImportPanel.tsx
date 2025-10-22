'use client';

import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { sanitizeHTML, extractBodyContent } from '@/lib/html-utils';

interface ImportPanelProps {
  onImport: (html: string) => void;
}

export function ImportPanel({ onImport }: ImportPanelProps) {
  const [pastedHTML, setPastedHTML] = useState('');
  const [showPasteArea, setShowPasteArea] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const sanitized = sanitizeHTML(content);
        const bodyContent = extractBodyContent(sanitized);
        onImport(bodyContent);
      };
      reader.readAsText(file);
    }
  };

  const handlePasteImport = () => {
    if (pastedHTML.trim()) {
      const sanitized = sanitizeHTML(pastedHTML);
      const bodyContent = extractBodyContent(sanitized);
      onImport(bodyContent);
      setPastedHTML('');
      setShowPasteArea(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border-b">
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="w-4 h-4" />
          Upload HTML File
        </Button>
        <input
          id="file-upload"
          type="file"
          accept=".html"
          className="hidden"
          onChange={handleFileUpload}
        />

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setShowPasteArea(!showPasteArea)}
        >
          <FileText className="w-4 h-4" />
          Paste HTML
        </Button>
      </div>

      {showPasteArea && (
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Paste your HTML code here..."
            value={pastedHTML}
            onChange={(e) => setPastedHTML(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
          />
          <Button onClick={handlePasteImport} disabled={!pastedHTML.trim()}>
            Import Pasted HTML
          </Button>
        </div>
      )}
    </div>
  );
}
