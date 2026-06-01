import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Generate a random payload of 1MB
  // Using random bytes ensures compression doesn't skew results
  const size = 1024 * 1024; 
  const buffer = new Uint8Array(size);
  // Fill the buffer with random data
  for (let i = 0; i < size; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
  }

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}
