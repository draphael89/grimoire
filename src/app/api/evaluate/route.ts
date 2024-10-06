// src/app/api/evaluate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  const { userPrompt, aiResponse } = await request.json();

  if (!userPrompt || !aiResponse) {
    return NextResponse.json({ error: 'User prompt and AI response are required.' }, { status: 400 });
  }

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const evaluationPrompt = `
Evaluate the following AI response to the user's prompt.
- Score the response on a scale of 1 to 10 based on:
  - Precision
  - Creativity
  - Tone
  - Politeness
- Provide a brief explanation for each score.

User Prompt:
${userPrompt}

AI Response:
${aiResponse}
`;

  try {
    // Create a chat completion for evaluation
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: evaluationPrompt }],
      max_tokens: 500,
    });

    const evaluation = completion.choices[0]?.message?.content?.trim() ?? 'No evaluation available';

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error('Error evaluating response:', error);
    return NextResponse.json({ error: 'Error evaluating response.' }, { status: 500 });
  }
}