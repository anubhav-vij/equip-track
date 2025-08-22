"use client";

import { useState } from 'react';
import { Blocks, PlusCircle } from 'lucide-react';
import type { Equipment } from '@/lib/types';
import { equipmentData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddEquipmentForm } from '@/components/add-equipment-form';
import { EditEquipmentForm } from '@/components/edit-equipment-form';
import { EquipmentDetails } from '@/components/equipment-details';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Home() {
  const [allEquipment, setAllEquipment] = useState<Equipment[]>(equipmentData);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(allEquipment[0] || null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const handleAddEquipment = (newEquipmentData: Omit<Equipment, 'id' | 'contracts' | 'documents' | 'software' | 'serviceLogs'>) => {
    const newEquipment: Equipment = {
      ...newEquipmentData,
      id: (allEquipment.length + 1).toString(),
      contracts: [],
      documents: [],
      software: [],
      serviceLogs: [],
    };
    setAllEquipment(prev => [newEquipment, ...prev]);
    setSelectedEquipment(newEquipment);
    setIsAddDialogOpen(false);
  };
  
  const handleEditEquipment = (updatedEquipmentData: Equipment) => {
    setAllEquipment(prev => prev.map(e => e.id === updatedEquipmentData.id ? updatedEquipmentData : e));
    setSelectedEquipment(updatedEquipmentData);
    setIsEditDialogOpen(false);
    setEditingEquipment(null);
  };

  const openEditDialog = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setIsEditDialogOpen(true);
  };
  
  const handleSelectChange = (equipmentId: string) => {
    const equipment = allEquipment.find(e => e.id === equipmentId);
    setSelectedEquipment(equipment || null);
  }

  return (
    <div className="grid md:grid-cols-[280px_1fr] h-screen bg-background text-foreground">
      <div className="hidden md:flex flex-col bg-card border-r">
        <div className="p-4 flex items-center gap-2 border-b h-16 shrink-0">
          <Blocks className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">EquipTrack</h1>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-2 flex flex-col gap-1">
            {allEquipment.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedEquipment(item)}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg p-3 text-left transition-all hover:bg-accent/80",
                  selectedEquipment?.id === item.id ? "bg-accent text-accent-foreground" : "text-card-foreground hover:text-accent-foreground",
                )}
              >
                <p className="font-semibold truncate text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground truncate">{item.model}</p>
              </button>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t shrink-0">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
             <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Equipment</DialogTitle>
                </DialogHeader>
                <AddEquipmentForm onFormSubmit={handleAddEquipment} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <main className="flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-2 border-b h-16">
           <div className="flex items-center gap-2">
             <Blocks className="h-6 w-6 text-primary" />
             <h1 className="text-lg font-bold">EquipTrack</h1>
           </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
               <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Equipment</DialogTitle>
                  </DialogHeader>
                  <AddEquipmentForm onFormSubmit={handleAddEquipment} />
              </DialogContent>
            </Dialog>
        </header>
        
        <div className="md:hidden p-2 border-b">
          <Select onValueChange={handleSelectChange} value={selectedEquipment?.id}>
            <SelectTrigger>
              <SelectValue placeholder="Select equipment..." />
            </SelectTrigger>
            <SelectContent>
              {allEquipment.map(item => (
                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEquipment ? (
          <EquipmentDetails equipment={selectedEquipment} onEdit={openEditDialog} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <h2 className="text-2xl font-semibold text-muted-foreground">Welcome to EquipTrack</h2>
              <p className="mt-2 text-muted-foreground">Select an equipment from the list or add a new one.</p>
            </div>
          </div>
        )}
        
        {editingEquipment && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
             <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Equipment</DialogTitle>
                </DialogHeader>
                <EditEquipmentForm 
                  equipment={editingEquipment}
                  onFormSubmit={handleEditEquipment} 
                />
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}
