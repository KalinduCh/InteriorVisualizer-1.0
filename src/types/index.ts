

export interface CeilingCalculationResults {
  panels: number;
  crossTees: number;
  mainTees: number;
  wallAngles: number;
  binding: number;
  nails: number;
  ledBulbs?: number;
  decorativeBulbs?: number;
  rivets?: number;
  superNails?: number;
  silicone?: number;
  extra?: number;
  totalCost?: number;

  // Costs for each item
  panelsCost?: number;
  crossTeesCost?: number;
  mainTeesCost?: number;
  wallAnglesCost?: number;
  bindingCost?: number;
  nailsCost?: number;
  ledBulbsCost?: number;
  decorativeBulbsCost?: number;
  rivetsCost?: number;
  superNailsCost?: number;
  siliconeCost?: number;
  extraCost?: number;
}

export type PanelColor = 'white-gold' | 'teak' | 'black-gold';

export type Panel = {
  color: PanelColor;
};

export type OtherItem = {
  name: string;
  price: number;
  quantity: number;
};

export interface WallDesignerCalculationResults {
  wallWidth: number;
  wallHeight: number;
  panelType: '6-inch' | '1-ft';
  
  panels: Panel[];
  panelsNeeded: number;
  clips: number;
  screws: number;
  rollPlugs: number;

  ledStripMeters: number;

  otherItems: OtherItem[];
  otherItemsTotalCost?: number;
  
  totalCost?: number;

  // Costs for each item
  panelsCost?: number;
  clipsCost?: number;
  ledStripCost?: number;
}
