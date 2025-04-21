import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = 'gpt-4.1-nano'

function buildSystemInstruction({
  username,
  age,
  gender,
  height,
  weight,
  bench,
  squat,
  deadlift,
  mileTime
}) {
  return `
You are Chat-PT, a Personal Trainer assistant.

Here is the User's Profile:
• Name: ${username}
• Age: ${age}
• Gender: ${gender}
• Height: ${height}
• Weight: ${weight}
• Bench: ${bench}
• Squat: ${squat}
• Deadlift: ${deadlift}
• Mile time: ${mileTime}

Rules:
1. 
`.trim();
}

export async function POST(request) {
  try {
    const { messages, user } = await request.json();

    // Normalize roles for OpenAI
    const chatMessages = messages.map(({ role, text }) => {
      let normalizedRole;
      switch (role) {
        case 'user':
          normalizedRole = 'user';
          break;
        case 'model':
        case 'ai':
          normalizedRole = 'assistant';
          break;
        case 'system':
        case 'function':
        case 'tool':
        case 'developer':
          normalizedRole = role;
          break;
        default:
          normalizedRole = 'user';
      }
      return { role: normalizedRole, content: text };
    });

    // Prepend system instruction
    chatMessages.unshift({ role: 'system', content: buildSystemInstruction(user) });

    // Invoke chat completion with function calling
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: chatMessages,
      functions: [
        {
          name: 'setClientVars',
          description:
            'Call this ONLY if the user explicitly asks to set or update their name, age, weight, or height. Do not call this function unless the user clearly wants to change their personal details.',
          parameters: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The user’s new preferred first name (if they want to change it).',
              },
              age: {
                type: 'number',
                description: 'The user’s updated age (if they want to update it).',
              },
              weight: {
                type: 'number',
                description: 'The user’s updated weight (in lbs) (if they want to update it).',
              },
              height: {
                type: 'number',
                description: 'The user’s updated height (in cm) (if they want to update it).',
              },
            },
            required: [],
          },
        },
        {
          name: 'updateFitnessStats',
          description:
            'Call this ONLY if the user clearly requests to update their fitness stats, such as bench, squat, or deadlift values. Do not call this unless the user wants to update their workout records.',
          parameters: {
            type: 'object',
            properties: {
              bench: {
                type: 'string',
                description: 'New bench press max (e.g. "225lbs") if provided.',
              },
              squat: {
                type: 'string',
                description: 'New squat max if provided.',
              },
              deadlift: {
                type: 'string',
                description: 'New deadlift max if provided.',
              },
            },
            required: [],
          },
        },
        {
          name: 'setMileTime',
          description:
            'Call this ONLY if the user explicitly wants to update their mile run time. Do not call this unless the user provides a new time and requests an update.',
          parameters: {
            type: 'object',
            properties: {
              mileTime: {
                type: 'string',
                description: 'The user’s updated best mile time (format mm:ss).',
              },
            },
            required: ['mileTime'],
          },
        },
        
      ],
      function_call: 'auto',
    });
    
    

    const msg = response.choices[0].message;
    const reply = msg.content ?? 'Updating User Statistics';
    const functionCalls = msg.function_call ? [msg.function_call] : [];

    return NextResponse.json({ reply, functionCalls });
  } catch (err) {
    console.error('OpenAI request error:', err);
    return NextResponse.json({ error: 'Failed to generate response.' }, { status: 500 });
  }
}