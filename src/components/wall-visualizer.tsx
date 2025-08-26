
'use client';

import { WallDesignerCalculationResults } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tv2 } from "lucide-react";

type WallVisualizerProps = {
  results: WallDesignerCalculationResults | null;
};

const VISUALIZER_MAX_WIDTH = 800; // in pixels

const panelColorMap = {
    'white-gold': 'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-50 via-gray-100 to-gray-200',
    'teak': 'bg-gradient-to-b from-yellow-700 via-yellow-800 to-yellow-900',
    'black-gold': 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black',
};

const panelVeinMap = {
    'white-gold': 'bg-[linear-gradient(105deg,transparent_0%,transparent_45%,#e5a52d_50%,transparent_55%,transparent_100%),linear-gradient(15deg,transparent_0%,transparent_45%,#d1d5db_50%,transparent_55%,transparent_100%)]',
    'teak': '',
    'black-gold': 'bg-[linear-gradient(105deg,transparent_0%,transparent_45%,#e5a52d_50%,transparent_55%,transparent_100%),linear-gradient(15deg,transparent_0%,transparent_45%,#9ca3af_50%,transparent_55%,transparent_100%)]',
}


const featureAreaColorMap = {
    'white-gold': 'bg-gradient-to-br from-slate-50 to-slate-300 border-slate-300',
    'white-blue': 'bg-gradient-to-br from-sky-50 to-sky-200 border-sky-300',
    'black': 'bg-black border-gray-700',
    'texture': 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black border-gray-600',
};

const ledGlowMap = {
    'warm-white': 'shadow-[0_0_25px_8px_rgba(255,214,148,0.6)]',
    'cool-white': 'shadow-[0_0_25px_8px_rgba(200,220,255,0.7)]',
}

export default function WallVisualizer({ results }: WallVisualizerProps) {
  if (!results || !results.wallWidth || !results.wallHeight || !results.panels || results.panels.length === 0) {
    return (
       <div className="flex items-center justify-center h-full min-h-[400px] bg-card rounded-lg border border-dashed mb-8">
          <p className="text-muted-foreground text-center p-4">Enter wall dimensions and select a panel type to start visualizing.</p>
        </div>
    );
  }

  const { wallWidth, wallHeight, panels, featureArea, ledStripMeters, ledColor } = results;

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
  const hasFeatureArea = featureArea && (featureArea.width ?? 0) > 0 && (featureArea.height ?? 0) > 0;
  const hasLed = ledStripMeters > 0;

  const featureAreaWidth = hasFeatureArea ? (featureArea.width! / wallWidth) * 100 : 0;
  const featureAreaHeight = hasFeatureArea ? (featureArea.height! / wallHeight) * 100 : 0;


  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-center mb-2">2D Visualizer</h3>
      <div className="relative" style={{ width: `${visualizerWidth}px`, height: `${visualizerHeight}px`, maxWidth: '100%' }}>
        <Card className="relative overflow-hidden h-full w-full">
          <CardContent className="p-0 h-full w-full bg-muted/30 flex flex-row relative">
              {panels.map((panel, index) => {
                  const panelStyle = {
                      width: `${panelWidthPercentage}%`,
                      height: '100%',
                  };
                  return (
                      <div key={index} className={cn("border-r border-black/20 relative", panelColorMap[panel.color])} style={panelStyle}>
                          <div className={cn("absolute inset-0 opacity-50", panelVeinMap[panel.color])} />
                      </div>
                  )
              })}
              {hasFeatureArea && (
                  <div
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-lg"
                     style={{
                        width: `${featureAreaWidth}%`,
                        height: `${featureAreaHeight}%`,
                     }}
                  >
                    <div className={cn(
                        "h-full w-full rounded-lg border-2",
                        featureArea.color && featureAreaColorMap[featureArea.color],
                        featureArea.blur && 'backdrop-blur-sm bg-opacity-50',
                        hasLed && ledColor && ledGlowMap[ledColor]
                    )}>
                        <div className="w-full h-full flex items-center justify-center">
                             <Tv2 className="w-1/2 h-1/2 text-gray-400/50" />
                        </div>
                    </div>
                  </div>
              )}
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
