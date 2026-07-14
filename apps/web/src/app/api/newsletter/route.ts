import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const DISCORD_INVITE_URL = 'https://discord.gg/JzjtyeW7hS';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS for newsletter signup
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert email into newsletter_subscribers table
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email: email.toLowerCase().trim() },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('Newsletter subscription error:', error);
      // Don't fail the request if email already exists (upsert)
      if (error.code !== '23505') {
        return NextResponse.json(
          { error: 'Failed to subscribe. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully signed up!',
      discordLink: DISCORD_INVITE_URL,
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
    message: 'Newsletter signup API',
    discordLink: DISCORD_INVITE_URL,
    endpoints: {
      POST: 'Subscribe to newsletter',
    },
  });
}
