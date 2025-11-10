import PROMPT from '@/const/prompt';
import OpenAI from 'openai';

import { DEFAULT_EXTRACT_RESULT } from '@/types';

import type { ExtractResult } from '@/types';

async function extractWithOpenAI(
  content: string,
  env: CloudflareEnv
): Promise<ExtractResult> {
  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_BASE_URL,
  });

  const response = await client.chat.completions.create({
    model: env.EXTRACT_MODEL,
    messages: [
      { role: 'system', content: PROMPT },
      { role: 'user', content },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'response_object',
        schema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['auth_code', 'auth_link', 'service_link', 'subscription_link', 'other_link', 'none']
            },
            result: { type: 'string' },
            result_text: { type: 'string' },
          },
          required: ['type', 'result', 'result_text'],
        },
      },
    },
  });

  const jsonText = response.choices[0].message.content;
  if (!jsonText) {
    throw new Error('OpenAI returned empty response');
  }

  return JSON.parse(jsonText) as ExtractResult;
}

async function extractWithCloudflareAI(
  content: string,
  env: CloudflareEnv
): Promise<ExtractResult> {
  const result = await env.AI.run(env.EXTRACT_MODEL as keyof AiModels, {
    messages: [
      { role: 'system', content: PROMPT },
      { role: 'user', content },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['auth_code', 'auth_link', 'service_link', 'subscription_link', 'other_link', 'none']
          },
          result: { type: 'string' },
          result_text: { type: 'string' },
        },
        required: ['type', 'result', 'result_text'],
      },
    },
    stream: false,
  });

  // @ts-expect-error result.response
  const response = result.response;

  if (typeof response === 'string') {
    return JSON.parse(response) as ExtractResult;
  }

  if (response && typeof response === 'object') {
    return response as ExtractResult;
  }

  throw new Error('Unexpected response format from Cloudflare AI');
}

export default async function extract(
  content: string,
  env: CloudflareEnv
): Promise<ExtractResult> {
  try {
    let result: ExtractResult = DEFAULT_EXTRACT_RESULT;
    if (env.OPENAI_BASE_URL && env.OPENAI_API_KEY) {
      result = await extractWithOpenAI(content, env);
    } else {
      result = await extractWithCloudflareAI(content, env);
    }
    return result;
  } catch (e) {
    console.error('Extraction error:', e);
    return DEFAULT_EXTRACT_RESULT;
  }
}
