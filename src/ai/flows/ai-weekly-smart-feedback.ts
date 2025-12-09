'use server';

/**
 * @fileOverview Generates personalized weekly study reports using AI analysis.
 *
 * - generateWeeklyFeedback -  Generates a report providing insights into a student's study habits with suggestions for improvement.
 * - WeeklyFeedbackInput - The input type for the generateWeeklyFeedback function.
 * - WeeklyFeedbackOutput - The return type for the generateWeeklyFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeeklyFeedbackInputSchema = z.object({
  completedTasks: z.string().describe('A list of tasks the student completed this week.'),
  missedTasks: z.string().describe('A list of tasks the student missed this week.'),
  studyTime: z.string().describe('The total study time of the student this week.'),
  difficultyLevels: z.string().describe('The difficulty levels of the tasks the student worked on this week.'),
});
export type WeeklyFeedbackInput = z.infer<typeof WeeklyFeedbackInputSchema>;

const WeeklyFeedbackOutputSchema = z.object({
  report: z.string().describe('A personalized weekly report for the student, analyzing their study habits and suggesting areas for improvement.'),
});
export type WeeklyFeedbackOutput = z.infer<typeof WeeklyFeedbackOutputSchema>;

export async function generateWeeklyFeedback(input: WeeklyFeedbackInput): Promise<WeeklyFeedbackOutput> {
  return weeklyFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weeklyFeedbackPrompt',
  input: {schema: WeeklyFeedbackInputSchema},
  output: {schema: WeeklyFeedbackOutputSchema},
  prompt: `You are an AI study assistant. Analyze the following data about a student's study habits this week and generate a personalized report with suggestions for improvement.

Completed Tasks: {{{completedTasks}}}
Missed Tasks: {{{missedTasks}}}
Study Time: {{{studyTime}}}
Difficulty Levels: {{{difficultyLevels}}}

Based on this information, provide a concise report that includes:
- An overview of the student's performance this week.
- Specific areas where the student excelled.
- Areas where the student needs to improve.
- Actionable suggestions for optimizing their study strategy next week.

Example: 'You completed 68% of your weekly plan. You should focus more on Math next week. Consider breaking down complex tasks into smaller steps.'`,
});

const weeklyFeedbackFlow = ai.defineFlow(
  {
    name: 'weeklyFeedbackFlow',
    inputSchema: WeeklyFeedbackInputSchema,
    outputSchema: WeeklyFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
