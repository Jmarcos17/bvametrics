import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateState } from '@/lib/facebook-oauth';
import { cookies } from 'next/headers';

/**
 * Public endpoint to initiate Facebook OAuth for a client
 * No authentication required - uses client token
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Verify client token exists and is active
    const client = await db.client.findUnique({
      where: { token, active: true },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Invalid or inactive connection link' },
        { status: 404 }
      );
    }

    // Build OAuth URL with client token in state
    const state = generateState();
    const oauthUrl = new URL(
      'https://www.facebook.com/v19.0/dialog/oauth'
    );

    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri =
      process.env.FACEBOOK_REDIRECT_URI ||
      `${process.env.NEXTAUTH_URL}/api/auth/facebook/callback`;

    if (!appId) {
      return NextResponse.json(
        { error: 'Facebook OAuth not configured' },
        { status: 500 }
      );
    }

    oauthUrl.searchParams.set('client_id', appId);
    oauthUrl.searchParams.set('redirect_uri', redirectUri);
    oauthUrl.searchParams.set('state', `${state}:${token}`); // Include client token in state
    oauthUrl.searchParams.set('scope', 'ads_read,business_management');
    oauthUrl.searchParams.set('response_type', 'code');

    // Store state and client token in cookie
    cookies().set('facebook_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    cookies().set('facebook_oauth_client_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return NextResponse.redirect(oauthUrl.toString());
  } catch (error) {
    console.error('Error initiating client OAuth:', error);
    return NextResponse.json(
      { error: 'Failed to initiate connection' },
      { status: 500 }
    );
  }
}

