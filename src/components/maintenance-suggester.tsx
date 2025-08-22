"use client";
import { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { suggestMaintenanceSchedule, SuggestMaintenanceScheduleOutput } from '@/ai/flows/suggest-maintenance-schedule';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Equipment } from '@/lib/types';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

export function MaintenanceSuggester({ equipment }: { equipment: Equipment }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestMaintenanceScheduleOutput | null>(null);
  
  const [envFactors, setEnvFactors] = useState("Standard industrial environment, 24/7 operation.");
  
  const historicalData = equipment.serviceLogs.map(log => 
    `Date: ${log.date}, Type: ${log.type}, Technician: ${log.technician}, Notes: ${log.notes}`
  ).join('\n');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const suggestion = await suggestMaintenanceSchedule({
        equipmentType: `${equipment.name} (${equipment.model})`,
        operationalHours: equipment.operationalHours,
        failureRate: equipment.failureRate,
        environmentalFactors: envFactors,
        historicalMaintenanceData: historicalData || "No historical data available.",
      });
      setResult(suggestion);
    } catch (error) {
      console.error("Failed to get maintenance suggestion:", error);
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "There was an error generating the maintenance schedule. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Maintenance Schedule</CardTitle>
        <CardDescription>
          Generate an optimized maintenance schedule based on the equipment's usage and history.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
               <div>
                  <Label>Operational Hours</Label>
                  <Input value={equipment.operationalHours} disabled />
                </div>
                <div>
                  <Label>Failure Rate</Label>
                  <Input value={equipment.failureRate} disabled />
                </div>
            </div>
            <div>
                <Label htmlFor="env-factors">Environmental Factors</Label>
                <Textarea id="env-factors" value={envFactors} onChange={(e) => setEnvFactors(e.target.value)} />
            </div>
            <div>
                <Label>Historical Maintenance Data (Auto-filled)</Label>
                <Textarea value={historicalData} rows={5} readOnly disabled/>
            </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Suggest Schedule
              </>
            )}
          </Button>
        </CardFooter>
      </form>
      
      {result && (
        <CardContent className="space-y-4 pt-6">
            <h3 className="font-semibold text-lg">Suggestion Result</h3>
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle>Suggested Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{result.suggestedMaintenanceSchedule}</p>
                </CardContent>
            </Card>
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle>Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{result.reasoning}</p>
                </CardContent>
            </Card>
        </CardContent>
      )}
    </Card>
  );
}
