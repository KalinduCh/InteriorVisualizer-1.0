
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useEffect, useCallback } from "react";
import { PlusCircle, Trash2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WallDesignerCalculationResults, Panel, Sticker, CustomPatternSegment } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const panelSchema = z.object({
  color: z.enum(['white-gold', 'teak', 'black-gold']).default('white-gold'),
});

const stickerSchema = z.object({
  quantity: z.coerce.number().min(0).default(0),
  price: z.coerce.number().min(0).default(0),
  orientation: z.enum(['vertical', 'horizontal']).default('vertical'),
});

const customPatternSegmentSchema = z.object({
  color: z.enum(['white-gold', 'teak', 'black-gold']).default('white-gold'),
  panels: z.coerce.number().min(1),
});

const formSchema = z.object({
  wallWidth: z.coerce.number().positive({ message: "Width must be a positive number." }).min(1),
  wallHeight: z.coerce.number().positive({ message: "Height must be a positive number." }).min(1),
  
  panelType: z.enum(['6-inch', '1-ft'], { required_error: "You need to select a panel type."}),
  panelPrice: z.coerce.number().min(0).default(0),
  
  designStyle: z.enum(['alternating', 'center-stage', 'gradient-flow', 'custom']).default('alternating'),
  
  // For presets
  primaryColor: z.enum(['white-gold', 'teak', 'black-gold']).default('black-gold'),
  secondaryColor: z.enum(['white-gold', 'teak', 'black-gold']).default('white-gold'),
  
  // For custom pattern
  customPattern: z.array(customPatternSegmentSchema),

  panels: z.array(panelSchema),

  clipsPerPanel: z.coerce.number().min(3).max(5).default(3),
  clipPrice: z.coerce.number().min(0).default(0),
  
  ledStripLength: z.coerce.number().min(0).default(0),
  ledStripPricePerMeter: z.coerce.number().min(0).default(0),

  sticker: stickerSchema,
});

type WallDesignerFormProps = {
  onCalculate: (results: WallDesignerCalculationResults | null) => void;
  onReset: () => void;
};

function generatePanelsFromStyle(values: z.infer<typeof formSchema>, panelsNeeded: number): Panel[] {
    const { designStyle, primaryColor, secondaryColor, customPattern } = values;

    if (panelsNeeded <= 0) return [];

    switch (designStyle) {
        case 'alternating':
            return Array.from({ length: panelsNeeded }, (_, i) => ({
                color: i % 2 === 0 ? primaryColor : secondaryColor,
            }));
        case 'center-stage': {
            const centerSize = Math.max(1, Math.floor(panelsNeeded / 3));
            const sideSize = Math.floor((panelsNeeded - centerSize) / 2);
            const panels: Panel[] = [];
            for (let i = 0; i < sideSize; i++) panels.push({ color: primaryColor });
            for (let i = 0; i < centerSize; i++) panels.push({ color: secondaryColor });
            // The rest of the panels
            const remaining = panelsNeeded - panels.length;
            for (let i = 0; i < remaining; i++) panels.push({ color: primaryColor });
            return panels;
        }
        case 'gradient-flow': {
             const panels: Panel[] = [];
             for (let i = 0; i < panelsNeeded; i++) {
                const ratio = i / (panelsNeeded - 1);
                if (ratio < 0.5) {
                    panels.push({ color: primaryColor });
                } else {
                    panels.push({ color: secondaryColor });
                }
            }
            return panels;
        }
        case 'custom': {
            const panels: Panel[] = [];
            if (!customPattern || customPattern.length === 0) {
                 return Array.from({ length: panelsNeeded }, () => ({ color: 'white-gold' }));
            }
            let patternIndex = 0;
            while(panels.length < panelsNeeded && customPattern.length > 0) {
                const segment = customPattern[patternIndex % customPattern.length];
                for (let i = 0; i < segment.panels; i++) {
                    if(panels.length < panelsNeeded) {
                        panels.push({ color: segment.color });
                    }
                }
                patternIndex++;
            }
            // Fill remaining panels if custom pattern is not enough
            while(panels.length < panelsNeeded) {
                panels.push({ color: 'white-gold' });
            }
            return panels.slice(0, panelsNeeded);
        }
        default:
            return Array.from({ length: panelsNeeded }, () => ({ color: 'white-gold' }));
    }
}


