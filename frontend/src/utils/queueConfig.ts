import Queue from 'bull';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

// Create a new queue
export const quizQueue = new Queue('quiz-generation', {
  redis: process.env.REDIS_URL,
  settings: {
    lockDuration: 300000, // 5 minutes in milliseconds
  }
});

// Add a repeatable job for cleanup
quizQueue.add(
  'cleanup',
  {},
  {
    repeat: {
      cron: '0 0 * * *' // Run daily at midnight
    }
  }
);

// Process the cleanup job
quizQueue.process('cleanup', async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  await quizQueue.clean(60 * 60 * 1000, 'completed');
  await quizQueue.clean(60 * 60 * 1000, 'failed');
});

// Create a Bull adapter
const bullAdapter = new BullAdapter(quizQueue);

// Create an Express adapter
export const serverAdapter = new ExpressAdapter();

// Set up bull-board
createBullBoard({
  queues: [bullAdapter],
  serverAdapter: serverAdapter,
});

// Make the server adapter's router available
serverAdapter.setBasePath('/api/bull-board');

// Export the getRouter function
export const getBullBoardHandler = serverAdapter.getRouter();
