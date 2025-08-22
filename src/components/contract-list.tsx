import type { ServiceContract } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

type ContractListProps = {
  contracts: ServiceContract[];
  onAddContract: () => void;
  onEditContract: (contract: ServiceContract) => void;
  onDeleteContract: (contractId: string) => void;
}

export function ContractList({ contracts, onAddContract, onEditContract, onDeleteContract }: ContractListProps) {

  const getStatus = (endDate: string, renewalDate: string) => {
    const today = new Date();
    const end = parseISO(endDate);
    const renewal = parseISO(renewalDate);

    if (end < today) return <Badge variant="destructive">Expired</Badge>;
    if (differenceInDays(renewal, today) <= 30) return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Renews Soon</Badge>;
    return <Badge variant="default">Active</Badge>;
  }
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'PPP');
  }

  const sortedContracts = [...contracts].sort((a, b) => {
    return parseISO(b.startDate).getTime() - parseISO(a.startDate).getTime();
  });


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Service Contracts</CardTitle>
            <CardDescription>Manage service contracts associated with this equipment.</CardDescription>
          </div>
          <Button onClick={onAddContract}><Plus className="mr-2 h-4 w-4" /> Add Contract</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Renewal Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedContracts.length > 0 ? sortedContracts.map(contract => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.provider}</TableCell>
                <TableCell>{formatDate(contract.startDate)}</TableCell>
                <TableCell>{formatDate(contract.endDate)}</TableCell>
                <TableCell>{formatDate(contract.renewalDate)}</TableCell>
                <TableCell>{getStatus(contract.endDate, contract.renewalDate)}</TableCell>
                <TableCell className="text-right">
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
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">No contracts available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
