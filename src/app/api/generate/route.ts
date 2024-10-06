// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
  }

  // Check cache
  const cachedResponse = cache.get(prompt);
  if (cachedResponse) {
    return NextResponse.json({ response: cachedResponse });
  }

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    // Create a chat completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim() ?? '';

    // Store in cache
    if (aiResponse) {
      cache.set(prompt, aiResponse);
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error communicating with OpenAI', error);
    return NextResponse.json({ error: 'Error generating response.' }, { status: 500 });
  }
}