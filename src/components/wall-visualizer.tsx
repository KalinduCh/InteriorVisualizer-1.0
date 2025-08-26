
'use client';

import { WallDesignerCalculationResults } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tv2 } from "lucide-react";

type WallVisualizerProps = {
  results: WallDesignerCalculationResults | null;
};

const VISUALIZER_MAX_WIDTH = 800; // in pixels

const colorMap = {
    'white-gold': 'from-slate-50 to-slate-200',
    'teak': 'from-yellow-700 to-yellow-900',
    'black-gold': 'from-gray-800 to-gray-950',
};

const goldStripe = "absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px] bg-amber-400/50";

export default function WallVisualizer({ results }: WallVisualizerProps) {
  if (!results || !results.wallWidth || !results.wallHeight || !results.panels || results.panels.length === 0) {
    return (
       <div className="flex items-center justify-center h-full min-h-[400px] bg-card rounded-lg border border-dashed mb-8">
          <p className="text-muted-foreground text-center p-4">Enter wall dimensions and select a panel type to start visualizing.</p>
        </div>
    );
  }

  const { wallWidth, wallHeight, panels, sticker, ledStripMeters } = results;

  const aspectRatio = wallWidth / wallHeight;
  const visualizerWidth = VISUALIZER_MAX_WIDTH;
  const visualizerHeight = visualizerWidth / aspectRatio;

  if (panels.length === 0) {
     return (
       <div className="mb-8">
        <h3 className="text-lg font-semibold text-center mb-2">2D Visualizer</h3>
        <Card className="relative overflow-hidden" style={{ width: `${visualizerWidth}px`, height: `${visualizerHeight}px`, maxWidth: '100%' }}>
            <CardContent className="p-0 h-full w-full bg-muted/30 flex items-center justify-center">
                 <p className="text-muted-foreground text-center p-4">Calculated panel quantity is zero.</p>
            </CardContent>
        </Card>
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>Width: {wallWidth} ft</span>
            <span>Height: {wallHeight} ft</span>
        </div>
       </div>
    );
  }
  
  const panelWidthPercentage = (1 / panels.length) * 100;
  const hasStickers = sticker && sticker.quantity && sticker.quantity > 0;
  const hasLed = ledStripMeters > 0;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-center mb-2">2D Visualizer</h3>
      <div className="relative" style={{ width: `${visualizerWidth}px`, height: `${visualizerHeight}px`, maxWidth: '100%' }}>
         {hasLed && <div className="absolute -top-2 left-0 w-full h-2 bg-amber-200/80 blur-sm" />}
        <Card className="relative overflow-hidden h-full w-full">
          <CardContent className="p-0 h-full w-full bg-muted/30 flex flex-row relative">
              {panels.map((panel, index) => {
                  const panelStyle = {
                      width: `${panelWidthPercentage}%`,
                      height: '100%',
                  };
                  const hasGoldStripe = panel.color === 'white-gold' || panel.color === 'black-gold';
                  return (
                      <div key={index} className={cn("border-r border-black/20 relative bg-gradient-to-r", colorMap[panel.color])} style={panelStyle}>
                          {hasGoldStripe && <div className={goldStripe} />}
                      </div>
                  )
              })}
              {hasStickers && Array.from({ length: sticker.quantity! }).map((_, i) => (
                  <div 
                      key={`sticker-${i}`} 
                      className={cn(
                          "absolute bg-slate-500/30 backdrop-blur-sm border-2 border-slate-400/50 rounded-lg",
                          sticker.orientation === 'vertical' ? 'w-10 h-32' : 'w-32 h-10'
                      )}
                      style={{
                          top: `${20 + i * 10}%`,
                          left: `${20 + i * 15}%`,
                      }}
                  ></div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 bg-black/80 rounded-lg border-4 border-gray-600 flex items-center justify-center">
                      <Tv2 className="w-16 h-16 text-gray-400/50" />
                  </div>
              </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground mt-1 px-1">
        <span>Width: {wallWidth} ft</span>
        <span>Height: {wallHeight} ft</span>
      </div>
    </div>
  );
}
