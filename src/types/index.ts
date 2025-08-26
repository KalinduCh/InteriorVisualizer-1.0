
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

export interface WallDesignerCalculationResults {
  wallWidth: number;
  wallHeight: number;
  panels6Inch: number;
  panels1ft: number;
  clips: number;
  screws: number;
  rollPlugs: number;
  stickers: number;
  ledStripMeters: number;
  totalCost?: number;

  // Costs for each item
  panels6InchCost?: number;
  panels1ftCost?: number;
  clipsCost?: number;
  stickersCost?: number;
  ledStripCost?: number;
}
