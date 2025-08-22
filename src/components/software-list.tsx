import type { Software } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function SoftwareList({ software }: { software: Software[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Software Tracking</CardTitle>
        <CardDescription>Track software versions and licenses for this equipment.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>License Key</TableHead>
              <TableHead>Install Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {software.length > 0 ? software.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.version}</TableCell>
                <TableCell>{s.licenseKey}</TableCell>
                <TableCell>{new Date(s.installDate).toLocaleDateString()}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">No software tracked.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
