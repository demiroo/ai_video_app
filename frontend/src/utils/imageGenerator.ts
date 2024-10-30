import OpenAI from "openai";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import https from "https";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `create a realistic 9:16 background image based on the context of this sentence. If the sentence is a quiz question the image should not reveal the answer of the question and don't write the question or sentence on the image:${prompt}`,
      n: 1,
      quality: "standard",
      size: "1024x1792",
    });

    const image_url = response.data[0].url;
    if (!image_url) {
      throw new Error('No image URL returned from OpenAI');
    }

    const fileName = await downloadAndSaveImage(image_url);
    return `${baseUrl}/quiz/${fileName}`;
  } catch (error) {
    console.error("Error generating image:", error);
    return "";
  }
}

async function downloadAndSaveImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const tempDir = path.join(process.cwd(), 'public/quiz');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const fileName = `image_${crypto.randomBytes(16).toString('hex')}.png`;
      const filePath = path.join(tempDir, fileName);
      const fileStream = fs.createWriteStream(filePath);

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(fileName);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}
