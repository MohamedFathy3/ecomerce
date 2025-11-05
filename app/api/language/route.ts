import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { language } = await request.json();
    
    if (!['en', 'nl', 'de', 'fr'].includes(language)) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
    }
    
    const response = NextResponse.json({ success: true });
    
    // خزن اللغة في cookie
    response.cookies.set('Lan', language, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}