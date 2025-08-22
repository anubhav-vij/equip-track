'use server';
/**
 * @fileOverview An AI agent to summarize service reports and preventative maintenance records for a piece of equipment.
 *
 * - summarizeServiceReports - A function that handles the summarization process.
 * - SummarizeServiceReportsInput - The input type for the summarizeServiceReports function.
 * - SummarizeServiceReportsOutput - The return type for the summarizeServiceReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeServiceReportsInputSchema = z.object({
  serviceReports: z
    .string()
    .describe('A text containing service reports and preventative maintenance records.'),
});
export type SummarizeServiceReportsInput = z.infer<typeof SummarizeServiceReportsInputSchema>;

const SummarizeServiceReportsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the service reports and preventative maintenance records.'),
});
export type SummarizeServiceReportsOutput = z.infer<typeof SummarizeServiceReportsOutputSchema>;

export async function summarizeServiceReports(
  input: SummarizeServiceReportsInput
): Promise<SummarizeServiceReportsOutput> {
  return summarizeServiceReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeServiceReportsPrompt',
  input: {schema: SummarizeServiceReportsInputSchema},
  output: {schema: SummarizeServiceReportsOutputSchema},
  prompt: `You are a maintenance technician summarizing service reports and preventative maintenance records for a piece of equipment.

  Summarize the following service reports and preventative maintenance records:

  {{{serviceReports}}}
  `,
});

const summarizeServiceReportsFlow = ai.defineFlow(
  {
    name: 'summarizeServiceReportsFlow',
    inputSchema: SummarizeServiceReportsInputSchema,
    outputSchema: SummarizeServiceReportsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
