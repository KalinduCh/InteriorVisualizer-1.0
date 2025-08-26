import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

type ResultCardProps = {
  icon: ReactNode;
  name: string;
  quantity: number;
  unit: string;
  description: string;
  cost?: number;
};

export default function ResultCard({ icon, name, quantity, unit, description, cost }: ResultCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg leading-tight">{name}</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div>
          <span className="text-4xl md:text-5xl font-bold text-accent">{quantity.toLocaleString()}</span>
          <span className="text-muted-foreground text-lg ml-1">{unit}</span>
        </div>
        {cost !== undefined && cost > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            LKR {cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
