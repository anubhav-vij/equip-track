import type { Document } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Download, FileText, Shield, FileQuestion, FileArchive } from "lucide-react";
import { Badge } from "./ui/badge";
import { format, parseISO } from "date-fns";

export function DocumentList({ documents }: { documents: Document[] }) {
    
  const getIcon = (type: Document['type']) => {
    switch(type) {
        case 'Manual': return <FileText className="h-5 w-5 text-muted-foreground" />;
        case 'Warranty': return <Shield className="h-5 w-5 text-muted-foreground" />;
        case 'Invoice': return <FileArchive className="h-5 w-5 text-muted-foreground" />;
        case 'Other': return <FileQuestion className="h-5 w-5 text-muted-foreground" />;
    }
  }
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'PPP');
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Manuals, warranties, invoices, and other related documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length > 0 ? documents.map(doc => (
              <TableRow key={doc.id}>
                <TableCell>
                    <div className="flex items-center gap-2">
                        {getIcon(doc.type)}
                        <span className="hidden sm:inline">{doc.type}</span>
                    </div>
                </TableCell>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={doc.url} download>
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">No documents available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
