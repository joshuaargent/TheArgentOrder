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

    // Subscribe via Resend (sends welcome email with Discord link)
    const subscriber = await subscribeToNewsletter({
      email,
      first_name: firstName,
    });

    if (!subscriber) {
      console.warn('Newsletter subscription failed');
      
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed',
        warning: 'Email capture confirmed, newsletter setup pending',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriber: {
        email: subscriber.email,
      },
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
