
'use client';

import { WallDesignerCalculationResults } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

type WallVisualizerProps = {
  results: WallDesignerCalculationResults | null;
};

const VISUALIZER_MAX_WIDTH = 800; // in pixels

export default function WallVisualizer({ results }: WallVisualizerProps) {
  if (!results || !results.wallWidth || !results.wallHeight) {
    return (
       <div className="flex items-center justify-center h-full min-h-[400px] bg-card rounded-lg border border-dashed mb-8">
          <p className="text-muted-foreground text-center p-4">Enter wall dimensions to start visualizing.</p>
        </div>
    );
  }

  const { wallWidth, wallHeight, panels1ft, panels6Inch } = results;

  // Calculate the aspect ratio
  const aspectRatio = wallWidth / wallHeight;
  
  // Calculate the dimensions of the visualizer
  const visualizerWidth = VISUALIZER_MAX_WIDTH;
  const visualizerHeight = visualizerWidth / aspectRatio;

  const totalPanels = (panels1ft || 0) + (panels6Inch || 0);

  if (totalPanels === 0) {
     return (
       <div className="mb-8">
        <h3 className="text-lg font-semibold text-center mb-2">2D Visualizer</h3>
        <Card className="relative overflow-hidden" style={{ width: `${visualizerWidth}px`, height: `${visualizerHeight}px`, maxWidth: '100%' }}>
            <CardContent className="p-0 h-full w-full bg-muted/30 flex items-center justify-center">
                 <p className="text-muted-foreground text-center p-4">Add panels in the form to see them on the wall.</p>
            </CardContent>
        </Card>
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>Width: {wallWidth} ft</span>
            <span>Height: {wallHeight} ft</span>
        </div>
       </div>
    );
  }
  
  // Create an array of panel widths in feet
  const panelItems = [
    ...Array(panels1ft || 0).fill(1),
    ...Array(panels6Inch || 0).fill(0.5),
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-center mb-2">2D Visualizer</h3>
      <Card className="relative overflow-hidden" style={{ width: `${visualizerWidth}px`, height: `${visualizerHeight}px`, maxWidth: '100%' }}>
        <CardContent className="p-0 h-full w-full bg-muted/30 flex flex-row">
            {panelItems.map((panelWidth, index) => {
                 const panelStyle = {
                    width: `${(panelWidth / wallWidth) * 100}%`,
                    height: '100%',
                 };
                 return (
                    <div key={index} className="bg-primary/20 border-r border-primary/50" style={panelStyle}>
                        <div className="h-full w-full border-2 border-dashed border-primary/30"/>
                    </div>
                 )
            })}
        </CardContent>
      </Card>
      <div className="flex justify-between text-sm text-muted-foreground mt-1">
        <span>Width: {wallWidth} ft</span>
        <span>Height: {wallHeight} ft</span>
      </div>
    </div>
  );
}
