import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { buildFacebookOAuthUrl, generateState } from '@/lib/facebook-oauth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const state = generateState();
    const oauthUrl = buildFacebookOAuthUrl(state);

    // Store state in cookie for validation in callback
    cookies().set('facebook_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return NextResponse.redirect(oauthUrl);
  } catch (error) {
    console.error('Error initiating Facebook OAuth:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    );
  }
}

