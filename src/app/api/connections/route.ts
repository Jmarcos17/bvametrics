import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import { isTokenExpired } from '@/lib/utils';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connections = await db.facebookConnection.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Decrypt tokens and format response
    const formattedConnections = connections.map((conn) => {
      let accessToken = null;
      try {
        accessToken = decrypt(conn.encryptedAccessToken);
      } catch (error) {
        console.error('Error decrypting token:', error);
      }

      return {
        id: conn.id,
        fbUserId: conn.fbUserId,
        businessIds: conn.businessIds,
        adAccountIds: conn.adAccountIds,
        expiresAt: conn.expiresAt,
        dataAccessExpiresAt: conn.dataAccessExpiresAt,
        createdAt: conn.createdAt,
        updatedAt: conn.updatedAt,
        isExpired: isTokenExpired(conn.expiresAt),
        // Only include token if explicitly needed (for admin/n8n)
        ...(session.user.role === 'ADMIN' && { accessToken }),
      };
    });

    return NextResponse.json(formattedConnections);
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Connection is created via OAuth callback, not directly
  return NextResponse.json(
    { error: 'Use OAuth flow to create connections' },
    { status: 405 }
  );
}

