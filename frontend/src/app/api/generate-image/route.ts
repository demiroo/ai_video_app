import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import { generateImage } from "@/utils/imageGenerator";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const { prompt, size = '1024x1792' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('Prompt:', prompt);
    // Download and save the image
    const full_url = await generateImage(prompt);

    return NextResponse.json({ image_url: full_url });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}

async function downloadAndSaveImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const filename = `${crypto.randomBytes(16).toString('hex')}.png`;
      const filePath = path.join(tempDir, filename);
      const fileStream = fs.createWriteStream(filePath);

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filename);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Handle methods that aren't POST
export async function GET() {
  return NextResponse.json({ message: 'This API supports POST requests only' }, { status: 405 });
}