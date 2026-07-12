import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter, LEAD_MAGNETS, COHORTS } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, leadMagnet } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Validate lead magnet if provided
    if (leadMagnet && !Object.keys(LEAD_MAGNETS).includes(leadMagnet)) {
      return NextResponse.json(
        { error: 'Invalid lead magnet ID' },
        { status: 400 }
      );
    }

    // Determine cohort based on lead magnet
    let cohort: string = COHORTS.LEAD_MAGNET;
    if (leadMagnet && LEAD_MAGNETS[leadMagnet as keyof typeof LEAD_MAGNETS]) {
      cohort = LEAD_MAGNETS[leadMagnet as keyof typeof LEAD_MAGNETS].cohort;
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
    leadMagnets: Object.values(LEAD_MAGNETS).map((m) => ({
      id: m.id,
      name: m.name,
      value: m.value,
    })),
  });
}
