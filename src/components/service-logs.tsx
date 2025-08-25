
"use client"
import { useState } from 'react';
import { Loader2, Sparkles, Plus, Wrench, Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { summarizeServiceReports, SummarizeServiceReportsOutput } from '@/ai/flows/summarize-service-reports';
import type { ServiceLog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
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

type ServiceLogsProps = {
  logs: ServiceLog[];
  onAddLog: () => void;
  onEditLog: (log: ServiceLog) => void;
  onDeleteLog: (logId: string) => void;
};

export function ServiceLogs({ logs, onAddLog, onEditLog, onDeleteLog }: ServiceLogsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummarizeServiceReportsOutput | null>(null);

  const handleSummarize = async () => {
    setLoading(true);
    setSummary(null);

    const reportsText = logs.map(log => 
      `Date: ${log.date}, Type: ${log.type}, Technician: ${log.technician}, Notes: ${log.notes}`
    ).join('\n\n');

    if (!reportsText) {
        toast({
            title: "No logs to summarize",
            description: "Please add service logs before summarizing."
        });
        setLoading(false);
        return;
    }

    try {
      const result = await summarizeServiceReports({ serviceReports: reportsText });
      setSummary(result);
    } catch (error) {
      console.error("Failed to summarize reports:", error);
      toast({
        variant: "destructive",
        title: "AI Summarization Failed",
        description: "There was an error summarizing the service logs. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBadgeVariant = (type: ServiceLog['type']) => {
    switch(type) {
      case 'Preventative': return 'default';
      case 'Repair': return 'destructive';
      case 'Inspection': return 'secondary';
      default: return 'outline';
    }
  }
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'PPP');
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Service & Maintenance Logs</CardTitle>
            <CardDescription>A record of all service and maintenance activities.</CardDescription>
        </div>
        <div className="flex gap-2">
             <Button variant="outline" onClick={handleSummarize} disabled={loading || logs.length === 0}>
                {loading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing...
                    </>
                ) : (
                    <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Summarize
                    </>
                )}
            </Button>
            <Button onClick={onAddLog}><Plus className="mr-2 h-4 w-4" />Add Log</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {summary && (
          <Card className="bg-accent/10 border-accent">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent-foreground" /> AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm">{summary.summary}</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
            {logs.length > 0 ? logs.map(log => (
                <div key={log.id} className="p-4 rounded-lg border bg-card relative group">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <Badge variant={getBadgeVariant(log.type)}>{log.type}</Badge>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(log.date)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                            <span>{log.technician}</span>
                        </div>
                    </div>
                    <p className="text-sm text-foreground/80 pr-8">{log.notes}</p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => onEditLog(log)}>
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
                                        This action cannot be undone. This will permanently delete the service log.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onDeleteLog(log.id)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )) : (
                <p className="text-sm text-muted-foreground text-center py-8">No service logs available.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
