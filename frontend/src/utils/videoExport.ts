import { QuizData } from '../types/quizTypes';

async function parseStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  updateProgress: (progress: number) => void,
): Promise<string> {
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const decoded = new TextDecoder('utf-8').decode(value);
    const split = decoded.split('\n');

    for (const line of split) {
      if (line.startsWith('event:')) {
        const event = line.slice(6).trim();
        const data = split[split.indexOf(line) + 1].slice(6).trim();

        if (event === 'progress') {
          const parsed = JSON.parse(data);
          updateProgress(parsed.progress);
        }

        if (event === 'completed') {
          const parsed = JSON.parse(data);
          return parsed.downloadLink as string;
        }

        if (event === 'error') {
          console.error(data);
          throw new Error(data);
        }
      }
    }
  }

  throw new Error('Stream ended without completion');
}

export async function exportVideo(quizData: QuizData, onProgress: (progress: number) => void): Promise<string> {
  const res = await fetch('/api/render', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variables: quizData,
      streamProgress: true,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to render video.');
  }

  return parseStream(res.body!.getReader(), onProgress);
}