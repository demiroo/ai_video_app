import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { generateAudio } from "@/utils/audioGenerator";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'alloy' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }


    // Return the full URL
    const full_url = await generateAudio(text);

    return NextResponse.json({ audioUrl: full_url });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
  }
}

async function saveAudioFile(buffer: Buffer): Promise<string> {
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const filename = `${crypto.randomBytes(16).toString('hex')}.mp3`;
  const filePath = path.join(tempDir, filename);

  await fs.promises.writeFile(filePath, buffer);

  return filename;
}

// Handle methods that aren't POST
export async function GET() {
  return NextResponse.json({ message: 'This API supports POST requests only' }, { status: 405 });
}