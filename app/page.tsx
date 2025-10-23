'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [isEntering, setIsEntering] = useState(false);

  const handleEnterApp = () => {
    setIsEntering(true);
    setTimeout(() => {
      window.location.href = '/app';
    }, 300);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-opacity duration-300 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

      <div className="relative text-center space-y-12 px-4 max-w-4xl mx-auto">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl p-6 flex items-center justify-center">
              <Image
                src="/image.png"
                alt="SOL Logo"
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent leading-tight">
              HTML Poster Editor
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              A professional visual editor for creating stunning HTML posters with drag-and-drop simplicity and pixel-perfect control
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center text-sm text-slate-400 pt-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Drag & Drop</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Resize Images</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Export HTML</span>
            </div>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <Button
            onClick={handleEnterApp}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-7 text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 group transform hover:scale-105"
          >
            Launch Editor
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>

        <div className="pt-8 text-xs text-slate-500">
          Built with Next.js, TypeScript & Tailwind CSS
        </div>
      </div>
    </div>
  );
}
