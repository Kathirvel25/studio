"use server";

/**
 * @fileOverview A flow for summarizing text documents.
 *
 * - summarizeDocument - A function that takes document content and returns a summary.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const SummarizeDocumentInputSchema = z.object({
  documentContent: z.string().describe("The text content of the document to be summarized."),
});
export type SummarizeDocumentInput = z.infer<
  typeof SummarizeDocumentInputSchema
>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z
    .string()
    .describe("A concise summary of the provided document content."),
});
export type SummarizeDocumentOutput = z.infer<
  typeof SummarizeDocumentOutputSchema
>;

export async function summarizeDocument(
  input: SummarizeDocumentInput
): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: "summarizeDocumentPrompt",
  input: { schema: SummarizeDocumentInputSchema },
  output: { schema: SummarizeDocumentOutputSchema },
  prompt: `You are an expert at summarizing text. Your goal is to provide a clear and concise summary of the following document. The summary should capture the key points and main ideas, making it easier for a student to learn the material quickly.

Document to Summarize:
{{{documentContent}}}

Please provide a summary of the document.`,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: "summarizeDocumentFlow",
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
