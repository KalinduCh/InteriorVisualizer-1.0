
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
import type { WallDesignerCalculationResults } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const otherItemSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  price: z.coerce.number().min(0, "Price cannot be negative."),
});

const formSchema = z.object({
  wallWidth: z.coerce.number().positive({ message: "Width must be a positive number." }).min(1),
  wallHeight: z.coerce.number().positive({ message: "Height must be a positive number." }).min(1),
  
  panelType: z.enum(['6-inch', '1-ft'], { required_error: "You need to select a panel type."}),
  panelPrice: z.coerce.number().min(0).optional(),
  
  panelColor: z.enum(['white-gold', 'teak', 'black-gold']).default('white-gold'),

  clipsPerPanel: z.coerce.number().min(3).max(5).default(3),
  clipPrice: z.coerce.number().min(0).optional(),
  
  ledStripLength: z.coerce.number().min(0).optional(), // in feet
  ledStripPricePerMeter: z.coerce.number().min(0).optional(),

  otherItems: z.array(otherItemSchema).optional(),
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
      panelPrice: 0,
      clipsPerPanel: 3,
      clipPrice: 0,
      ledStripLength: 0,
      ledStripPricePerMeter: 0,
      panelColor: 'white-gold',
      otherItems: [],
    },
  });

  const { control, reset, watch, getValues, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherItems"
  });

  const calculateMaterials = useCallback((values: z.infer<typeof formSchema>) => {
    const { wallWidth, wallHeight, panelType } = values;

    if (isNaN(wallWidth) || isNaN(wallHeight) || wallWidth <= 0 || wallHeight <= 0 || !panelType) {
      onCalculate(null);
      return;
    }
    
    const panelWidthInFeet = panelType === '1-ft' ? 1 : 0.5;
    const panelsNeeded = Math.ceil(wallWidth / panelWidthInFeet);
    
    const clipsPerPanel = values.clipsPerPanel || 3;
    const clips = panelsNeeded * clipsPerPanel;
    const screws = clips; // 1 screw per clip
    const rollPlugs = clips; // 1 roll plug per clip
    
    const ledStripFeet = values.ledStripLength || 0;
    const ledStripMeters = parseFloat((ledStripFeet / 3.281).toFixed(2));

    const panelsCost = panelsNeeded * (values.panelPrice || 0);
    const clipsCost = clips * (values.clipPrice || 0);
    const ledStripCost = ledStripMeters * (values.ledStripPricePerMeter || 0);
    
    const otherItems = values.otherItems || [];
    const otherItemsTotalCost = otherItems.reduce((total, item) => total + (item.quantity * item.price), 0);

    const totalCost = panelsCost + clipsCost + ledStripCost + otherItemsTotalCost;
    
    const results: WallDesignerCalculationResults = {
      wallWidth,
      wallHeight,
      panelType,
      panelColor: values.panelColor,
      panelsNeeded,
      clips,
      screws,
      rollPlugs,
      ledStripMeters,
      otherItems,
      otherItemsTotalCost,
      totalCost,
      panelsCost,
      clipsCost,
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
      panelType: undefined,
      panelPrice: 0,
      clipsPerPanel: 3,
      clipPrice: 0,
      ledStripLength: 0,
      ledStripPricePerMeter: 0,
      panelColor: 'white-gold',
      otherItems: [],
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
                <FormField control={control} name="panelPrice" render={({ field }) => (<FormItem><FormLabel>Price per Panel</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                <FormField
                  control={control}
                  name="panelColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Panel Color</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="white-gold">White with Gold</SelectItem>
                          <SelectItem value="teak">Teak</SelectItem>
                          <SelectItem value="black-gold">Black with Gold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <AccordionTrigger>LED Lighting</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="ledStripLength" render={({ field }) => (<FormItem><FormLabel>LED Strip (ft)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  <FormField control={control} name="ledStripPricePerMeter" render={({ field }) => (<FormItem><FormLabel>Price/Meter</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Other Items</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_auto_auto_auto] items-end gap-2 p-2 border rounded-md">
                      <FormField
                        control={control}
                        name={`otherItems.${index}.name`}
                        render={({ field }) => (
                           <FormItem>
                            <FormLabel className={index !== 0 ? "sr-only" : ""}>Item Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. Wall Sticker" />
                            </FormControl>
                            <FormMessage />
                           </FormItem>
                        )}
                      />
                       <FormField
                        control={control}
                        name={`otherItems.${index}.quantity`}
                        render={({ field }) => (
                           <FormItem>
                            <FormLabel className={index !== 0 ? "sr-only" : ""}>Qty</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} placeholder="1" className="w-20" />
                            </FormControl>
                             <FormMessage />
                           </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`otherItems.${index}.price`}
                        render={({ field }) => (
                           <FormItem>
                            <FormLabel className={index !== 0 ? "sr-only" : ""}>Price/Item</FormLabel>
                            <FormControl>
                               <Input type="number" {...field} step="0.01" placeholder="1500.00" className="w-28" />
                            </FormControl>
                             <FormMessage />
                           </FormItem>
                        )}
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "", quantity: 1, price: 0 })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
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
