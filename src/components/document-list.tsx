
import type { Document } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Download, FileText, Shield, FileQuestion, FileArchive, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { format, parseISO } from "date-fns";
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

type DocumentListProps = {
  documents: Document[];
  onAddDocument: () => void;
  onEditDocument: (doc: Document) => void;
  onDeleteDocument: (docId: string) => void;
}


export function DocumentList({ documents, onAddDocument, onEditDocument, onDeleteDocument }: DocumentListProps) {
    
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Manuals, warranties, invoices, and other related documents.</CardDescription>
        </div>
        <Button onClick={onAddDocument}><Plus className="mr-2 h-4 w-4" /> Add Document</Button>
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
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onEditDocument(doc)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(doc.url, '_blank')}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
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
                                  This action cannot be undone. This will permanently delete the document.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteDocument(doc.id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </DropdownMenuContent>
                  </DropdownMenu>
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
