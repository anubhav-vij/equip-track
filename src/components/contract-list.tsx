import type { ServiceContract } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { differenceInDays, parseISO } from 'date-fns';

export function ContractList({ contracts }: { contracts: ServiceContract[] }) {

  const getStatus = (endDate: string, renewalDate: string) => {
    const today = new Date();
    const end = parseISO(endDate);
    const renewal = parseISO(renewalDate);

    if (end < today) return <Badge variant="destructive">Expired</Badge>;
    if (differenceInDays(renewal, today) <= 30) return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Renews Soon</Badge>;
    return <Badge variant="default">Active</Badge>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Contracts</CardTitle>
        <CardDescription>Manage service contracts associated with this equipment.</CardDescription>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length > 0 ? contracts.map(contract => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.provider}</TableCell>
                <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(contract.renewalDate).toLocaleDateString()}</TableCell>
                <TableCell>{getStatus(contract.endDate, contract.renewalDate)}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">No contracts available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
