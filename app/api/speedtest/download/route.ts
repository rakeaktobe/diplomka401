import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TOTAL = 4 * 1024 * 1024; // 4 MB
const CHUNK = 65536;            // 64 KB per chunk

export async function GET() {
  let sent = 0;

  // Streams fresh random 64 KB chunks — incompressible, no buffering delay
  const stream = new ReadableStream({
    async pull(controller) {
      if (sent >= TOTAL) { controller.close(); return; }
      const size = Math.min(CHUNK, TOTAL - sent);
      const buf = new Uint8Array(size);
      crypto.getRandomValues(buf);
      controller.enqueue(buf);
      sent += size;
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(TOTAL),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
