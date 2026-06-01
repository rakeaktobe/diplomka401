import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Just consume the body and discard it to measure the upload time
  try {
    await req.arrayBuffer();
  } catch (e) {
    // ignore
  }
  return NextResponse.json({ ok: true });
}
