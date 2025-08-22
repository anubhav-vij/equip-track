"use client"
import { useState } from 'react';
import { Loader2, Sparkles, Plus, Wrench, Calendar } from 'lucide-react';
import { summarizeServiceReports, SummarizeServiceReportsOutput } from '@/ai/flows/summarize-service-reports';
import type { ServiceLog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';

export function ServiceLogs({ logs }: { logs: ServiceLog[] }) {
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
            {/* Future: Add new log functionality */}
            {/* <Button><Plus className="mr-2 h-4 w-4" />Add Log</Button> */}
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
                <div key={log.id} className="p-4 rounded-lg border bg-card">
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
                    <p className="text-sm text-foreground/80">{log.notes}</p>
                </div>
            )) : (
                <p className="text-sm text-muted-foreground text-center py-8">No service logs available.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
