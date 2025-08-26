
import type { WallDesignerCalculationResults, OtherItem } from "@/types";
import ResultCard from "./result-card";
import { CircleDollarSign, Cog, LayoutPanelLeft, Lightbulb, Package, Pin, Wrench } from "lucide-react";
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
  
  const hasOtherItems = results.otherItems && results.otherItems.length > 0;
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

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Required Materials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {materials.map((material) => (
          <ResultCard key={material.name} {...material} description={material.description}/>
        ))}
      </div>
      
      {hasOtherItems && (
         <>
          <h2 className="text-2xl font-bold my-8 text-center md:text-left">Other Items</h2>
           <Card>
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.otherItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">LKR {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right">LKR {(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
           </Card>
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
              LKR {results.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
