import { z } from 'genkit';

/**
 * @fileOverview Types for the text-to-speech flow.
 *
 * - TextToSpeechOutputSchema - The Zod schema for the output.
 * - TextToSpeechOutput - The TypeScript type for the output.
 */

export const TextToSpeechOutputSchema = z.object({
  media: z.string().describe('The audio data as a base64 encoded data URI.'),
});

export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
