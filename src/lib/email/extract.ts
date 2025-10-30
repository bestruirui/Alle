import PROMPT from '../../const/prompt';
import OpenAI from 'openai';
import type { ExtractResult } from '@/types';
import { DEFAULT_EXTRACT_RESULT } from '@/types';

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
            type: { type: 'string' },
            code: { type: 'string' },
            link: { type: 'string' },
            error: { type: 'string' },
          },
          required: ['type', 'code', 'link', 'error'],
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
  const result = await env.AI.run(env.EXTRACT_MODEL, {
    messages: [
      { role: 'system', content: PROMPT },
      { role: 'user', content },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          code: { type: 'string' },
          link: { type: 'string' },
          error: { type: 'string' },
        },
        required: ['type', 'code', 'link', 'error'],
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
    let result: ExtractResult;

    // 优先使用 Cloudflare AI,如果配置了 OpenAI 则使用 OpenAI
    if (env.OPENAI_BASE_URL && env.OPENAI_API_KEY) {
      result = await extractWithOpenAI(content, env);
    } else {
      result = await extractWithCloudflareAI(content, env);
    }

    return result;
  } catch (e) {
    console.error('Extraction error:', e);
    return {
      ...DEFAULT_EXTRACT_RESULT,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
