'use server';

import {
  textToSpeech,
  type TextToSpeechOutput,
} from '@/ai/flows/text-to-speech';

export async function generateAudio(
  text: string
): Promise<TextToSpeechOutput | null> {
  try {
    const result = await textToSpeech(text);
    return result;
  } catch (error) {
    console.error('Error generating audio:', error);
    return null;
  }
}
