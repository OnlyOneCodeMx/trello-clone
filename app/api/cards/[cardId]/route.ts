/**
 * Card Details API Route Handler
 *
 * This endpoint handles card detail retrieval with the following features:
 * - User and organization authorization validation
 * - Card data fetching with list title
 * - Security checks for organization access
 * - Error handling for unauthorized and failed requests
 *
 * @param req - Incoming request object
 * @param params - Route parameters containing cardId
 * @returns JSON response with card details or error message
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const { cardId } = await params;
  try {
    // Authenticate user and get organization ID
    const { userId, orgId } = await auth();

    // Check if user is authenticated and has organization access
    if (!userId || !orgId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch card with security check to ensure it belongs to user's organization
    const card = await db.card.findUnique({
      where: {
        id: cardId,
        list: {
          board: {
            orgId,
          },
        },
      },
      // Include list title for context
      include: {
        list: {
          select: {
            title: true,
          },
        },
      },
    });

    // Return card data as JSON
    return NextResponse.json(card);
  } catch {
    // Handle any errors during processing
    return new NextResponse('Internal Error', { status: 500 });
  }
}
