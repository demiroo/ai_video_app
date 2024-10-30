import { NextRequest, NextResponse } from 'next/server';
import { getBullBoardHandler } from '@/utils/queueConfig';

export async function GET(req: NextRequest) {
  const { pathname, searchParams } = new URL(req.url);
  const bullBoardPath = pathname.replace('/api/bull-board', '');
  
  return new Promise((resolve) => {
    getBullBoardHandler(
      {
        method: 'GET',
        url: bullBoardPath + '?' + searchParams.toString(),
        headers: Object.fromEntries(req.headers),
      } as any,
      {
        setHeader: (name: string, value: string) => {
          // This function is called by the Bull Board to set headers
        },
        end: (body: string) => {
          resolve(new NextResponse(body, {
            status: 200,
            headers: {
              'Content-Type': 'text/html',
            },
          }));
        },
      } as any,
      () => {
        // This is the "next" function, which we don't need to use
      }
    );
  });
}

export async function POST(req: NextRequest) {
  const { pathname, searchParams } = new URL(req.url);
  const bullBoardPath = pathname.replace('/api/bull-board', '');
  
  const body = await req.text();

  return new Promise((resolve) => {
    getBullBoardHandler(
      {
        method: 'POST',
        url: bullBoardPath + '?' + searchParams.toString(),
        headers: Object.fromEntries(req.headers),
        body: body,
      } as any,
      {
        setHeader: (name: string, value: string) => {
          // This function is called by the Bull Board to set headers
        },
        end: (body: string) => {
          resolve(new NextResponse(body, {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }));
        },
      } as any,
      () => {
        // This is the "next" function, which we don't need to use
      }
    );
  });
}
