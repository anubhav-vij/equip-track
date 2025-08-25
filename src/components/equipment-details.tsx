import Image from "next/image";
import {
  Calendar, Info, Wrench, FileText, Cpu, BrainCircuit, HardDrive, ShieldCheck, Pencil, Building, Warehouse, Hash, Contact, StickyNote, CheckCircle, XCircle
} from 'lucide-react';
import type { Equipment, ServiceContract } from "@/lib/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MaintenanceSuggester } from "./maintenance-suggester";
import { ServiceLogs } from "./service-logs";
import { DocumentList } from './document-list';
import { ContractList } from './contract-list';
import { SoftwareList } from './software-list';
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

type EquipmentDetailsProps = {
  equipment: Equipment;
  onEdit: (equipment: Equipment) => void;
  onAddContract: () => void;
  onEditContract: (contract: ServiceContract) => void;
  onDeleteContract: (contractId: string) => void;
};

export function EquipmentDetails({ equipment, onEdit, onAddContract, onEditContract, onDeleteContract }: EquipmentDetailsProps) {
  const getStatusBadgeVariant = (status: Equipment['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'In-Repair':
        return 'destructive';
      case 'Decommissioned':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColorClass = (status: Equipment['status']) => {
     switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'In-Repair':
        return 'bg-yellow-500';
      case 'Decommissioned':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        return format(parseISO(dateString), 'PPP');
    } catch (error) {
        return dateString;
    }
  };

  return (
    <div className="flex flex-col h-full">
        <header className="flex items-center p-4 border-b h-16 gap-4 shrink-0">
            <div className="relative">
              <Image 
                src={equipment.imageUrl} 
                alt={equipment.name} 
                width={40} 
                height={40} 
                className="rounded-lg"
                data-ai-hint={equipment.name.toLowerCase().includes('printer') ? 'industrial printer' : equipment.name.toLowerCase().includes('milling') ? 'cnc machine' : 'lab equipment'}
              />
              <span className={cn("absolute -top-1 -right-1 block h-3 w-3 rounded-full", getStatusColorClass(equipment.status))} />
            </div>
            <div className="flex-1">
                <h2 className="text-lg font-bold">{equipment.name}</h2>
                <p className="text-sm text-muted-foreground">{equipment.model}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(equipment)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Badge variant={getStatusBadgeVariant(equipment.status)} className="ml-auto hidden sm:block">{equipment.status}</Badge>
        </header>

        <ScrollArea className="flex-1">
            <div className="p-4 md:p-6">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6">
                        <TabsTrigger value="overview"><Info className="mr-1.5 h-4 w-4" />Overview</TabsTrigger>
                        <TabsTrigger value="contracts"><HardDrive className="mr-1.5 h-4 w-4" />Contracts</TabsTrigger>
                        <TabsTrigger value="documents"><FileText className="mr-1.5 h-4 w-4" />Documents</TabsTrigger>
                        <TabsTrigger value="software"><Cpu className="mr-1.5 h-4 w-4" />Software</TabsTrigger>
                        <TabsTrigger value="service"><Wrench className="mr-1.5 h-4 w-4" />Service</TabsTrigger>
                        <TabsTrigger value="ai"><BrainCircuit className="mr-1.5 h-4 w-4" />AI</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <Card>
                            <CardHeader>
                                <CardTitle>Equipment Information</CardTitle>
                                <CardDescription>{equipment.name} - {equipment.manufacturer} {equipment.model}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-sm">
                                <div className="flex items-start gap-3">
                                    <Info className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">Serial Number</p>
                                        <p className="font-medium">{equipment.serialNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Building className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">Department</p>
                                        <p className="font-medium">{equipment.department}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Warehouse className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">Room</p>
                                        <p className="font-medium">{equipment.room}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Hash className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">NCI#</p>
                                        <p className="font-medium">{equipment.nciNumber}</p>
                                    </div>
                                </div>
                                 <div className="flex items-start gap-3">
                                    <Hash className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">NIH#</p>
                                        <p className="font-medium">{equipment.nihNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Contact className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">Point of Contact</p>
                                        <p className="font-medium">{equipment.poc}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">Purchase Date</p>
                                        <p className="font-medium">{formatDate(equipment.purchaseDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">Warranty End Date</p>
                                        <p className="font-medium">{formatDate(equipment.warrantyEndDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    {equipment.transferred ? <CheckCircle className="h-5 w-5 mt-1 text-green-600" /> : <XCircle className="h-5 w-5 mt-1 text-red-600" />}
                                    <div>
                                        <p className="text-muted-foreground">Transferred</p>
                                        <p className="font-medium">{equipment.transferred ? 'Yes' : 'No'}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardContent>
                                <div className="flex items-start gap-3">
                                    <StickyNote className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">Notes</p>
                                        <p className="font-medium whitespace-pre-wrap">{equipment.notes}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contracts">
                        <ContractList 
                          contracts={equipment.contracts} 
                          onAddContract={onAddContract}
                          onEditContract={onEditContract}
                          onDeleteContract={onDeleteContract}
                        />
                    </TabsContent>

                    <TabsContent value="documents">
                       <DocumentList documents={equipment.documents} />
                    </TabsContent>

                    <TabsContent value="software">
                       <SoftwareList software={equipment.software} />
                    </TabsContent>

                    <TabsContent value="service">
                       <ServiceLogs logs={equipment.serviceLogs} />
                    </TabsContent>

                    <TabsContent value="ai">
                        <MaintenanceSuggester equipment={equipment} />
                    </TabsContent>
                </Tabs>
            </div>
        </ScrollArea>
    </div>
  )
}
