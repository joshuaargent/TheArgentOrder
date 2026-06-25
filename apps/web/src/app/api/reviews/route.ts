import { NextResponse } from 'next/server';

// GET /api/reviews - Get user's reviews (weekly, monthly, quarterly)
export async function GET() {
  // In production, this would fetch from Supabase
  // For now, return mock data structure
  const now = new Date();
  
  // Get start of current week
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  // Get start of current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return NextResponse.json({
    reviews: [
      {
        id: 'weekly-current',
        review_type: 'weekly',
        week_start: weekStart.toISOString().split('T')[0],
        completed: false,
        score: null,
      },
      {
        id: 'monthly-current',
        review_type: 'monthly',
        week_start: monthStart.toISOString().split('T')[0],
        completed: false,
        score: null,
      },
    ],
  });
}

// POST /api/reviews - Submit a review
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { review_type, responses, score } = body;
    
    // In production, save to Supabase
    return NextResponse.json({
      success: true,
      review: {
        id: Date.now().toString(),
        review_type,
        responses,
        score,
        completed: true,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save review' },
      { status: 500 }
    );
  }
}
