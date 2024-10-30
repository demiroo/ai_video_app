import { NextRequest, NextResponse } from 'next/server';
import { generateQuiz } from '@/utils/quizGenerator';
import { quizQueue } from '@/utils/queueConfig';


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, numberOfQuestions, action } = body;
    
    console.log('Quiz API received:', { topic, numberOfQuestions, action }); // Debug log
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }
    
    if (action === 'auto_generate_video') {
      const jobId = await generateQuiz(topic.text, numberOfQuestions);
      const statusUrl = `${baseUrl}/api/quiz-status/${jobId}`;
      
      return NextResponse.json({ url: statusUrl });
    }

    
  } catch (error) {
    console.error('Error in quiz route:', error);
    return NextResponse.json(
      { error: 'Failed to process quiz request' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  try {
    const job = await quizQueue.getJob(jobId);
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const state = await job.getState();
    const progress = job.progress();

    if (state === 'completed') {
      const result = job.returnvalue || job.data.result;
      return NextResponse.json({ state, progress, result }, { status: 200 });
    } else if (state === 'failed') {
      const error = job.failedReason;
      return NextResponse.json({ state, progress, error }, { status: 200 });
    } else {
      return NextResponse.json({ state, progress }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching job status:', error);
    return NextResponse.json({ error: 'Failed to fetch job status' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get all job IDs
    const jobIds = await quizQueue.getJobs(['waiting', 'active', 'delayed', 'paused']);
    
    // Cancel each job
    for (const job of jobIds) {
      await job.remove();
    }

    // Clear the queue
    await quizQueue.empty();

    return NextResponse.json({ message: `Cancelled ${jobIds.length} jobs and cleared the queue` }, { status: 200 });
  } catch (error) {
    console.error('Error cancelling jobs:', error);
    return NextResponse.json({ error: 'Failed to cancel jobs' }, { status: 500 });
  }
}
