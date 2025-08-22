import Image from "next/image";
import {
  Calendar, Info, Wrench, FileText, Cpu, BrainCircuit, HardDrive, ShieldCheck
} from 'lucide-react';
import type { Equipment } from "@/lib/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MaintenanceSuggester } from "./maintenance-suggester";
import { ServiceLogs } from "./service-logs";
import { DocumentList } from './document-list';
import { ContractList } from './contract-list';
import { SoftwareList } from './software-list';
import { cn } from "@/lib/utils";

export function EquipmentDetails({ equipment }: { equipment: Equipment }) {
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
  }

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
            <div>
                <h2 className="text-lg font-bold">{equipment.name}</h2>
                <p className="text-sm text-muted-foreground">{equipment.model}</p>
            </div>
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
                            </CardHeader>
                            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                                <div className="flex items-start gap-3">
                                    <Info className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">Serial Number</p>
                                        <p className="font-medium">{equipment.serialNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">Purchase Date</p>
                                        <p className="font-medium">{new Date(equipment.purchaseDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="h-5 w-5 mt-1 text-primary" />
                                    <div>
                                        <p className="text-muted-foreground">Warranty End Date</p>
                                        <p className="font-medium">{new Date(equipment.warrantyEndDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contracts">
                        <ContractList contracts={equipment.contracts} />
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
