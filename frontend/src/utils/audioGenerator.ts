import fs from "fs";
import path from "path";
import OpenAI from "openai";
import crypto from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateAudio(text: string): Promise<string> {
  try {
    const fileName = `speech_${crypto.randomBytes(16).toString('hex')}.mp3`;
    const tempDir = path.join(process.cwd(), 'public/quiz');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    const speechFile = path.join(tempDir, fileName);

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      input: text,
      voice: "alloy",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    return `${baseUrl}/quiz/${fileName}`;
  } catch (error) {
    console.error("Error generating audio:", error);
    return "";
  }
}
