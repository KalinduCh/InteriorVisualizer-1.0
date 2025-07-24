'use client';

import { useState, useCallback } from 'react';
import CalculatorForm from '@/components/calculator-form';
import ResultsDisplay from '@/components/results-display';
import type { CalculationResults } from '@/types';
import { PanelsTopLeft } from 'lucide-react';

export default function Home() {
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleCalculate = useCallback((newResults: CalculationResults | null) => {
    setResults(newResults);
  }, []);
  
  const handleReset = useCallback(() => {
    setResults(null);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto flex items-center p-4">
          <PanelsTopLeft className="w-6 h-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold font-headline text-foreground">
            CeilingCalc Pro
          </h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-foreground tracking-tight">
            Suspended Ceiling Calculator
          </h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Instantly estimate the materials and cost for your 2x2 grid ceiling project. Enter your room dimensions and prices to get started.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <CalculatorForm onCalculate={handleCalculate} onReset={handleReset} />
          </div>
          <div className="lg:col-span-2">
            <ResultsDisplay results={results} />
          </div>
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with precision. For illustrative purposes only. Always consult a professional.
          </p>
        </div>
      </footer>
    </div>
  );
}
