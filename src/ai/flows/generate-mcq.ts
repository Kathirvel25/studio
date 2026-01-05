'use server';

/**
 * @fileOverview A flow for generating multiple-choice questions from a document, an image, or a topic.
 *
 * - generateMcq - A function that takes document content, an image, or a topic and returns a set of MCQs.
 * - GenerateMcqInput - The input type for the generateMcq function.
 * - GenerateMcqOutput - The return type for the generateMcq function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMcqInputSchema = z.object({
  documentContent: z
    .string()
    .optional()
    .describe('The text content of the document to generate questions from.'),
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "An image to generate questions from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  topic: z
    .string()
    .optional()
    .describe('A topic to generate questions about.'),
  numQuestions: z
    .number()
    .default(5)
    .describe('The number of questions to generate.'),
});
export type GenerateMcqInput = z.infer<typeof GenerateMcqInputSchema>;

const McqQuestionSchema = z.object({
  question: z.string().describe('The multiple-choice question.'),
  options: z.array(z.string()).describe('An array of 4 possible answers.'),
  correctAnswerIndex: z
    .number()
    .describe('The index of the correct answer in the options array.'),
});

const GenerateMcqOutputSchema = z.object({
  questions: z
    .array(McqQuestionSchema)
    .describe('A list of multiple-choice questions.'),
});
export type GenerateMcqOutput = z.infer<typeof GenerateMcqOutputSchema>;

export async function generateMcq(
  input: GenerateMcqInput
): Promise<GenerateMcqOutput> {
  return generateMcqFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMcqPrompt',
  input: { schema: GenerateMcqInputSchema },
  output: { schema: GenerateMcqOutputSchema },
  prompt: `You are an expert teacher creating a quiz for a student. Based on the document, image, or topic provided, generate {{{numQuestions}}} multiple-choice questions to test their understanding. Each question should have 4 options.

{{#if documentContent}}
Document Content:
{{{documentContent}}}
{{/if}}

{{#if imageDataUri}}
Image Content:
{{media url=imageDataUri}}
{{/if}}

{{#if topic}}
Topic:
{{{topic}}}
{{/if}}

Please generate {{{numQuestions}}} questions. For each question, provide the question text, 4 options, and the index of the correct answer.`,
});

const generateMcqFlow = ai.defineFlow(
  {
    name: 'generateMcqFlow',
    inputSchema: GenerateMcqInputSchema,
    outputSchema: GenerateMcqOutputSchema,
    model: 'googleai/gemini-2.5-flash',
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);