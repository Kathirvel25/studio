'use server';

import {
  generateMcq as generateMcqFlow,
  type GenerateMcqInput,
  type GenerateMcqOutput,
} from '@/ai/flows/generate-mcq';

export async function generateMcq(
  data: GenerateMcqInput
): Promise<GenerateMcqOutput | null> {
  try {
    const result = await generateMcqFlow(data);
    return result;
  } catch (error) {
    console.error('Error generating quiz:', error);
    return null;
  }
}
