
'use client';

import { WallDesignerCalculationResults } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tv2 } from "lucide-react";

type WallVisualizerProps = {
  results: WallDesignerCalculationResults | null;
};

const VISUALIZER_MAX_WIDTH = 800; // in pixels
const PANEL_HEIGHT_FT = 9.5;


const panelColorMap = {
    'white-gold': 'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-50 via-gray-100 to-gray-200',
    'teak': 'bg-gradient-to-b from-yellow-700 via-yellow-800 to-yellow-900',
    'black-gold': 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black',
    'light-brown': 'bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400',
};

const panelVeinMap = {
    'white-gold': 'bg-[linear-gradient(105deg,transparent_0%,transparent_45%,#e5a52d_50%,transparent_55%,transparent_100%),linear-gradient(15deg,transparent_0%,transparent_45%,#d1d5db_50%,transparent_55%,transparent_100%)]',
    'teak': '',
    'black-gold': 'bg-[linear-gradient(105deg,transparent_0%,transparent_45%,#e5a52d_50%,transparent_55%,transparent_100%),linear-gradient(15deg,transparent_0%,transparent_45%,#9ca3af_50%,transparent_55%,transparent_100%)]',
    'light-brown': 'bg-[linear-gradient(105deg,transparent_0%,transparent_48%,#a16207_50%,transparent_52%,transparent_100%)] opacity-30',
}

const featureAreaColorMap = {
    'black-gold': "bg-gray-900 border-gray-600 bg-[linear-gradient(145deg,transparent_20%,rgba(0,0,0,0.8)_20.2%,rgba(0,0,0,0.8)_29.8%,transparent_30%),linear-gradient(35deg,transparent_30%,rgba(212,175,55,0.6)_30.2%,rgba(212,175,55,0.8)_35.1%,transparent_35.5%),linear-gradient(35deg,transparent_60%,rgba(212,175,55,0.6)_60.2%,rgba(212,175,55,0.8)_65.1%,transparent_65.5%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_80%)]",
    'white-gold': "bg-gray-50 border-gray-300 bg-[linear-gradient(145deg,transparent_20%,rgba(100,100,100,0.8)_20.1%,rgba(10,10,10,0.9)_29.9%,transparent_30.1%),linear-gradient(35deg,transparent_30%,rgba(212,175,55,0.6)_30.2%,rgba(212,175,55,0.8)_35.1%,transparent_35.5%),linear-gradient(35deg,transparent_60%,rgba(212,175,55,0.6)_60.2%,rgba(212,175,55,0.8)_65.1%,transparent_65.5%),radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0)_50%)]",
    'white-blue-gold': "bg-white border-blue-200 bg-[repeating-linear-gradient(45deg,_transparent,_transparent_80px,_rgba(218,165,32,0.5)_82px,_transparent_85px),repeating-linear-gradient(60deg,_transparent,_transparent_100px,_rgba(30,144,255,0.3)_102px,_transparent_105px)] mix-blend-multiply",
    'white-dark-gold': "bg-gray-200 border-yellow-700 bg-[repeating-linear-gradient(45deg,_transparent,_transparent_100px,_rgba(184,134,11,0.6)_102px,_transparent_105px),repeating-linear-gradient(70deg,_transparent,_transparent_70px,_rgba(160,82,45,0.3)_72px,_transparent_75px)] mix-blend-multiply"
};


const ledGlowMap = {
    'warm-white': 'shadow-[0_0_25px_8px_rgba(255,214,148,0.6)]',
    'cool-white': 'shadow-[0_0_25px_8px_rgba(200,220,255,0.7)]',
}

// Aspect ratio of 16:9
const getTvDimensionsInFeet = (diagonalInches: number) => {
    const heightInches = diagonalInches * 0.49;
    const widthInches = diagonalInches * 0.87;
    return {
        widthFt: widthInches / 12,
        heightFt: heightInches / 12,
    };
};

export default function WallVisualizer({ results }: WallVisualizerProps) {
  if (!results || !results.wallWidth || !results.wallHeight || !results.panels || results.panels.length === 0) {
    return (
       <div className="flex items-center justify-center h-full min-h-[400px] bg-card rounded-lg border border-dashed mb-8">
          <p className="text-muted-foreground text-center p-4">Enter wall dimensions and select a panel type to start visualizing.</p>
        </div>
    );
  }

  const { wallWidth, wallHeight, panels, featureArea, ledStripMeters, ledColor, tv } = results;

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
  const showJoint = wallHeight > PANEL_HEIGHT_FT;
  const jointPositionPercentage = showJoint ? (PANEL_HEIGHT_FT / wallHeight) * 100 : 0;


  const featureAreaWidth = hasFeatureArea ? (featureArea.width! / wallWidth) * 100 : 0;
  const featureAreaHeight = hasFeatureArea ? (featureArea.height! / wallHeight) * 100 : 0;

  const showTv = tv?.enabled && tv.size && hasFeatureArea;
  let tvDimensions = { widthPercent: 0, heightPercent: 0 };
  if (showTv) {
      const { widthFt, heightFt } = getTvDimensionsInFeet(tv.size!);
      tvDimensions = {
          widthPercent: (widthFt / featureArea.width!) * 100,
          heightPercent: (heightFt / featureArea.height!) * 100,
      };
  }


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
              {showJoint && (
                <div 
                  className="absolute left-0 w-full h-px bg-red-500 opacity-70"
                  style={{ top: `${jointPositionPercentage}%` }}
                  title={`Joint at ${PANEL_HEIGHT_FT} ft`}
                />
              )}
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
                        <div className="w-full h-full flex items-center justify-center relative">
                             {showTv ? (
                                 <div 
                                     className="bg-black rounded-sm border-2 border-gray-700 flex items-center justify-center"
                                     style={{
                                         width: `${tvDimensions.widthPercent}%`,
                                         height: `${tvDimensions.heightPercent}%`,
                                     }}
                                 >
                                    <span className="text-white/50 text-xs">{tv.size}" TV</span>
                                 </div>
                             ) : (
                                <Tv2 className="w-1/2 h-1/2 text-gray-400/50" />
                             )}
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
