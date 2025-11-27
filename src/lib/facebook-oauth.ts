import { randomBytes } from 'crypto';

/**
 * Generate OAuth state parameter for CSRF protection
 */
export function generateState(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Build Facebook OAuth URL
 */
export function buildFacebookOAuthUrl(state: string): string {
  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI || 
    `${process.env.NEXTAUTH_URL}/api/auth/facebook/callback`;

  if (!appId) {
    throw new Error('FACEBOOK_APP_ID not configured');
  }

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    state,
    scope: 'ads_read,business_management',
    response_type: 'code',
  });

  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
}

