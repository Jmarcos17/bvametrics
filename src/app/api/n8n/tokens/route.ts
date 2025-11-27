import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import { isTokenExpired } from '@/lib/utils';

/**
 * API endpoint for n8n to fetch all active tokens
 * Protected by API key
 */
export async function GET() {
  try {
    // Verify API key
    const headersList = await headers();
    const apiKey = headersList.get('x-api-key');

    if (apiKey !== process.env.N8N_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connections = await db.facebookConnection.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const tokens = connections
      .filter((conn) => !isTokenExpired(conn.expiresAt))
      .map((conn) => {
        let accessToken = null;
        try {
          accessToken = decrypt(conn.encryptedAccessToken);
        } catch (error) {
          console.error('Error decrypting token:', error);
          return null;
        }

        return {
          userId: conn.userId,
          clientId: conn.clientId,
          userEmail: conn.user?.email,
          userName: conn.user?.name,
          clientName: conn.client?.name,
          clientEmail: conn.client?.email,
          fbUserId: conn.fbUserId,
          businessIds: conn.businessIds,
          adAccountIds: conn.adAccountIds,
          accessToken,
          expiresAt: conn.expiresAt,
          dataAccessExpiresAt: conn.dataAccessExpiresAt,
        };
      })
      .filter((token) => token !== null);

    return NextResponse.json(tokens);
  } catch (error) {
    console.error('Error fetching tokens for n8n:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}

