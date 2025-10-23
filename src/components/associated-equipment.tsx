
"use client";

import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import type { PropertyTag } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type AssociatedEquipmentProps = {
  propertyTags: PropertyTag[];
  onAddPropertyTag: (tag: Omit<PropertyTag, 'id'>) => void;
  onDeletePropertyTag: (tagId: string) => void;
  onTagClick: (tagValue: string) => void;
};

const formSchema = z.object({
  type: z.enum(['NCI', 'NIH', 'VPP']),
  value: z.string().min(1, 'Value is required'),
});

export function AssociatedEquipment({
  propertyTags,
  onAddPropertyTag,
  onDeletePropertyTag,
  onTagClick,
}: AssociatedEquipmentProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'NCI',
      value: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAddPropertyTag(values);
    form.reset();
  };

  const nciTags = propertyTags.filter((tag) => tag.type === 'NCI');
  const nihTags = propertyTags.filter((tag) => tag.type === 'NIH');
  const vppTags = propertyTags.filter((tag) => tag.type === 'VPP');

  const renderTagTable = (title: string, tags: PropertyTag[]) => (
    <div>
      <h4 className="font-medium text-lg mb-2">{title}</h4>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Value</TableHead>
              <TableHead className="text-right w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto" onClick={() => onTagClick(tag.value)}>
                      {tag.value}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this property tag.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeletePropertyTag(tag.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No tags for this type.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Associated Equipment</CardTitle>
        <CardDescription>
          Manage associated property tags for NCI, NIH, and VPP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Property Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid sm:grid-cols-3 gap-4 items-start"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NCI">NCI</SelectItem>
                          <SelectItem value="NIH">NIH</SelectItem>
                          <SelectItem value="VPP">VPP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., NCI-00123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-8">
                    <Button type="submit" className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Add Tag
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {renderTagTable('NCI Tags', nciTags)}
          {renderTagTable('NIH Tags', nihTags)}
          {renderTagTable('VPP Tags', vppTags)}
        </div>
      </CardContent>
    </Card>
  );
}
