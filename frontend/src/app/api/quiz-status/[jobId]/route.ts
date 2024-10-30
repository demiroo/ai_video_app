import { NextResponse } from 'next/server';
import { quizQueue } from '@/utils/queueConfig';

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  const jobId = params.jobId;
  
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
