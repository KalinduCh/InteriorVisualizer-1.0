import type { CalculationResults } from "@/types";
import ResultCard from "./result-card";
import { LayoutGrid, Minus, MoveHorizontal, Baseline, Link as LinkIcon, Dot, Lightbulb, PartyPopper, Pin, Construction, Package, CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResultsDisplay({ results }: { results: CalculationResults | null }) {
  if (!results) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-card rounded-lg border border-dashed">
        <p className="text-muted-foreground text-center p-4">Enter dimensions and click Calculate to see the required materials and costs.</p>
      </div>
    );
  }

  const materials = [
    { name: "Ceiling Panels", quantity: results.panels, unit: "panels", description: "2' x 2' panels", icon: <LayoutGrid className="w-8 h-8 text-primary" /> },
    { name: "Cross Tees", quantity: results.crossTees, unit: "tees", description: "2 ft length", icon: <Minus className="w-8 h-8 text-primary" /> },
    { name: "Main Tees", quantity: results.mainTees, unit: "tees", description: "12 ft length", icon: <MoveHorizontal className="w-8 h-8 text-primary" /> },
    { name: "Wall Angles", quantity: results.wallAngles, unit: "angles", description: "10 ft length", icon: <Baseline className="w-8 h-8 text-primary" /> },
    { name: "Binding Wire", quantity: results.binding, unit: "grams", description: "Est. 500g per 200 sq ft", icon: <LinkIcon className="w-8 h-8 text-primary" /> },
    { name: "Nails", quantity: results.nails, unit: "nails", description: "Est. 50 per 200 sq ft", icon: <Dot className="w-8 h-8 text-primary" /> }
  ];
  
  const optionalItems = [
    { name: "LED Bulbs", quantity: results.ledBulbs, unit: "bulbs", icon: <Lightbulb className="w-8 h-8 text-primary" /> },
    { name: "Decorative Bulbs", quantity: results.decorativeBulbs, unit: "bulbs", icon: <PartyPopper className="w-8 h-8 text-primary" /> },
    { name: "Rivets", quantity: results.rivets, unit: "rivets", icon: <Pin className="w-8 h-8 text-primary" /> },
    { name: "Super Nails", quantity: results.superNails, unit: "nails", icon: <Construction className="w-8 h-8 text-primary" /> },
    { name: "Silicone", quantity: results.silicone, unit: "tubes", icon: <Package className="w-8 h-8 text-primary" /> },
    { name: "Extra", quantity: results.extra, unit: "items", icon: <Package className="w-8 h-8 text-primary" /> },
  ].filter(item => item.quantity && item.quantity > 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Required Materials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {materials.map((material) => (
          <ResultCard key={material.name} {...material} description={material.description}/>
        ))}
      </div>
      
      {optionalItems.length > 0 && (
        <>
          <h2 className="text-2xl font-bold my-8 text-center md:text-left">Optional Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {optionalItems.map((item) => (
              <ResultCard key={item.name} name={item.name} quantity={item.quantity!} unit={item.unit} icon={item.icon} description={`${item.quantity} ${item.unit}`} />
            ))}
          </div>
        </>
      )}

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
              ${results.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
