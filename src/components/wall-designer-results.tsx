
import type { WallDesignerCalculationResults } from "@/types";
import ResultCard from "./result-card";
import { CircleDollarSign, Cog, LayoutPanelLeft, Lightbulb, Package, Pin, Tv, HardHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WallDesignerResults({ results }: { results: WallDesignerCalculationResults | null }) {
  if (!results || results.panelsNeeded === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] bg-card rounded-lg border border-dashed mt-8">
        <p className="text-muted-foreground text-center p-4">Enter wall dimensions and select a panel type to see results.</p>
      </div>
    );
  }
  
  const hasFeatureArea = results.featureArea && (results.featureArea.width ?? 0) > 0 && (results.featureArea.height ?? 0) > 0;
  const hasLed = results.ledStripMeters > 0;
  const hasLabor = results.laborCost && results.laborCost > 0;

  const materials = [
    { name: `Fluted Panels (${results.panelType})`, quantity: results.panelsNeeded, unit: "panels", description: "Accounts for cutting & waste", icon: <LayoutPanelLeft className="w-8 h-8 text-primary" />, cost: results.panelsCost },
    { name: "Clips", quantity: results.clips, unit: "clips", description: "For panel installation", icon: <Cog className="w-8 h-8 text-primary" />, cost: results.clipsCost },
    { name: "Screws", quantity: results.screws, unit: "screws", description: "For clips", icon: <Package className="w-8 h-8 text-primary" />, cost: results.screwsCost },
    { name: "Roll Plugs", quantity: results.rollPlugs, unit: "plugs", description: "For screws", icon: <Package className="w-8 h-8 text-primary" />, cost: results.plugsCost },
  ];
  
  if (results.superNails && results.superNails > 0) {
    materials.push({ name: "Super Nails", quantity: results.superNails, unit: "nails", description: "For extra strength", icon: <Pin className="w-8 h-8 text-primary" />, cost: results.superNailsCost });
  }

  if (hasLed) {
    materials.push({ name: "LED Strip", quantity: results.ledStripMeters, unit: "meters", description: "Lighting strips", icon: <Lightbulb className="w-8 h-8 text-primary" />, cost: results.ledStripCost });
  }
  if (hasFeatureArea) {
    materials.push({ name: "Feature Area", quantity: 1, unit: "area", description: `${results.featureArea.width}ft x ${results.featureArea.height}ft`, icon: <Tv className="w-8 h-8 text-primary" />, cost: results.featureAreaCost });
  }
  if (hasLabor) {
    materials.push({ name: "Labor", quantity: 1, unit: "cost", description: "Estimated labor charges", icon: <HardHat className="w-8 h-8 text-primary" />, cost: results.laborCost });
  }


  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Required Materials & Costs</h2>
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
            <p className="text-sm text-muted-foreground mt-1">Includes materials and estimated labor.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
