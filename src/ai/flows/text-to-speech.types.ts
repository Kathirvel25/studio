import { z } from 'genkit';

/**
 * @fileOverview Types for the text-to-speech flow.
 *
 * - TextToSpeechOutputSchema - The Zod schema for the output.
 * - TextToSpeechOutput - The TypeScript type for the output.
 * - AudioWithTimingsOutputSchema - The Zod schema for the output with timings.
 * - AudioWithTimingsOutput - The TypeScript type for the output with timings.
 */

export const TextToSpeechOutputSchema = z.object({
  media: z.string().describe('The audio data as a base64 encoded data URI.'),
});

export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export const AudioWithTimingsOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe('The audio data as a base64 encoded data URI.'),
  timepoints: z
    .array(
      z.object({
        word: z.string(),
        startTime: z.number(),
        endTime: z.number(),
      })
    )
    .describe('An array of objects with word and timing information.'),
});

export type AudioWithTimingsOutput = z.infer<
  typeof AudioWithTimingsOutputSchema
>;
