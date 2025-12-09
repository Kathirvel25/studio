"use server";

import {
  suggestVideos as suggestVideosFlow,
  type SuggestVideosInput,
  type SuggestVideosOutput,
} from "@/ai/flows/suggest-videos";

export async function suggestVideos(
  data: SuggestVideosInput
): Promise<SuggestVideosOutput | null> {
  try {
    const result = await suggestVideosFlow(data);
    return result;
  } catch (error) {
    console.error("Error generating video suggestions:", error);
    return null;
  }
}
