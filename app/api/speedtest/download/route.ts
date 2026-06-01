import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Use Node's native crypto.randomBytes — generates 2MB in microseconds
  // Random data prevents CDN/gzip compression from skewing results
  const buffer = randomBytes(2 * 1024 * 1024);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(buffer.length),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}
