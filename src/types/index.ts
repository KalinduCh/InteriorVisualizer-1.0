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
