
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Construction, LayoutPanelLeft, PanelsTopLeft } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto flex items-center p-4">
          <Construction className="w-6 h-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold font-headline text-foreground">
            DesignPro - Sivilima Narammala
          </h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-foreground tracking-tight">
            Your Modern Interior Design Toolkit
          </h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-3xl mx-auto">
            Calculate materials, estimate costs, and visualize your next project with our specialized tools. Get started by choosing a calculator below.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/ceiling">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <PanelsTopLeft className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Suspended Ceiling Calculator</CardTitle>
                    <CardDescription>For 2x2 grid ceiling projects.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="aspect-video relative rounded-md overflow-hidden">
                  <Image src="https://picsum.photos/600/400" alt="Suspended Ceiling" fill className="object-cover" data-ai-hint="2x2 ceiling" />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Estimate panels, tees, wires, and costs for your suspended ceiling. Perfect for renovations and new constructions.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/wall-designer">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
              <CardHeader>
                 <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <LayoutPanelLeft className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Wall Panel Designer</CardTitle>
                    <CardDescription>For modern TV and feature walls.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="aspect-video relative rounded-md overflow-hidden">
                   <Image src="https://picsum.photos/600/400" alt="Modern Wall Design" fill className="object-cover" data-ai-hint="wall panel interior" />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Design and visualize your feature wall with fluted panels, stickers, and LED strips. Calculate materials and costs in real-time.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t mt-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Kalindu Athapaththu
          </p>
        </div>
      </footer>
    </div>
  );
}
