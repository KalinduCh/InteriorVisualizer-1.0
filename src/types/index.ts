





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

export type PanelColor = 'white-gold' | 'teak' | 'black-gold' | 'light-brown';

export type Panel = {
  color: PanelColor;
};

export type FeatureArea = {
  width?: number;
  height?: number;
  color?: 'black-gold' | 'white-gold' | 'white-blue-gold' | 'white-dark-gold';
  blur?: boolean;
  cost?: number;
};

export type CustomPatternSegment = {
  color: PanelColor;
  panels: number;
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
  ledColor?: 'warm-white' | 'cool-white';
  
  featureArea: FeatureArea;
  
  totalCost?: number;

  // Costs for each item
  panelsCost?: number;
  clipsCost?: number;
  ledStripCost?: number;
  featureAreaCost?: number;
}
