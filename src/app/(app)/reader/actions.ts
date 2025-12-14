'use server';

import { textToSpeech } from '@/ai/flows/text-to-speech';
import { type TextToSpeechOutput } from '@/ai/flows/text-to-speech.types';

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
