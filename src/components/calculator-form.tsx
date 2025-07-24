'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import type { CalculationResults } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const formSchema = z.object({
  length: z.coerce.number().positive({ message: "Length must be a positive number." }).min(1),
  width: z.coerce.number().positive({ message: "Width must be a positive number." }).min(1),
  
  panelPrice: z.coerce.number().min(0).optional(),
  crossTeePrice: z.coerce.number().min(0).optional(),
  mainTeePrice: z.coerce.number().min(0).optional(),
  wallAnglePrice: z.coerce.number().min(0).optional(),
  bindingPrice: z.coerce.number().min(0).optional(),
  nailPrice: z.coerce.number().min(0).optional(),
  
  ledBulbs: z.coerce.number().min(0).optional(),
  ledBulbPrice: z.coerce.number().min(0).optional(),
  decorativeBulbs: z.coerce.number().min(0).optional(),
  decorativeBulbPrice: z.coerce.number().min(0).optional(),
  rivets: z.coerce.number().min(0).optional(),
  rivetPrice: z.coerce.number().min(0).optional(),
  superNails: z.coerce.number().min(0).optional(),
  superNailPrice: z.coerce.number().min(0).optional(),
  silicone: z.coerce.number().min(0).optional(),
  siliconePrice: z.coerce.number().min(0).optional(),
  extra: z.coerce.number().min(0).optional(),
  extraPrice: z.coerce.number().min(0).optional(),
});

type CalculatorFormProps = {
  onCalculate: (results: CalculationResults | null) => void;
  onReset: () => void;
};

