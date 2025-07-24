'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculationResults } from "@/types";

const formSchema = z.object({
  length: z.coerce.number().positive({ message: "Length must be a positive number." }).min(1),
  width: z.coerce.number().positive({ message: "Width must be a positive number." }).min(1),
});

type CalculatorFormProps = {
  onCalculate: (results: CalculationResults) => void;
  onReset: () => void;
};

export default function CalculatorForm({ onCalculate, onReset }: CalculatorFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: 12,
      width: 12,
    },
  });

  const { handleSubmit, control, reset, getValues } = form;

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { length, width } = values;
    const area = length * width;
    const perimeter = 2 * (length + width);

    const L = Math.max(length, width);
    const W = Math.min(length, width);
    
    const mainTeeRows = Math.floor((W - 0.1) / 2);
    const mainTeeTotalLength = mainTeeRows * L;
    
    const results: CalculationResults = {
      panels: Math.ceil((area / 4) * 1.1),
      crossTees: Math.ceil((area / 4) * 1.1),
      mainTees: Math.ceil(mainTeeTotalLength / 12),
      wallAngles: Math.ceil(perimeter / 10),
      binding: Math.ceil(area / 200) * 500,
      nails: Math.ceil(area / 200) * 50,
    };
    onCalculate(results);
  }
  
  const handleResetClick = () => {
    reset({ length: 0, width: 0 });
    onReset();
  }
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Room Dimensions</CardTitle>
        <CardDescription>Enter the length and width of your room in feet.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (ft)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 12" {...field} step="0.1" />
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
                    <Input type="number" placeholder="e.g. 12" {...field} step="0.1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="flex-1">Calculate</Button>
              <Button type="button" variant="secondary" onClick={handleResetClick} className="flex-1">Reset</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
