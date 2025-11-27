import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateClientToken } from '@/lib/client-tokens';
import { z } from 'zod';

const createClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
});

export async function GET() {
  try {
    await requireAdmin();

    const clients = await db.client.findMany({
      include: {
        connections: {
          select: {
            id: true,
            fbUserId: true,
            expiresAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    // Normalize empty email to undefined
    if (body.email === '') {
      body.email = undefined;
    }
    const parsed = createClientSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;
    const token = generateClientToken();

    const client = await db.client.create({
      data: {
        name: name.trim(),
        email: email ? email.trim() : null,
        token,
        active: true,
      },
      include: {
        connections: {
          select: {
            id: true,
            fbUserId: true,
            expiresAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

