
import type { WallDesignerCalculationResults } from "@/types";
import ResultCard from "./result-card";
import { CircleDollarSign, Cog, LayoutPanelLeft, Lightbulb, Pen, Pin, Square, StickyNote, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WallDesignerResults({ results }: { results: WallDesignerCalculationResults | null }) {
  if (!results || (results.panels6Inch === 0 && results.panels1ft === 0 && results.stickers === 0 && results.ledStripMeters === 0)) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] bg-card rounded-lg border border-dashed">
        <p className="text-muted-foreground text-center p-4">Enter materials in the form to see the required items and costs.</p>
      </div>
    );
  }

  const materials = [
    { name: "6\" Fluted Panels", quantity: results.panels6Inch, unit: "panels", description: "6 inch width panels", icon: <LayoutPanelLeft className="w-8 h-8 text-primary" />, cost: results.panels6InchCost },
    { name: "1ft Fluted Panels", quantity: results.panels1ft, unit: "panels", description: "1 ft width panels", icon: <LayoutPanelLeft className="w-8 h-8 text-primary" />, cost: results.panels1ftCost },
    { name: "Clips", quantity: results.clips, unit: "clips", description: "For panel installation", icon: <Cog className="w-8 h-8 text-primary" />, cost: results.clipsCost },
    { name: "Screws", quantity: results.screws, unit: "screws", description: "For clips", icon: <Wrench className="w-8 h-8 text-primary" /> },
    { name: "Roll Plugs", quantity: results.rollPlugs, unit: "plugs", description: "For clips", icon: <Pin className="w-8 h-8 text-primary" /> },
    { name: "Wall Stickers", quantity: results.stickers, unit: "stickers", description: "4ft x 10ft sheets", icon: <StickyNote className="w-8 h-8 text-primary" />, cost: results.stickersCost },
    { name: "LED Strip", quantity: results.ledStripMeters, unit: "meters", description: "Lighting strips", icon: <Lightbulb className="w-8 h-8 text-primary" />, cost: results.ledStripCost },
  ].filter(item => item.quantity && item.quantity > 0);


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Required Materials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {materials.map((material) => (
          <ResultCard key={material.name} {...material} description={material.description}/>
        ))}
      </div>
      
      {results.totalCost !== undefined && results.totalCost > 0 && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDollarSign className="w-8 h-8 text-primary" />
              Estimated Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-5xl font-bold text-accent">
              LKR {results.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

