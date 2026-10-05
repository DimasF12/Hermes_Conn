import { getReportHtml } from '@/lib/reports';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const file = url.searchParams.get('file');

  if (!file || !/^[a-zA-Z0-9._-]+\.html?$/i.test(file)) {
    return new Response('Invalid file parameter', { status: 400 });
  }

  try {
    const html = await getReportHtml(file);
    if (!html) {
      return new Response('Report not found', { status: 404 });
    }

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: any) {
    return new Response(`Error loading report: ${err.message}`, { status: 500 });
  }
}
