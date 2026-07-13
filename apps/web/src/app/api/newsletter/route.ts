import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Try to send welcome email (optional - will fail silently if Resend not configured)
    try {
      await subscribeToNewsletter({
        email,
        first_name: firstName,
      });
    } catch (emailError) {
      // Email is optional - log but don't fail the subscription
      console.warn('Welcome email could not be sent (Resend may not be configured):', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully signed up! Check your email for the Discord invite.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Newsletter subscription API (Resend)',
    endpoints: {
      POST: 'Subscribe to newsletter',
    },
  });
}
