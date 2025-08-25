
"use client";

import { useState, useMemo } from 'react';
import { Blocks, PlusCircle, Search } from 'lucide-react';
import type { Equipment, ServiceContract, Document, Software, ServiceLog } from '@/lib/types';
import { equipmentData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddEquipmentForm } from '@/components/add-equipment-form';
import { EditEquipmentForm } from '@/components/edit-equipment-form';
import { EquipmentDetails } from '@/components/equipment-details';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddServiceContractForm } from '@/components/add-service-contract-form';
import { EditServiceContractForm } from '@/components/edit-service-contract-form';
import { Input } from '@/components/ui/input';
import { AddDocumentForm } from '@/components/add-document-form';
import { EditDocumentForm } from '@/components/edit-document-form';
import { AddSoftwareForm } from '@/components/add-software-form';
import { EditSoftwareForm } from '@/components/edit-software-form';
import { AddServiceLogForm } from '@/components/add-service-log-form';
import { EditServiceLogForm } from '@/components/edit-service-log-form';


export default function Home() {
  const [allEquipment, setAllEquipment] = useState<Equipment[]>(equipmentData);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(allEquipment[0] || null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const [isAddContractDialogOpen, setIsAddContractDialogOpen] = useState(false);
  const [isEditContractDialogOpen, setIsEditContractDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ServiceContract | null>(null);

  const [isAddDocumentDialogOpen, setIsAddDocumentDialogOpen] = useState(false);
  const [isEditDocumentDialogOpen, setIsEditDocumentDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  const [isAddSoftwareDialogOpen, setIsAddSoftwareDialogOpen] = useState(false);
  const [isEditSoftwareDialogOpen, setIsEditSoftwareDialogOpen] = useState(false);
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null);

  const [isAddLogDialogOpen, setIsAddLogDialogOpen] = useState(false);
  const [isEditLogDialogOpen, setIsEditLogDialogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<ServiceLog | null>(null);

  const filteredEquipment = useMemo(() => {
    if (!searchQuery) return allEquipment;
    return allEquipment.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allEquipment]);

  const handleAddEquipment = (newEquipmentData: Omit<Equipment, 'id' | 'contracts' | 'documents' | 'software' | 'serviceLogs'>) => {
    const newEquipment: Equipment = {
      ...newEquipmentData,
      id: `eq${Date.now()}`,
      contracts: [],
      documents: [],
      software: [],
      serviceLogs: [],
    };
    setAllEquipment(prev => [newEquipment, ...prev]);
    setSelectedEquipment(newEquipment);
    setIsAddDialogOpen(false);
    if (newEquipment.hasServiceContract) {
      setIsAddContractDialogOpen(true);
    }
  };
  
  const handleEditEquipment = (updatedEquipmentData: Equipment) => {
    setAllEquipment(prev => prev.map(e => e.id === updatedEquipmentData.id ? updatedEquipmentData : e));
    setSelectedEquipment(updatedEquipmentData);
    setIsEditDialogOpen(false);
    setEditingEquipment(null);
    if (updatedEquipmentData.hasServiceContract && updatedEquipmentData.contracts.length === 0) {
      setIsAddContractDialogOpen(true);
    }
  };

  const openEditDialog = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setIsEditDialogOpen(true);
  };
  
  const handleSelectChange = (equipmentId: string) => {
    const equipment = allEquipment.find(e => e.id === equipmentId);
    setSelectedEquipment(equipment || null);
  }

  // --- Contract Handlers ---
  const handleAddContract = (newContractData: Omit<ServiceContract, 'id'>) => {
    if (!selectedEquipment) return;
    const newContract: ServiceContract = {
      ...newContractData,
      id: `c${Date.now()}`
    }
    const updatedEquipment = {
      ...selectedEquipment,
      contracts: [...selectedEquipment.contracts, newContract],
    };
    handleEditEquipment(updatedEquipment);
    setIsAddContractDialogOpen(false);
  }

  const handleEditContract = (updatedContractData: ServiceContract) => {
    if (!selectedEquipment) return;
    const updatedEquipment = {
      ...selectedEquipment,
      contracts: selectedEquipment.contracts.map(c => c.id === updatedContractData.id ? updatedContractData : c),
    };
    handleEditEquipment(updatedEquipment);
    setIsEditContractDialogOpen(false);
    setEditingContract(null);
  }

  const handleDeleteContract = (contractId: string) => {
    if (!selectedEquipment) return;
    const updatedEquipment = {
      ...selectedEquipment,
      contracts: selectedEquipment.contracts.filter(c => c.id !== contractId),
    };
    handleEditEquipment(updatedEquipment);
  }

  const openEditContractDialog = (contract: ServiceContract) => {
    setEditingContract(contract);
    setIsEditContractDialogOpen(true);
  }
  
  // --- Document Handlers ---
  const handleAddDocument = (newDocumentData: Omit<Document, 'id'>) => {
    if (!selectedEquipment) return;
    const newDocument: Document = { ...newDocumentData, id: `d${Date.now()}` };
    const updatedEquipment = { ...selectedEquipment, documents: [...selectedEquipment.documents, newDocument] };
    handleEditEquipment(updatedEquipment);
    setIsAddDocumentDialogOpen(false);
  };

  const handleEditDocument = (updatedDocument: Document) => {
    if (!selectedEquipment) return;
    const updatedEquipment = { ...selectedEquipment, documents: selectedEquipment.documents.map(d => d.id === updatedDocument.id ? updatedDocument : d) };
    handleEditEquipment(updatedEquipment);
    setIsEditDocumentDialogOpen(false);
    setEditingDocument(null);
  };

  const handleDeleteDocument = (documentId: string) => {
    if (!selectedEquipment) return;
    const updatedEquipment = { ...selectedEquipment, documents: selectedEquipment.documents.filter(d => d.id !== documentId) };
    handleEditEquipment(updatedEquipment);
  };

  const openEditDocumentDialog = (document: Document) => {
    setEditingDocument(document);
    setIsEditDocumentDialogOpen(true);
  };

  // --- Software Handlers ---
  const handleAddSoftware = (newSoftwareData: Omit<Software, 'id'>) => {
    if (!selectedEquipment) return;
    const newSoftware: Software = { ...newSoftwareData, id: `s${Date.now()}` };
    const updatedEquipment = { ...selectedEquipment, software: [...selectedEquipment.software, newSoftware] };
    handleEditEquipment(updatedEquipment);
    setIsAddSoftwareDialogOpen(false);
  };

  const handleEditSoftware = (updatedSoftware: Software) => {
    if (!selectedEquipment) return;
    const updatedEquipment = { ...selectedEquipment, software: selectedEquipment.software.map(s => s.id === updatedSoftware.id ? updatedSoftware : s) };
    handleEditEquipment(updatedEquipment);
    setIsEditSoftwareDialogOpen(false);
    setEditingSoftware(null);
  };

  const handleDeleteSoftware = (softwareId: string) => {
    if (!selectedEquipment) return;
    const updatedEquipment = { ...selectedEquipment, software: selectedEquipment.software.filter(s => s.id !== softwareId) };
    handleEditEquipment(updatedEquipment);
  };

  const openEditSoftwareDialog = (software: Software) => {
    setEditingSoftware(software);
    setIsEditSoftwareDialogOpen(true);
  };

  // --- Service Log Handlers ---
  const handleAddLog = (newLogData: Omit<ServiceLog, 'id'>) => {
    if (!selectedEquipment) return;
    const newLog: ServiceLog = { ...newLogData, id: `sl${Date.now()}` };
    const updatedEquipment = { ...selectedEquipment, serviceLogs: [newLog, ...selectedEquipment.serviceLogs] };
    handleEditEquipment(updatedEquipment);
    setIsAddLogDialogOpen(false);
  };

  const handleEditLog = (updatedLog: ServiceLog) => {
    if (!selectedEquipment) return;
    const updatedEquipment = { ...selectedEquipment, serviceLogs: selectedEquipment.serviceLogs.map(l => l.id === updatedLog.id ? updatedLog : l) };
    handleEditEquipment(updatedEquipment);
    setIsEditLogDialogOpen(false);
    setEditingLog(null);
  };

  const handleDeleteLog = (logId: string) => {
    if (!selectedEquipment) return;
    const updatedEquipment = { ...selectedEquipment, serviceLogs: selectedEquipment.serviceLogs.filter(l => l.id !== logId) };
    handleEditEquipment(updatedEquipment);
  };

  const openEditLogDialog = (log: ServiceLog) => {
    setEditingLog(log);
    setIsEditLogDialogOpen(true);
  };


  return (
    <div className="grid md:grid-cols-[280px_1fr] h-screen bg-background text-foreground">
      <div className="hidden md:flex flex-col bg-card border-r">
        <div className="p-4 flex items-center justify-between gap-2 border-b h-16 shrink-0">
          <div className="flex items-center gap-2">
            <Blocks className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">EquipTrack</h1>
          </div>
        </div>
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search equipment..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-2 flex flex-col gap-1">
            {filteredEquipment.map((item) => (
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
          <EquipmentDetails 
            equipment={selectedEquipment} 
            onEdit={openEditDialog} 
            onAddContract={() => setIsAddContractDialogOpen(true)}
            onEditContract={openEditContractDialog}
            onDeleteContract={handleDeleteContract}
            onAddDocument={() => setIsAddDocumentDialogOpen(true)}
            onEditDocument={openEditDocumentDialog}
            onDeleteDocument={handleDeleteDocument}
            onAddSoftware={() => setIsAddSoftwareDialogOpen(true)}
            onEditSoftware={openEditSoftwareDialog}
            onDeleteSoftware={handleDeleteSoftware}
            onAddLog={() => setIsAddLogDialogOpen(true)}
            onEditLog={openEditLogDialog}
            onDeleteLog={handleDeleteLog}
          />
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

        <Dialog open={isAddContractDialogOpen} onOpenChange={setIsAddContractDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Service Contract</DialogTitle>
            </DialogHeader>
            <AddServiceContractForm onFormSubmit={handleAddContract} />
          </DialogContent>
        </Dialog>

        {editingContract && (
          <Dialog open={isEditContractDialogOpen} onOpenChange={setIsEditContractDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Service Contract</DialogTitle>
              </DialogHeader>
              <EditServiceContractForm
                contract={editingContract}
                onFormSubmit={handleEditContract}
              />
            </DialogContent>
          </Dialog>
        )}
        
        <Dialog open={isAddDocumentDialogOpen} onOpenChange={setIsAddDocumentDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Document</DialogTitle>
                </DialogHeader>
                <AddDocumentForm onFormSubmit={handleAddDocument} />
            </DialogContent>
        </Dialog>
        
        {editingDocument && (
            <Dialog open={isEditDocumentDialogOpen} onOpenChange={setIsEditDocumentDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Document</DialogTitle>
                    </DialogHeader>
                    <EditDocumentForm document={editingDocument} onFormSubmit={handleEditDocument} />
                </DialogContent>
            </Dialog>
        )}

        <Dialog open={isAddSoftwareDialogOpen} onOpenChange={setIsAddSoftwareDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Software</DialogTitle>
                </DialogHeader>
                <AddSoftwareForm onFormSubmit={handleAddSoftware} />
            </DialogContent>
        </Dialog>

        {editingSoftware && (
            <Dialog open={isEditSoftwareDialogOpen} onOpenChange={setIsEditSoftwareDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Software</DialogTitle>
                    </DialogHeader>
                    <EditSoftwareForm software={editingSoftware} onFormSubmit={handleEditSoftware} />
                </DialogContent>
            </Dialog>
        )}

        <Dialog open={isAddLogDialogOpen} onOpenChange={setIsAddLogDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Service Log</DialogTitle>
                </DialogHeader>
                <AddServiceLogForm onFormSubmit={handleAddLog} />
            </DialogContent>
        </Dialog>

        {editingLog && (
            <Dialog open={isEditLogDialogOpen} onOpenChange={setIsEditLogDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Service Log</DialogTitle>
                    </DialogHeader>
                    <EditServiceLogForm log={editingLog} onFormSubmit={handleEditLog} />
                </DialogContent>
            </Dialog>
        )}

      </main>
    </div>
  );
}
