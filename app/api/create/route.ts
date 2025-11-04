import { NextRequest, NextResponse } from 'next/server';
import { urlToSlug } from '@/lib/slug';
import { submitIndexNow } from '@/lib/indexnow';

function normalizeUrl(input: string): URL {
  const u = new URL(input);
  if (u.protocol !== 'https:') {
    throw new Error('URL must use https:// protocol');
  }
  return u;
}

function getHost(req: NextRequest): string {
  const forwardedHost = req.headers.get('x-forwarded-host');
  const host = forwardedHost || req.headers.get('host') || '';
  return host;
}

function getProto(req: NextRequest): 'http' | 'https' {
  const proto = (req.headers.get('x-forwarded-proto') || 'https').split(',')[0].trim();
  return proto === 'http' ? 'http' : 'https';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const inputUrl: string | undefined = body?.url;
    const anchorText: string | undefined = body?.anchorText;

    if (!inputUrl) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    const normalized = normalizeUrl(inputUrl);
    const slug = urlToSlug(normalized.toString());

    const host = getHost(req);
    const proto = getProto(req);
    const backlinkUrl = `${proto}://${host}/b/${slug}`;

    // Fire-and-forget IndexNow submission
    submitIndexNow(host, [backlinkUrl]).catch(() => {});

    return NextResponse.json({ slug, backlinkUrl, anchor: anchorText || normalized.host });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Invalid request' }, { status: 400 });
  }
}
