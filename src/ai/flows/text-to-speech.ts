
'use server';
/**
 * @fileOverview A flow for converting text to speech.
 *
 * - textToSpeech - A function that takes a string and returns audio data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import {
  TextToSpeechOutputSchema,
  type TextToSpeechOutput,
  AudioWithTimingsOutputSchema,
  type AudioWithTimingsOutput,
} from './text-to-speech.types';

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.string(),
    outputSchema: TextToSpeechOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: query,
    });
    if (!media?.url) {
      throw new Error('No media returned from TTS model');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);
    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

export async function textToSpeech(
  text: string
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(text);
}


const getAudioWithTimingsFlow = ai.defineFlow(
  {
    name: 'getAudioWithTimingsFlow',
    inputSchema: z.string(),
    outputSchema: AudioWithTimingsOutputSchema,
  },
  async (query) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO', 'TEXT'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
          enableTimepoints: true,
        },
      },
      prompt: query,
    });

    if (
      !output ||
      !output.custom ||
      !output.custom.audio ||
      !output.custom.timepoints
    ) {
      throw new Error('Invalid response from TTS model for timings.');
    }

    const audioBuffer = Buffer.from(
      (output.custom.audio as string).substring(
        (output.custom.audio as string).indexOf(',') + 1
      ),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
      timepoints: output.custom.timepoints as any[],
    };
  }
);

export async function getAudioWithTimings(
  text: string
): Promise<AudioWithTimingsOutput> {
  return getAudioWithTimingsFlow(text);
}