export default function WallDesignerForm({ onCalculate, onReset }: WallDesignerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wallWidth: undefined,
      wallHeight: undefined,
      panelPrice: 0,
      panels: [],
      clipsPerPanel: 3,
      clipPrice: 0,
      ledStripLength: 0,
      ledStripPricePerMeter: 0,
      sticker: { quantity: 0, price: 0, orientation: 'vertical' },
      designStyle: 'alternating',
      primaryColor: 'black-gold',
      secondaryColor: 'white-gold',
      customPattern: [{ color: 'black-gold', panels: 3 }, { color: 'white-gold', panels: 2 }],
    },
  });

  const { control, reset, watch, getValues, handleSubmit, setValue } = form;
  
  const { fields: customPatternFields, append: appendCustomPattern, remove: removeCustomPattern } = useFieldArray({
    control,
    name: "customPattern"
  });

  const calculateMaterials = useCallback((values: z.infer<typeof formSchema>) => {
    const { wallWidth, wallHeight, panelType } = values;

    if (isNaN(wallWidth) || isNaN(wallHeight) || wallWidth <= 0 || wallHeight <= 0 || !panelType) {
      onCalculate(null);
      return;
    }
    
    const panelWidthInFeet = panelType === '1-ft' ? 1 : 0.5;
    const panelsNeeded = Math.ceil(wallWidth / panelWidthInFeet);
    const generatedPanels = generatePanelsFromStyle(values, panelsNeeded);
    
    // This is a "controlled" way to update the field array
    setValue('panels', generatedPanels, { shouldValidate: false, shouldDirty: true });

    const clipsPerPanel = values.clipsPerPanel || 3;
    const clips = panelsNeeded * clipsPerPanel;
    const screws = clips; // 1 screw per clip
    const rollPlugs = clips; // 1 roll plug per clip
    
    const ledStripFeet = values.ledStripLength || 0;
    const ledStripMeters = parseFloat((ledStripFeet / 3.281).toFixed(2));
    
    const stickerCost = (values.sticker?.quantity || 0) * (values.sticker?.price || 0);

    const panelsCost = panelsNeeded * (values.panelPrice || 0);
    const clipsCost = clips * (values.clipPrice || 0);
    const ledStripCost = ledStripMeters * (values.ledStripPricePerMeter || 0);
    
    const totalCost = panelsCost + clipsCost + ledStripCost + stickerCost;
    
    const results: WallDesignerCalculationResults = {
      wallWidth,
      wallHeight,
      panelType,
      panels: generatedPanels,
      panelsNeeded,
      clips,
      screws,
      rollPlugs,
      ledStripMeters,
      sticker: values.sticker,
      totalCost,
      panelsCost,
      clipsCost,
      ledStripCost,
      stickerCost,
    };
    onCalculate(results);
  }, [onCalculate, setValue]);
  

  useEffect(() => {
    const subscription = watch((values, { name, type }) => {
       // Exit early if the change was triggered by `setValue` to avoid loops
      if (type === 'setValue') return;
      calculateMaterials(values as z.infer<typeof formSchema>);
    });
    calculateMaterials(getValues());
    
    return () => subscription.unsubscribe();
  }, [watch, calculateMaterials, getValues]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    calculateMaterials(values);
  }
  
  const handleResetClick = () => {
    reset();
    onReset();
  }
  
  const designStyle = watch('designStyle');

  return (
    <Card className="shadow-lg">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Wall Designer</CardTitle>
            <CardDescription>Enter dimensions and materials for your feature wall.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <FormField
              control={control}
              name="wallWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wall Width (ft)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 10" {...field} step="0.1" value={field.value ?? 0} onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="wallHeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wall Height (ft)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 9.5" {...field} step="0.1" value={field.value ?? 0} onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={control}
              name="panelType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Panel Size</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="6-inch" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          6-inch width
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1-ft" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          1-ft width
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <Accordion type="multiple" className="w-full px-6" defaultValue={['item-1', 'item-2', 'item-3', 'item-4']}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Panel Configuration</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <FormField control={control} name="panelPrice" render={({ field }) => (<FormItem><FormLabel>Price per Panel</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} step="0.01" /></FormControl></FormItem>)} />
                 <FormField
                    control={control}
                    name="designStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a design style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="alternating">Alternating</SelectItem>
                            <SelectItem value="center-stage">Center Stage</SelectItem>
                            <SelectItem value="gradient-flow">Gradient Flow</SelectItem>
                            <SelectItem value="custom">Custom Pattern</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <div className={cn("space-y-4", designStyle === 'custom' ? "hidden" : "")}>
                   <FormField
                      control={control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="white-gold">White with Gold</SelectItem>
                              <SelectItem value="teak">Teak</SelectItem>
                              <SelectItem value="black-gold">Black with Gold</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="white-gold">White with Gold</SelectItem>
                              <SelectItem value="teak">Teak</SelectItem>
                              <SelectItem value="black-gold">Black with Gold</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                </div>
                
                <div className={cn("space-y-4", designStyle !== 'custom' ? "hidden" : "")}>
                   <FormLabel>Custom Pattern Segments</FormLabel>
                    {customPatternFields.map((field, index) => (
                      <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md">
                        <FormField
                            control={control}
                            name={`customPattern.${index}.color`}
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormLabel className="text-xs">Color</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="white-gold">White & Gold</SelectItem>
                                            <SelectItem value="teak">Teak</SelectItem>
                                            <SelectItem value="black-gold">Black & Gold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`customPattern.${index}.panels`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">No. of Panels</FormLabel>
                                    <FormControl><Input type="number" {...field} className="w-24" value={field.value ?? 0} onChange={(e) => field.onChange(e.target.value === '' ? 0 : +e.target.value)}/></FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomPattern(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                     <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => appendCustomPattern({ color: 'white-gold', panels: 1 })}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Segment
                    </Button>
                </div>


              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Panel Fittings</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <FormField
                    control={control}
                    name="clipsPerPanel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clips per Panel</FormLabel>
                        <Select onValueChange={(value) => field.onChange(+value)} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select clips per panel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3">3 (Standard)</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={control} name="clipPrice" render={({ field }) => (<FormItem><FormLabel>Clip Price (incl. screw/plug)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} step="0.01" /></FormControl></FormItem>)} />
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-3">
              <AccordionTrigger>LED Lighting</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="ledStripLength" render={({ field }) => (<FormItem><FormLabel>LED Strip (ft)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} /></FormControl></FormItem>)} />
                  <FormField control={control} name="ledStripPricePerMeter" render={({ field }) => (<FormItem><FormLabel>Price/Meter</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} step="0.01" /></FormControl></FormItem>)} />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Wall Stickers</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={control} name="sticker.quantity" render={({ field }) => (<FormItem><FormLabel>Sticker Quantity</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} /></FormControl></FormItem>)} />
                    <FormField control={control} name="sticker.price" render={({ field }) => (<FormItem><FormLabel>Price/Sticker</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? 0} step="0.01" /></FormControl></FormItem>)} />
                 </div>
                 <FormField
                    control={control}
                    name="sticker.orientation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sticker Orientation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vertical">Vertical</SelectItem>
                            <SelectItem value="horizontal">Horizontal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <CardFooter className="flex flex-col sm:flex-row gap-2 pt-6">
            <Button type="submit" className="flex-1">Calculate</Button>
            <Button type="button" variant="secondary" onClick={handleResetClick} className="flex-1">Reset</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
