import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import {
  exchangeCodeForToken,
  getLongLivedToken,
  getUserInfo,
  getAllAdAccounts,
  getBusinessManagers,
  getTokenInfo,
} from '@/lib/facebook-api';
import { encrypt } from '@/lib/encryption';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check if this is a client connection (has client token in cookie)
    const clientToken = cookies().get('facebook_oauth_client_token')?.value;
    const isClientConnection = !!clientToken;

    // For admin connections, require session
    if (!isClientConnection && !session?.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (error) {
      if (isClientConnection) {
        return NextResponse.redirect(
          new URL(`/connect/${clientToken}?error=${error}`, request.url)
        );
      }
      return NextResponse.redirect(
        new URL(`/dashboard/connect?error=${error}`, request.url)
      );
    }

    if (!code || !state) {
      if (isClientConnection) {
        return NextResponse.redirect(
          new URL(`/connect/${clientToken}?error=missing_params`, request.url)
        );
      }
      return NextResponse.redirect(
        new URL('/dashboard/connect?error=missing_params', request.url)
      );
    }

    // Validate state (state may contain client token separated by :)
    const storedState = cookies().get('facebook_oauth_state')?.value;
    const stateParts = state.split(':');
    const actualState = stateParts[0];
    
    if (!storedState || storedState !== actualState) {
      if (isClientConnection) {
        return NextResponse.redirect(
          new URL(`/connect/${clientToken}?error=invalid_state`, request.url)
        );
      }
      return NextResponse.redirect(
        new URL('/dashboard/connect?error=invalid_state', request.url)
      );
    }

    // Clear state cookies
    cookies().delete('facebook_oauth_state');
    if (isClientConnection) {
      cookies().delete('facebook_oauth_client_token');
    }

    const redirectUri =
      process.env.FACEBOOK_REDIRECT_URI ||
      `${process.env.NEXTAUTH_URL}/api/auth/facebook/callback`;

    // Exchange code for short-lived token
    const tokenResponse = await exchangeCodeForToken(code, redirectUri);

    // Get long-lived token (60 days)
    const longLivedTokenResponse = await getLongLivedToken(
      tokenResponse.access_token
    );

    // Get user info
    const userInfo = await getUserInfo(longLivedTokenResponse.access_token);

    // Get Business Managers
    const businesses = await getBusinessManagers(
      longLivedTokenResponse.access_token
    );

    // Get all Ad Accounts
    const adAccounts = await getAllAdAccounts(
      longLivedTokenResponse.access_token
    );

    // Get token expiration info
    const tokenInfo = await getTokenInfo(
      longLivedTokenResponse.access_token
    );

    // Encrypt token
    const encryptedToken = encrypt(longLivedTokenResponse.access_token);

    // Calculate expiration dates
    const expiresAt = tokenInfo.expires_at
      ? new Date(tokenInfo.expires_at * 1000)
      : null;
    const dataAccessExpiresAt = tokenInfo.data_access_expires_at
      ? new Date(tokenInfo.data_access_expires_at * 1000)
      : null;

    // Save or update connection
    if (isClientConnection) {
      // Verify client token is still valid
      const client = await db.client.findUnique({
        where: { token: clientToken, active: true },
      });

      if (!client) {
        return NextResponse.redirect(
          new URL(`/connect/${clientToken}?error=invalid_client`, request.url)
        );
      }

      // Create connection for client (allow multiple connections per client)
      await db.facebookConnection.create({
        data: {
          clientId: client.id,
          fbUserId: userInfo.id,
          businessIds: businesses.map((b) => b.id),
          adAccountIds: adAccounts.map((a) => a.account_id),
          encryptedAccessToken: encryptedToken,
          expiresAt,
          dataAccessExpiresAt,
        },
      });

      return NextResponse.redirect(
        new URL(`/connect/${clientToken}?success=true`, request.url)
      );
    } else {
      // Admin connection - find existing or create new
      const existing = await db.facebookConnection.findFirst({
        where: { userId: session.user.id },
      });

      if (existing) {
        await db.facebookConnection.update({
          where: { id: existing.id },
          data: {
            fbUserId: userInfo.id,
            businessIds: businesses.map((b) => b.id),
            adAccountIds: adAccounts.map((a) => a.account_id),
            encryptedAccessToken: encryptedToken,
            expiresAt,
            dataAccessExpiresAt,
          },
        });
      } else {
        await db.facebookConnection.create({
          data: {
            userId: session.user.id,
            fbUserId: userInfo.id,
            businessIds: businesses.map((b) => b.id),
            adAccountIds: adAccounts.map((a) => a.account_id),
            encryptedAccessToken: encryptedToken,
            expiresAt,
            dataAccessExpiresAt,
          },
        });
      }

      return NextResponse.redirect(
        new URL('/dashboard?connected=true', request.url)
      );
    }
  } catch (error) {
    console.error('Error in Facebook OAuth callback:', error);
    const clientToken = cookies().get('facebook_oauth_client_token')?.value;
    
    if (clientToken) {
      return NextResponse.redirect(
        new URL(
          `/connect/${clientToken}?error=${encodeURIComponent(
            error instanceof Error ? error.message : 'unknown_error'
          )}`,
          request.url
        )
      );
    }
    
    return NextResponse.redirect(
      new URL(
        `/dashboard/connect?error=${encodeURIComponent(
          error instanceof Error ? error.message : 'unknown_error'
        )}`,
        request.url
      )
    );
  }
}

