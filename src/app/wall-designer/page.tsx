'use client';

import { LayoutPanelLeft } from 'lucide-react';
import Link from 'next/link';

export default function WallDesignerPage() {
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
        <div className="flex items-center justify-center h-full min-h-[60vh] bg-card rounded-lg border border-dashed">
            <p className="text-muted-foreground text-center p-4">Wall Designer Coming Soon!</p>
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
