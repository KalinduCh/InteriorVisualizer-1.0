'use client';

import { useState, useCallback } from 'react';
import { LayoutPanelLeft } from 'lucide-react';
import Link from 'next/link';
import WallDesignerForm from '@/components/wall-designer-form';
import WallDesignerResults from '@/components/wall-designer-results';
import { WallDesignerCalculationResults } from '@/types';

export default function WallDesignerPage() {
  const [results, setResults] = useState<WallDesignerCalculationResults | null>(null);

  const handleCalculate = useCallback((newResults: WallDesignerCalculationResults | null) => {
    setResults(newResults);
  }, []);
  
  const handleReset = useCallback(() => {
    setResults(null);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto flex items-center justify-between p-4">
           <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <LayoutPanelLeft className="w-6 h-6 mr-2 text-primary" />
            <h1 className="text-xl font-bold font-headline text-foreground">
              Wall Designer
            </h1>
          </Link>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-foreground tracking-tight">
            Modern Wall Designer
          </h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Design your feature wall with fluted panels, stickers, and LED strips. Calculate materials and costs in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <WallDesignerForm onCalculate={handleCalculate} onReset={handleReset} />
          </div>
          <div className="lg:col-span-2">
            {/* Visualizer will go here */}
            <div className="flex items-center justify-center h-full min-h-[400px] bg-card rounded-lg border border-dashed mb-8">
              <p className="text-muted-foreground text-center p-4">2D Visualizer Coming Soon!</p>
            </div>
            <WallDesignerResults results={results} />
          </div>
        </div>
      </main>
       <footer className="py-6 md:px-8 md:py-0 border-t mt-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with precision. For illustrative purposes only. Always consult a professional.
          </p>
        </div>
      </footer>
    </div>
  );
}
