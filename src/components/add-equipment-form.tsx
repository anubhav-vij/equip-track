
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
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
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';


const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  model: z.string().min(2, { message: "Model must be at least 2 characters." }),
  serialNumber: z.string().min(1, { message: "Serial number is required." }),
  purchaseDate: z.date({ required_error: "Purchase date is required." }),
  warrantyEndDate: z.date({ required_error: "Warranty end date is required." }),
  status: z.enum(['Active', 'In-Repair', 'Decommissioned', 'Out of Service']),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  room: z.string().min(1, { message: "Room is required." }),
  department: z.string().min(1, { message: "Department is required." }),
  manufacturer: z.string().min(1, { message: "Manufacturer is required." }),
  nciNumber: z.string().min(1, { message: "NCI number is required." }),
  nihNumber: z.string().min(1, { message: "NIH number is required." }),
  vppNumber: z.string().optional(),
  transferred: z.boolean().default(false),
  poc: z.string().min(1, { message: "Point of Contact is required." }),
  notes: z.string().min(1, { message: "Notes are required." }),
  purchasingAmbisPoNumber: z.string().min(1, { message: "Purchasing AMBIS#/PO# is required." }),
  installedDate: z.date({ required_error: "Installed date is required." }),
  node: z.string().optional(),
  probe: z.string().optional(),
  ups: z.string().optional(),
  onNetwork: z.enum(['true', 'false'], { required_error: 'You must select whether the equipment is on the network.' }).transform(value => value === 'true'),
  computerAssociated: z.string().optional(),
  hasServiceContract: z.enum(['true', 'false'], { required_error: 'You must select whether the equipment has a service contract.' }).transform(value => value === 'true'),
}).refine(data => {
  if (data.onNetwork && !data.computerAssociated) {
    return false;
  }
  return true;
}, {
  message: "Computer/IP is required when On Network is checked.",
  path: ["computerAssociated"],
});

type AddEquipmentFormProps = {
  onFormSubmit: (data: Omit<Equipment, 'id' | 'contracts' | 'documents' | 'software' | 'serviceLogs'>) => void;
};

export function AddEquipmentForm({ onFormSubmit }: AddEquipmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      model: "",
      serialNumber: "",
      status: "Active",
      imageUrl: "",
      room: "",
      department: "",
      manufacturer: "",
      nciNumber: "",
      nihNumber: "",
      vppNumber: "",
      transferred: false,
      poc: "",
      notes: "",
      purchasingAmbisPoNumber: "",
      node: "",
      probe: "",
      ups: "",
      computerAssociated: "",
    },
  });

  const onNetwork = form.watch("onNetwork");

  function onSubmit(values: z.infer<typeof formSchema>) {
    onFormSubmit({
      ...values,
      purchaseDate: format(values.purchaseDate, 'yyyy-MM-dd'),
      warrantyEndDate: format(values.warrantyEndDate, 'yyyy-MM-dd'),
      installedDate: format(values.installedDate, 'yyyy-MM-dd'),
      imageUrl: values.imageUrl || 'https://placehold.co/100x100.png',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Name (Description)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., CNC Machine" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Haas" {...field} />
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
                  <Input placeholder="e.g., VF-2" {...field} />
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
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Manufacturing" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., C-205" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nciNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NCI#</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., NCI-00124" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nihNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIH#</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., NIH-98766" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="vppNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VPP#</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., VPP-123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="poc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Point of Contact</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Miller" {...field} />
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
                    <SelectItem value="Out of Service">Out of Service</SelectItem>
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
            name="installedDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Installed Date</FormLabel>
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
            name="purchasingAmbisPoNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchasing AMBIS#/PO#</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., PO-12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="node"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Node</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., N-123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="probe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Probe</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., P-456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="ups"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPS</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., UPS-789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transferred"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Transferred</FormLabel>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="hasServiceContract"
            render={({ field }) => (
              <FormItem className="space-y-3 rounded-lg border p-3 shadow-sm">
                <FormLabel>Service Contract?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="onNetwork"
            render={({ field }) => (
              <FormItem className="space-y-3 rounded-lg border p-3 shadow-sm">
                <FormLabel>On Network?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {onNetwork && (
            <FormField
              control={form.control}
              name="computerAssociated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Computer Associated (IP/MAC)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 192.168.1.100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any relevant notes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <Button type="submit" className="w-full">Add Equipment</Button>
      </form>
    </Form>
  );
}
