
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { Software } from '@/lib/types';


const formSchema = z.object({
  name: z.string().min(1, { message: "Software name is required." }),
  version: z.string().min(1, { message: "Version is required." }),
  licenseKey: z.string().min(1, { message: "License key is required." }),
  installDate: z.date({ required_error: "Install date is required." }),
});

type AddSoftwareFormProps = {
  onFormSubmit: (data: Omit<Software, 'id'>) => void;
};

export function AddSoftwareForm({ onFormSubmit }: AddSoftwareFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      version: "",
      licenseKey: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onFormSubmit({
      ...values,
      installDate: format(values.installDate, 'yyyy-MM-dd'),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Software Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., GrabCAD Print" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1.57" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="licenseKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Key</FormLabel>
              <FormControl>
                <Input placeholder="e.g., LICENSE-GC-XYZ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="installDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Install Date</FormLabel>
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
        <Button type="submit" className="w-full">Add Software</Button>
      </form>
    </Form>
  );
}
