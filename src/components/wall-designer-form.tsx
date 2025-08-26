
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WallDesignerCalculationResults } from "@/types";

const formSchema = z.object({
  wallWidth: z.coerce.number().positive({ message: "Width must be a positive number." }).min(1),
  wallHeight: z.coerce.number().positive({ message: "Height must be a positive number." }).min(1),
  
  panel6InchQty: z.coerce.number().min(0).optional(),
  panel6InchPrice: z.coerce.number().min(0).optional(),
  panel1ftQty: z.coerce.number().min(0).optional(),
  panel1ftPrice: z.coerce.number().min(0).optional(),
  
  clipsPerPanel: z.coerce.number().min(3).max(5).default(3),
  clipPrice: z.coerce.number().min(0).optional(),
  
  stickerQty: z.coerce.number().min(0).optional(),
  stickerPrice: z.coerce.number().min(0).optional(),

  ledStripLength: z.coerce.number().min(0).optional(), // in feet
  ledStripPricePerMeter: z.coerce.number().min(0).optional(),
});

type WallDesignerFormProps = {
  onCalculate: (results: WallDesignerCalculationResults | null) => void;
  onReset: () => void;
};

export default function WallDesignerForm({ onCalculate, onReset }: WallDesignerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wallWidth: undefined,
      wallHeight: undefined,
      panel6InchQty: 0,
      panel6InchPrice: 0,
      panel1ftQty: 0,
      panel1ftPrice: 0,
      clipsPerPanel: 3,
      clipPrice: 0,
      stickerQty: 0,
      stickerPrice: 0,
      ledStripLength: 0,
      ledStripPricePerMeter: 0,
    },
  });

  const { handleSubmit, control, reset, watch, getValues } = form;

  const calculateMaterials = useCallback((values: z.infer<typeof formSchema>) => {
    const { wallWidth, wallHeight } = values;
    if (isNaN(wallWidth) || isNaN(wallHeight) || wallWidth <= 0 || wallHeight <= 0) {
      onCalculate(null);
      return;
    }

    const panels6Inch = values.panel6InchQty || 0;
    const panels1ft = values.panel1ftQty || 0;
    const totalPanels = panels6Inch + panels1ft;
    const clipsPerPanel = values.clipsPerPanel || 3;
    
    const clips = totalPanels * clipsPerPanel;
    const screws = clips; // 1 screw per clip
    const rollPlugs = clips; // 1 roll plug per clip

    const stickers = values.stickerQty || 0;
    
    const ledStripFeet = values.ledStripLength || 0;
    const ledStripMeters = parseFloat((ledStripFeet / 3.281).toFixed(2));

    const panels6InchCost = panels6Inch * (values.panel6InchPrice || 0);
    const panels1ftCost = panels1ft * (values.panel1ftPrice || 0);
    const clipsCost = clips * (values.clipPrice || 0);
    const stickersCost = stickers * (values.stickerPrice || 0);
    const ledStripCost = ledStripMeters * (values.ledStripPricePerMeter || 0);

    const totalCost = panels6InchCost + panels1ftCost + clipsCost + stickersCost + ledStripCost;
    
    const results: WallDesignerCalculationResults = {
      wallWidth,
      wallHeight,
      panels6Inch,
      panels1ft,
      clips,
      screws,
      rollPlugs,
      stickers,
      ledStripMeters,
      totalCost,
      panels6InchCost,
      panels1ftCost,
      clipsCost,
      stickersCost,
      ledStripCost,
    };
    onCalculate(results);
  }, [onCalculate]);
  
  useEffect(() => {
    const subscription = watch((values) => {
      calculateMaterials(values as z.infer<typeof formSchema>);
    });
    calculateMaterials(getValues());
    
    return () => subscription.unsubscribe();
  }, [watch, calculateMaterials, getValues]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    calculateMaterials(values);
  }
  
  const handleResetClick = () => {
    reset({
      wallWidth: undefined,
      wallHeight: undefined,
      panel6InchQty: 0,
      panel6InchPrice: 0,
      panel1ftQty: 0,
      panel1ftPrice: 0,
      clipsPerPanel: 3,
      clipPrice: 0,
      stickerQty: 0,
      stickerPrice: 0,
      ledStripLength: 0,
      ledStripPricePerMeter: 0,
    });
    onReset();
  }

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
                    <Input type="number" placeholder="e.g. 10" {...field} step="0.1" onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
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
                    <Input type="number" placeholder="e.g. 9.5" {...field} step="0.1" onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <Accordion type="multiple" className="w-full px-6" defaultValue={['item-1', 'item-2', 'item-3', 'item-4']}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Fluted Panels</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">Enter the quantity of each panel size you plan to use.</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="panel6InchQty" render={({ field }) => (<FormItem><FormLabel>6" Panels (qty)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  <FormField control={control} name="panel6InchPrice" render={({ field }) => (<FormItem><FormLabel>Price/Panel</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="panel1ftQty" render={({ field }) => (<FormItem><FormLabel>1ft Panels (qty)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  <FormField control={control} name="panel1ftPrice" render={({ field }) => (<FormItem><FormLabel>Price/Panel</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
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
                  <FormField control={control} name="clipPrice" render={({ field }) => (<FormItem><FormLabel>Clip Price (incl. screw/plug)</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Wall Stickers</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">Stickers are 4ft x 10ft.</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="stickerQty" render={({ field }) => (<FormItem><FormLabel>Stickers (qty)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  <FormField control={control} name="stickerPrice" render={({ field }) => (<FormItem><FormLabel>Price/Sticker</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>LED Lighting</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="ledStripLength" render={({ field }) => (<FormItem><FormLabel>LED Strip (ft)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  <FormField control={control} name="ledStripPricePerMeter" render={({ field }) => (<FormItem><FormLabel>Price/Meter</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                </div>
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
