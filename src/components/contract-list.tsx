
import type { ServiceContract } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { differenceInDays, parseISO, format } from 'date-fns';
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Separator } from "./ui/separator";

type ContractListProps = {
  contracts: ServiceContract[];
  onAddContract: () => void;
  onEditContract: (contract: ServiceContract) => void;
  onDeleteContract: (contractId: string) => void;
}

export function ContractList({ contracts, onAddContract, onEditContract, onDeleteContract }: ContractListProps) {

  const getStatus = (endDate?: string, renewalDate?: string) => {
    if (!endDate || !renewalDate) return null;
    
    const today = new Date();
    const end = parseISO(endDate);
    const renewal = parseISO(renewalDate);

    if (end < today) return <Badge variant="destructive">Expired</Badge>;
    if (differenceInDays(renewal, today) <= 30) return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Renews Soon</Badge>;
    return <Badge variant="default">Active</Badge>;
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  }

  const sortedContracts = [...contracts].sort((a, b) => {
    if (!a.startDate || !b.startDate) return 0;
    return parseISO(b.startDate).getTime() - parseISO(a.startDate).getTime();
  });

  const InfoField = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || 'N/A'}</p>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Service Contracts</CardTitle>
            <CardDescription>Manage service contracts associated with this equipment.</CardDescription>
          </div>
          <Button onClick={onAddContract}><Plus className="mr-2 h-4 w-4" /> Add Contract</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedContracts.length > 0 ? sortedContracts.map(contract => (
          <Card key={contract.id} className="bg-muted/30">
            <CardHeader className="flex-row justify-between items-start">
              <div>
                <CardTitle className="text-lg">{contract.provider || 'N/A'}</CardTitle>
                <div className="flex items-center gap-4 text-sm mt-1">
                  {getStatus(contract.endDate, contract.renewalDate)}
                </div>
              </div>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onEditContract(contract)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the service contract.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteContract(contract.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <InfoField label="Service Vendor" value={contract.provider} />
                  <InfoField label="Vendor POC" value={contract.vendorPoc} />
                  <InfoField label="Start Date" value={formatDate(contract.startDate)} />
                  <InfoField label="End Date" value={formatDate(contract.endDate)} />
                  <InfoField label="Renewal Date" value={formatDate(contract.renewalDate)} />
                  <InfoField label="Annual Cost" value={contract.annualCost ? `$${contract.annualCost.toLocaleString()}`: 'N/A'} />
                  <InfoField label="Credit Unused Coverage" value={contract.creditUnusedCoverage ? 'Yes' : 'No'} />
               </div>
               <Separator />
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <InfoField label="PO #" value={contract.poNumber} />
                  <InfoField label="PO Line #" value={contract.poLineNumber} />
                  <InfoField label="PO Start Date" value={formatDate(contract.poStartDate)} />
                  <InfoField label="PO End Date" value={formatDate(contract.poEndDate)} />
               </div>
               <Separator />
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <InfoField label="# of PMs" value={contract.numberOfPreventativeMaintenance} />
                  <InfoField label="PM Done Date" value={formatDate(contract.preventativeMaintenanceDoneDate)} />
                  <InfoField label="PM Due Date" value={formatDate(contract.preventativeMaintenanceDueDate)} />
               </div>
               <Separator />
               <div>
                  <h4 className="font-medium mb-2">Terms & Conditions</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contract.terms || 'No terms specified.'}</p>
               </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center h-24 flex items-center justify-center">
              <p>No contracts available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
