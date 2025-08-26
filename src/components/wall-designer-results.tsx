
import type { WallDesignerCalculationResults } from "@/types";
import ResultCard from "./result-card";
import { CircleDollarSign, Cog, LayoutPanelLeft, Lightbulb, Package, Pin, StickyNote, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function WallDesignerResults({ results }: { results: WallDesignerCalculationResults | null }) {
  if (!results || results.panelsNeeded === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] bg-card rounded-lg border border-dashed mt-8">
        <p className="text-muted-foreground text-center p-4">Enter wall dimensions and select a panel type to see results.</p>
      </div>
    );
  }
  
  const hasStickers = results.sticker && results.sticker.quantity && results.sticker.quantity > 0;
  const hasLed = results.ledStripMeters > 0;

  const materials = [
    { name: `Fluted Panels (${results.panelType})`, quantity: results.panelsNeeded, unit: "panels", description: "Required to cover wall width", icon: <LayoutPanelLeft className="w-8 h-8 text-primary" />, cost: results.panelsCost },
    { name: "Clips", quantity: results.clips, unit: "clips", description: "For panel installation", icon: <Cog className="w-8 h-8 text-primary" />, cost: results.clipsCost },
    { name: "Screws", quantity: results.screws, unit: "screws", description: "For clips", icon: <Wrench className="w-8 h-8 text-primary" /> },
    { name: "Roll Plugs", quantity: results.rollPlugs, unit: "plugs", description: "For clips", icon: <Pin className="w-8 h-8 text-primary" /> },
  ];
  
  if (hasLed) {
    materials.push({ name: "LED Strip", quantity: results.ledStripMeters, unit: "meters", description: "Lighting strips", icon: <Lightbulb className="w-8 h-8 text-primary" />, cost: results.ledStripCost });
  }
  if (hasStickers) {
    materials.push({ name: "Wall Stickers", quantity: results.sticker.quantity!, unit: "stickers", description: `${results.sticker.orientation}`, icon: <StickyNote className="w-8 h-8 text-primary" />, cost: results.stickerCost });
  }


  return (
    <div className="mt-8">
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
