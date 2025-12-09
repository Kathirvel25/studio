"use server";

import {
  generateWeeklyFeedback,
  type WeeklyFeedbackInput,
  type WeeklyFeedbackOutput,
} from "@/ai/flows/ai-weekly-smart-feedback";

export async function getAIFeedback(
  data: WeeklyFeedbackInput
): Promise<WeeklyFeedbackOutput | null> {
  try {
    const result = await generateWeeklyFeedback(data);
    return result;
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    // In a real app, you might want to log this error to a monitoring service
    return null;
  }
}
