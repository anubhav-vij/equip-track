
"use client";

import { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Blocks, PlusCircle, Search, Upload, Download } from 'lucide-react';
import type { Equipment, ServiceContract, Document, Software, ServiceLog, UserRole, PropertyTag } from '@/lib/types';
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
import { ImportDataDialog } from '@/components/import-data-dialog';
import { UserRoleSwitcher } from '@/components/user-role-switcher';
import { useToast } from '@/hooks/use-toast';


export default function Home() {
  const [allEquipment, setAllEquipment] = useState<Equipment[]>(equipmentData);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(allEquipment[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Equipment['status'] | 'all'>('all');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState('overview');

  const { toast } = useToast();

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
  
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const filteredEquipment = useMemo(() => {
    let equipment = allEquipment;

    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        equipment = equipment.filter(e => 
            e.name.toLowerCase().includes(lowercasedQuery) ||
            e.model.toLowerCase().includes(lowercasedQuery) ||
            e.serialNumber.toLowerCase().includes(lowercasedQuery) ||
            e.propertyTags.some(pt => pt.value.toLowerCase().includes(lowercasedQuery)) ||
            (e.reesNodeProbe && e.reesNodeProbe.toLowerCase().includes(lowercasedQuery)) ||
            (e.ups && e.ups.toLowerCase().includes(lowercasedQuery))
        );
    } else if (statusFilter !== 'all') {
      equipment = equipment.filter(e => e.status === statusFilter);
    }
    
    return equipment;
  }, [searchQuery, allEquipment, statusFilter]);

  useEffect(() => {
    if (filteredEquipment.length > 0) {
      const currentSelectionInFiltered = filteredEquipment.some(e => e.id === selectedEquipment?.id);
      if (!currentSelectionInFiltered) {
        setSelectedEquipment(filteredEquipment[0]);
        setActiveTab('overview');
      }
    } else {
      setSelectedEquipment(null);
    }
  }, [filteredEquipment, selectedEquipment]);

  const handleStatusFilterChange = (value: Equipment['status'] | 'all') => {
    setSearchQuery('');
    setStatusFilter(value);
    const newFilteredList = allEquipment.filter(e => value === 'all' || e.status === value);
    setSelectedEquipment(newFilteredList[0] || null);
    setActiveTab('overview');
  };

  const handleAddEquipment = (newEquipmentData: Omit<Equipment, 'id' | 'contracts' | 'documents' | 'software' | 'serviceLogs' | 'propertyTags'>) => {
    const newEquipment: Equipment = {
      ...newEquipmentData,
      id: `eq${Date.now()}`,
      contracts: [],
      documents: [],
      software: [],
      serviceLogs: [],
      propertyTags: [],
    };
    setAllEquipment(prev => [newEquipment, ...prev]);
    setSelectedEquipment(newEquipment);
    setActiveTab('overview');
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
    setActiveTab('overview');
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

  const updateCertificationDate = (logs: ServiceLog[]): string | undefined => {
    const latestCertification = logs
      .filter(log => log.type === 'Certification')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return latestCertification?.date;
  };

  // --- Service Log Handlers ---
  const handleAddLog = (newLogData: Omit<ServiceLog, 'id'>) => {
    if (!selectedEquipment) return;
    const newLog: ServiceLog = { ...newLogData, id: `sl${Date.now()}` };
    const updatedLogs = [newLog, ...selectedEquipment.serviceLogs];
    const updatedEquipment = { 
      ...selectedEquipment, 
      serviceLogs: updatedLogs,
      lastCertificationDate: updateCertificationDate(updatedLogs),
    };
    handleEditEquipment(updatedEquipment);
    setIsAddLogDialogOpen(false);
  };

  const handleEditLog = (updatedLog: ServiceLog) => {
    if (!selectedEquipment) return;
    const updatedLogs = selectedEquipment.serviceLogs.map(l => l.id === updatedLog.id ? updatedLog : l)
    const updatedEquipment = { 
      ...selectedEquipment, 
      serviceLogs: updatedLogs,
      lastCertificationDate: updateCertificationDate(updatedLogs),
    };
    handleEditEquipment(updatedEquipment);
    setIsEditLogDialogOpen(false);
    setEditingLog(null);
  };

  const handleDeleteLog = (logId: string) => {
    if (!selectedEquipment) return;
    const updatedLogs = selectedEquipment.serviceLogs.filter(l => l.id !== logId);
    const updatedEquipment = { 
      ...selectedEquipment, 
      serviceLogs: updatedLogs,
      lastCertificationDate: updateCertificationDate(updatedLogs),
    };
    handleEditEquipment(updatedEquipment);
  };

  const openEditLogDialog = (log: ServiceLog) => {
    setEditingLog(log);
    setIsEditLogDialogOpen(true);
  };
  
  const handleImportData = (data: Equipment[]) => {
    const processedData = data.map(eq => ({
      ...eq,
      lastCertificationDate: updateCertificationDate(eq.serviceLogs),
    }))
    setAllEquipment(processedData);
    setSelectedEquipment(processedData[0] || null);
    setActiveTab('overview');
    setIsImportDialogOpen(false);
  }

  const handleExportData = () => {
    const dataToExport = allEquipment.map(eq => {
      const { contracts, documents, software, serviceLogs, propertyTags, ...rest } = eq;
      return {
        ...rest,
        contracts: JSON.stringify(contracts),
        documents: JSON.stringify(documents),
        software: JSON.stringify(software),
        serviceLogs: JSON.stringify(serviceLogs),
        propertyTags: JSON.stringify(propertyTags),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment");
    XLSX.writeFile(workbook, "equipment_data.xlsx");
    toast({
      title: "Export Successful",
      description: "Equipment data has been downloaded.",
    });
  };

  // Property Tag handlers
  const handleAddPropertyTag = (newTag: Omit<PropertyTag, 'id'>) => {
    if (!selectedEquipment) return;
    const newPropertyTag: PropertyTag = { ...newTag, id: `pt${Date.now()}` };
    const updatedEquipment = {
      ...selectedEquipment,
      propertyTags: [...selectedEquipment.propertyTags, newPropertyTag],
    };
    handleEditEquipment(updatedEquipment);
  };

  const handleDeletePropertyTag = (tagId: string) => {
    if (!selectedEquipment) return;
    const updatedEquipment = {
      ...selectedEquipment,
      propertyTags: selectedEquipment.propertyTags.filter(pt => pt.id !== tagId),
    };
    handleEditEquipment(updatedEquipment);
  };
  
  const handleTagClick = (tagValue: string) => {
    const equipment = allEquipment.find(
      (e) => e.id !== selectedEquipment?.id && e.propertyTags.some((pt) => pt.value === tagValue)
    );
    if (equipment) {
      setSelectedEquipment(equipment);
      setActiveTab('overview');
    } else {
      const selfReferential = allEquipment.find(
        (e) => e.id === selectedEquipment?.id && e.propertyTags.some((pt) => pt.value === tagValue)
      );
      if(!selfReferential){
        toast({
            variant: "destructive",
            title: "Equipment not found",
            description: `No other equipment found with the property tag "${tagValue}".`
        });
      }
    }
  };


  return (
    <div className="grid md:grid-cols-[280px_1fr] h-screen bg-background text-foreground">
      <div className="hidden md:flex flex-col bg-card border-r">
        <div className="p-4 flex items-center justify-between gap-2 border-b h-16 shrink-0">
          <div className="flex items-center gap-2">
            <Blocks className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">EquipTrack</h1>
          </div>
          <div className='flex items-center gap-2'>
           {userRole === 'admin' && (
            <>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="icon">
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
              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Upload className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Equipment Data</DialogTitle>
                  </DialogHeader>
                  <ImportDataDialog onImport={handleImportData} />
                </DialogContent>
              </Dialog>
            </>
          )}
          <Button size="icon" variant="outline" onClick={handleExportData}>
            <Download className="h-5 w-5" />
          </Button>
          <UserRoleSwitcher role={userRole} setRole={setUserRole} />
          </div>
        </div>
        <div className="p-2 border-b space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search equipment..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
           <Select onValueChange={handleStatusFilterChange} value={statusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="In-Repair">In-Repair</SelectItem>
                <SelectItem value="Out of Service">Out of Service</SelectItem>
                <SelectItem value="Decommissioned">Decommissioned</SelectItem>
              </SelectContent>
            </Select>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-2 flex flex-col gap-1">
            {filteredEquipment.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedEquipment(item);
                  setActiveTab('overview');
                }}
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
      </div>
      <main className="flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-2 border-b h-16">
           <div className="flex items-center gap-2">
             <Blocks className="h-6 w-6 text-primary" />
             <h1 className="text-lg font-bold">EquipTrack</h1>
           </div>
           <div className='flex items-center gap-2'>
              <UserRoleSwitcher role={userRole} setRole={setUserRole} />
              {userRole === 'admin' && (
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
              )}
           </div>
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
            key={selectedEquipment.id}
            equipment={selectedEquipment}
            role={userRole}
            activeTab={activeTab}
            onTabChange={setActiveTab}
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
            onAddPropertyTag={handleAddPropertyTag}
            onDeletePropertyTag={handleDeletePropertyTag}
            onTagClick={handleTagClick}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <h2 className="text-2xl font-semibold text-muted-foreground">Welcome to EquipTrack</h2>
              <p className="mt-2 text-muted-foreground">Select an equipment from the list or add a new one.</p>
              {userRole === 'admin' && (
               <div className="mt-4 flex justify-center gap-2">
                 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                   <DialogTrigger asChild>
                     <Button>
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
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Import Equipment Data</DialogTitle>
                      </DialogHeader>
                      <ImportDataDialog onImport={handleImportData} />
                    </DialogContent>
                  </Dialog>
               </div>
              )}
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

      
