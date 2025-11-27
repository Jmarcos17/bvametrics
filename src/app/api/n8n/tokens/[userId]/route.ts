import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import { isTokenExpired } from '@/lib/utils';

/**
 * API endpoint for n8n to fetch token for a specific user
 * Protected by API key
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Verify API key
    const headersList = await headers();
    const apiKey = headersList.get('x-api-key');

    if (apiKey !== process.env.N8N_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    const connection = await db.facebookConnection.findFirst({
      where: { 
        OR: [
          { userId: userId },
          { clientId: userId }
        ]
      },
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

    if (!connection) {
      return NextResponse.json(
        { error: 'No connection found for user' },
        { status: 404 }
      );
    }

    if (isTokenExpired(connection.expiresAt)) {
      return NextResponse.json(
        { error: 'Token expired', expiresAt: connection.expiresAt },
        { status: 410 }
      );
    }

    let accessToken = null;
    try {
      accessToken = decrypt(connection.encryptedAccessToken);
    } catch (error) {
      console.error('Error decrypting token:', error);
      return NextResponse.json(
        { error: 'Failed to decrypt token' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      userId: connection.userId,
      clientId: connection.clientId,
      userEmail: connection.user?.email,
      userName: connection.user?.name,
      clientName: connection.client?.name,
      clientEmail: connection.client?.email,
      fbUserId: connection.fbUserId,
      businessIds: connection.businessIds,
      adAccountIds: connection.adAccountIds,
      accessToken,
      expiresAt: connection.expiresAt,
      dataAccessExpiresAt: connection.dataAccessExpiresAt,
    });
  } catch (error) {
    console.error('Error fetching token for n8n:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token' },
      { status: 500 }
    );
  }
}

