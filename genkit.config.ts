import {googleAI} from '@genkit-ai/google-genai';
import {configureGenkit} from 'genkit';

import '@/ai/flows/ai-weekly-smart-feedback.ts';
import '@/ai/flows/summarize-document.ts';
import '@/ai/flows/suggest-videos.ts';
import '@/ai/flows/generate-mcq.ts';
import '@/ai/flows/text-to-speech.ts';

export default configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
