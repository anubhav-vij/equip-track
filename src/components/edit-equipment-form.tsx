
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { Equipment } from '@/lib/types';


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  model: z.string().min(2, { message: "Model must be at least 2 characters." }),
  serialNumber: z.string().min(1, { message: "Serial number is required." }),
  purchaseDate: z.date({ required_error: "Purchase date is required." }),
  warrantyEndDate: z.date({ required_error: "Warranty end date is required." }),
  status: z.enum(['Active', 'In-Repair', 'Decommissioned']),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  operationalHours: z.coerce.number().min(0).optional(),
  failureRate: z.coerce.number().min(0).max(1).optional(),
});

type EditEquipmentFormProps = {
  equipment: Equipment;
  onFormSubmit: (data: Equipment) => void;
};

export function EditEquipmentForm({ equipment, onFormSubmit }: EditEquipmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...equipment,
      purchaseDate: parseISO(equipment.purchaseDate),
      warrantyEndDate: parseISO(equipment.warrantyEndDate),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onFormSubmit({
      ...equipment,
      ...values,
      purchaseDate: format(values.purchaseDate, 'yyyy-MM-dd'),
      warrantyEndDate: format(values.warrantyEndDate, 'yyyy-MM-dd'),
      imageUrl: values.imageUrl || 'https://placehold.co/100x100.png',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., CNC Machine" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Haas VF-2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., SN-12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="In-Repair">In-Repair</SelectItem>
                    <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Purchase Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="warrantyEndDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Warranty End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="operationalHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operational Hours</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 1500" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="failureRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Failure Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 0.05" step="0.01" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </Form>
  );
}
