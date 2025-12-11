'use server';

/**
 * @fileOverview Generates YouTube video suggestions for students.
 *
 * - suggestVideos - A function that suggests YouTube videos based on a subject.
 * - SuggestVideosInput - The input type for the suggestVideos function.
 * - SuggestVideosOutput - The return type for the suggestVideos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestVideosInputSchema = z.object({
  subject: z.string().describe('The subject the student is studying.'),
});
export type SuggestVideosInput = z.infer<typeof SuggestVideosInputSchema>;

const VideoSuggestionSchema = z.object({
    title: z.string().describe('The suggested title of the YouTube video.'),
    channel: z.string().describe('The YouTube channel that might have this video.'),
    reason: z.string().describe('A short reason why this video is recommended.'),
});

const SuggestVideosOutputSchema = z.object({
  videos: z.array(VideoSuggestionSchema).describe('A list of 3 to 5 suggested YouTube videos.'),
});
export type SuggestVideosOutput = z.infer<typeof SuggestVideosOutputSchema>;

export async function suggestVideos(input: SuggestVideosInput): Promise<SuggestVideosOutput> {
  return suggestVideosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestVideosPrompt',
  input: {schema: SuggestVideosInputSchema},
  output: {schema: SuggestVideosOutputSchema},
  prompt: `You are an AI assistant that helps students find relevant YouTube videos for their studies. Based on the subject provided, suggest 3 to 5 helpful YouTube videos. For each video, provide a potential title, a likely YouTube channel, and a brief reason for the recommendation.

Subject: {{{subject}}}

Generate a list of video suggestions.`,
});

const suggestVideosFlow = ai.defineFlow(
  {
    name: 'suggestVideosFlow',
    inputSchema: SuggestVideosInputSchema,
    outputSchema: SuggestVideosOutputSchema,
    model: 'googleai/gemini-2.5-flash',
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
