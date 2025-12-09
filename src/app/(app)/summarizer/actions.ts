"use server";

import {
  summarizeDocument as summarizeDocumentFlow,
  type SummarizeDocumentInput,
  type SummarizeDocumentOutput,
} from "@/ai/flows/summarize-document";

export async function summarizeDocument(
  data: SummarizeDocumentInput
): Promise<SummarizeDocumentOutput | null> {
  try {
    const result = await summarizeDocumentFlow(data);
    return result;
  } catch (error) {
    console.error("Error generating summary:", error);
    return null;
  }
}
