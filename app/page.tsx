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
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 transition-opacity duration-300 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center space-y-8 px-4">
        <div className="relative w-64 h-64 mx-auto">
          <Image
            src="/image.png"
            alt="SOL Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">
            HTML Poster Editor
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Create and edit beautiful HTML posters with our visual editor
          </p>
        </div>

        <Button
          onClick={handleEnterApp}
          size="lg"
          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          Launch App
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
