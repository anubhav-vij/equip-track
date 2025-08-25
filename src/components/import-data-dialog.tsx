
"use client";

import { useState } from "react";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Equipment } from "@/lib/types";
import { equipmentData } from "@/lib/data";

type ImportDataDialogProps = {
  onImport: (data: Equipment[]) => void;
};

export function ImportDataDialog({ onImport }: ImportDataDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleJsonImport = (reader: FileReader) => {
     try {
        const result = reader.result;
        if (typeof result === 'string') {
          const data = JSON.parse(result);
          // Basic validation
          if (Array.isArray(data) && data.every(item => item.id && item.name)) {
            onImport(data);
            toast({
              title: "Import Successful",
              description: `${data.length} equipment items have been loaded.`,
            });
          } else {
            throw new Error("Invalid JSON structure.");
          }
        }
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "The selected file is not a valid JSON file or has an incorrect structure.",
        });
      }
  }
  
  const handleExcelImport = (reader: FileReader) => {
    try {
        const result = reader.result;
        const workbook = XLSX.read(result, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Data type conversion and validation
        const typedData = data.map((row: any) => ({
            ...equipmentData[0], // ensure all keys are present
            ...row,
            id: row.id?.toString(),
            transferred: Boolean(row.transferred),
            onNetwork: Boolean(row.onNetwork),
            hasServiceContract: Boolean(row.hasServiceContract),
            contracts: typeof row.contracts === 'string' ? JSON.parse(row.contracts) : [],
            documents: typeof row.documents === 'string' ? JSON.parse(row.documents) : [],
            software: typeof row.software === 'string' ? JSON.parse(row.software) : [],
            serviceLogs: typeof row.serviceLogs === 'string' ? JSON.parse(row.serviceLogs) : [],
        }));
        
        if (Array.isArray(typedData) && typedData.every(item => item.id && item.name)) {
            onImport(typedData as Equipment[]);
            toast({
              title: "Import Successful",
              description: `${typedData.length} equipment items have been loaded from the Excel file.`,
            });
        } else {
            throw new Error("Invalid Excel data structure.");
        }

    } catch (error) {
        console.error("Failed to parse Excel file:", error);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "The selected Excel file could not be parsed or has an incorrect structure. Ensure columns match the data format.",
        });
    }
  }

  const handleImport = () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to import.",
      });
      return;
    }

    const reader = new FileReader();
    
    if (file.name.endsWith('.json')) {
        reader.onload = () => handleJsonImport(reader);
        reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.onload = () => handleExcelImport(reader);
        reader.readAsArrayBuffer(file);
    } else {
        toast({
            variant: "destructive",
            title: "Unsupported File Type",
            description: "Please select a JSON or Excel (.xlsx, .xls) file.",
        });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="import-file">Select File</Label>
        <Input id="import-file" type="file" accept=".json, .xlsx, .xls" onChange={handleFileChange} />
        <p className="text-sm text-muted-foreground">
          Upload a JSON or Excel file. For Excel, ensure column headers match equipment attributes.
        </p>
      </div>
      <Button onClick={handleImport} disabled={!file} className="w-full">
        Import Data
      </Button>
    </div>
  );
}
