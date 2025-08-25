'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting an optimized maintenance schedule for a piece of equipment.
 *
 * The flow takes into account the equipment's usage patterns and historical data to recommend a schedule that reduces downtime and extends the equipment's lifespan.
 *
 * @exports suggestMaintenanceSchedule - An async function that triggers the maintenance schedule suggestion flow.
 * @exports SuggestMaintenanceScheduleInput - The input type for the suggestMaintenanceSchedule function.
 * @exports SuggestMaintenanceScheduleOutput - The output type for the suggestMaintenanceSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMaintenanceScheduleInputSchema = z.object({
  equipmentType: z.string().describe('The type of equipment.'),
  environmentalFactors: z.string().describe('The environmental factors affecting the equipment.'),
  historicalMaintenanceData: z.string().describe('Historical maintenance data for the equipment.'),
});
export type SuggestMaintenanceScheduleInput = z.infer<
  typeof SuggestMaintenanceScheduleInputSchema
>;

const SuggestMaintenanceScheduleOutputSchema = z.object({
  suggestedMaintenanceSchedule: z
    .string()
    .describe('The suggested maintenance schedule.'),
  reasoning: z.string().describe('The reasoning behind the suggested schedule.'),
});
export type SuggestMaintenanceScheduleOutput = z.infer<
  typeof SuggestMaintenanceScheduleOutputSchema
>;

const suggestMaintenanceSchedulePrompt = ai.definePrompt({
  name: 'suggestMaintenanceSchedulePrompt',
  input: {schema: SuggestMaintenanceScheduleInputSchema},
  output: {schema: SuggestMaintenanceScheduleOutputSchema},
  prompt: `You are an expert maintenance schedule optimizer.

  Based on the equipment's type, environmental factors and historical maintenance data, suggest an optimized maintenance schedule.

  Equipment Type: {{{equipmentType}}}
  Environmental Factors: {{{environmentalFactors}}}
  Historical Maintenance Data: {{{historicalMaintenanceData}}}

  Please provide a detailed maintenance schedule and the reasoning behind it.
  `,
});

const suggestMaintenanceScheduleFlow = ai.defineFlow(
  {
    name: 'suggestMaintenanceScheduleFlow',
    inputSchema: SuggestMaintenanceScheduleInputSchema,
    outputSchema: SuggestMaintenanceScheduleOutputSchema,
  },
  async input => {
    const {output} = await suggestMaintenanceSchedulePrompt(input);
    return output!;
  }
);

export async function suggestMaintenanceSchedule(
  input: SuggestMaintenanceScheduleInput
): Promise<SuggestMaintenanceScheduleOutput> {
  return suggestMaintenanceScheduleFlow(input);
}
