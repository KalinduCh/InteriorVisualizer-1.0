import type { ReactNode } from "react";

type WallDesignerListItemProps = {
  icon: ReactNode;
  name: string;
  quantity: number;
  unit: string;
  description: string;
  cost?: number;
};

export default function WallDesignerListItem({ icon, name, quantity, unit, description, cost }: WallDesignerListItemProps) {
  return (
    <li className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-sm">{quantity.toLocaleString()} <span className="text-muted-foreground">{unit}</span></p>
        {cost !== undefined && cost > 0 && (
          <p className="text-xs text-muted-foreground">
            {cost.toLocaleString('en-US', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 })}
          </p>
        )}
      </div>
    </li>
  );
}