export default function CalculatorForm({ onCalculate, onReset }: CalculatorFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: 12,
      width: 12,
      panelPrice: 0,
      crossTeePrice: 0,
      mainTeePrice: 0,
      wallAnglePrice: 0,
      bindingPrice: 0,
      nailPrice: 0,
      ledBulbs: 0,
      ledBulbPrice: 0,
      decorativeBulbs: 0,
      decorativeBulbPrice: 0,
      rivets: 0,
      rivetPrice: 0,
      superNails: 0,
      superNailPrice: 0,
      silicone: 0,
      siliconePrice: 0,
      extra: 0,
      extraPrice: 0,
    },
  });

  const { handleSubmit, control, reset, watch, getValues } = form;

  const calculateMaterials = useCallback((values: z.infer<typeof formSchema>) => {
    const { length, width } = values;
    if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
      onCalculate(null);
      return;
    }
    const area = length * width;
    const perimeter = 2 * (length + width);

    const L = Math.max(length, width);
    const W = Math.min(length, width);
    
    const panels = Math.ceil(area / 4);
    const crossTees = Math.ceil(area / 4);
    const mainTeeRows = Math.floor((W - 0.1) / 2);
    const mainTeeTotalLength = mainTeeRows * L;
    const mainTees = Math.ceil(mainTeeTotalLength / 12);
    const wallAngles = Math.ceil(perimeter / 10);
    const bindingUnits = Math.ceil(area / 200);
    const binding = bindingUnits * 500;
    const nails = Math.ceil(area / 200) * 50;
    
    let totalCost = 0;
    totalCost += panels * (values.panelPrice || 0);
    totalCost += crossTees * (values.crossTeePrice || 0);
    totalCost += mainTees * (values.mainTeePrice || 0);
    totalCost += wallAngles * (values.wallAnglePrice || 0);
    totalCost += bindingUnits * (values.bindingPrice || 0);
    totalCost += nails * (values.nailPrice || 0);

    totalCost += (values.ledBulbs || 0) * (values.ledBulbPrice || 0);
    totalCost += (values.decorativeBulbs || 0) * (values.decorativeBulbPrice || 0);
    totalCost += (values.rivets || 0) * (values.rivetPrice || 0);
    totalCost += (values.superNails || 0) * (values.superNailPrice || 0);
    totalCost += (values.silicone || 0) * (values.siliconePrice || 0);
    totalCost += (values.extra || 0) * (values.extraPrice || 0);

    const results = {
      panels,
      crossTees,
      mainTees,
      wallAngles,
      binding,
      nails,
      ledBulbs: values.ledBulbs,
      decorativeBulbs: values.decorativeBulbs,
      rivets: values.rivets,
      superNails: values.superNails,
      silicone: values.silicone,
      extra: values.extra,
      totalCost,
    };
    onCalculate(results);
  }, [onCalculate]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      // Only recalculate if a relevant field changes
      if (name?.endsWith('Price') || name === 'length' || name === 'width' || name === 'ledBulbs' || name === 'decorativeBulbs' || name === 'rivets' || name === 'superNails' || name === 'silicone' || name === 'extra') {
         calculateMaterials(values as z.infer<typeof formSchema>);
      }
    });
    // Fire once on initial load
    calculateMaterials(getValues());
    
    return () => subscription.unsubscribe();
  }, [watch, calculateMaterials, getValues]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    calculateMaterials(values);
  }
  
  const handleResetClick = () => {
    reset({
      length: undefined,
      width: undefined,
      panelPrice: 0,
      crossTeePrice: 0,
      mainTeePrice: 0,
      wallAnglePrice: 0,
      bindingPrice: 0,
      nailPrice: 0,
      ledBulbs: 0,
      ledBulbPrice: 0,
      decorativeBulbs: 0,
      decorativeBulbPrice: 0,
      rivets: 0,
      rivetPrice: 0,
      superNails: 0,
      superNailPrice: 0,
      silicone: 0,
      siliconePrice: 0,
      extra: 0,
      extraPrice: 0,
    });
    onReset();
  }
  
  return (
    <Card className="shadow-lg">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Room Dimensions</CardTitle>
            <CardDescription>Enter the length and width of your room in feet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (ft)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 12" {...field} step="0.1" onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width (ft)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 12" {...field} step="0.1" onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <Accordion type="single" collapsible className="w-full px-6" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>Material Prices</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                 <FormField control={control} name="panelPrice" render={({ field }) => (<FormItem><FormLabel>Panel Price</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                 <FormField control={control} name="crossTeePrice" render={({ field }) => (<FormItem><FormLabel>Cross Tee Price</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                 <FormField control={control} name="mainTeePrice" render={({ field }) => (<FormItem><FormLabel>Main Tee Price</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                 <FormField control={control} name="wallAnglePrice" render={({ field }) => (<FormItem><FormLabel>Wall Angle Price</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                 <FormField control={control} name="bindingPrice" render={({ field }) => (<FormItem><FormLabel>Binding Wire Price (per 500g)</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                 <FormField control={control} name="nailPrice" render={({ field }) => (<FormItem><FormLabel>Nail Price (per nail)</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Optional Items</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="ledBulbs" render={({ field }) => (<FormItem><FormLabel>LED Bulbs (qty)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  <FormField control={control} name="ledBulbPrice" render={({ field }) => (<FormItem><FormLabel>Price/Bulb</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="decorativeBulbs" render={({ field }) => (<FormItem><FormLabel>Decorative Bulbs (qty)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  <FormField control={control} name="decorativeBulbPrice" render={({ field }) => (<FormItem><FormLabel>Price/Bulb</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="rivets" render={({ field }) => (<FormItem><FormLabel>Rivets (qty)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  <FormField control={control} name="rivetPrice" render={({ field }) => (<FormItem><FormLabel>Price/Rivet</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="superNails" render={({ field }) => (<FormItem><FormLabel>Super Nails (qty)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  <FormField control={control} name="superNailPrice" render={({ field }) => (<FormItem><FormLabel>Price/Nail</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="silicone" render={({ field }) => (<FormItem><FormLabel>Silicone (tubes)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  <FormField control={control} name="siliconePrice" render={({ field }) => (<FormItem><FormLabel>Price/Tube</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="extra" render={({ field }) => (<FormItem><FormLabel>Extra Item (qty)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                  <FormField control={control} name="extraPrice" render={({ field }) => (<FormItem><FormLabel>Price/Item</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl></FormItem>)} />
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
