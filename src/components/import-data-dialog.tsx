
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Equipment } from "@/lib/types";

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

  const handleImport = () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a JSON file to import.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
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
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="json-file">Select JSON File</Label>
        <Input id="json-file" type="file" accept=".json" onChange={handleFileChange} />
        <p className="text-sm text-muted-foreground">
          Upload a JSON file containing an array of equipment objects.
        </p>
      </div>
      <Button onClick={handleImport} disabled={!file} className="w-full">
        Import Data
      </Button>
    </div>
  );
}
