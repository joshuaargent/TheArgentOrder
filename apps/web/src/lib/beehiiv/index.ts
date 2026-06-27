/**
 * Resend API Integration
 * 
 * Handles sending welcome emails with Discord invite links.
 * 
 * Docs: https://resend.com/docs
 */

const RESEND_API_URL = 'https://api.resend.com';

export interface ResendSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface EmailOptions {
  to: string;
  first_name?: string;
}

/**
 * Get Resend API key from environment
 */
function getApiKey(): string {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }
  return apiKey;
}

/**
 * Get the Discord invite link from environment
 */
function getDiscordInviteUrl(): string {
  return process.env.DISCORD_INVITE_URL || 'https://discord.gg/YOUR_DISCORD_LINK';
}

/**
 * Send welcome email with Discord invite link
 */
export async function sendWelcomeEmail(options: EmailOptions): Promise<boolean> {
  try {
    const discordLink = getDiscordInviteUrl();
    
    const response = await fetch(`${RESEND_API_URL}/emails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Argent Order <onboarding@resend.dev>',
        to: options.to,
        subject: 'Welcome to The Argent Order',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a;">Welcome, Brother.</h1>
            
            <p style="color: #333; line-height: 1.6;">
              You've taken the first step toward something different.
            </p>
            
            <p style="color: #333; line-height: 1.6;">
              This isn't another Catholic community where you consume content and feel good.
            </p>
            
            <p style="color: #333; line-height: 1.6;">
              <strong>This is a forge.</strong>
            </p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #333; margin: 0 0 15px 0;">
                <strong>JOIN DISCORD NOW</strong>
              </p>
              <a href="${discordLink}" style="display: inline-block; background: #5865F2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Click to Join
              </a>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 12px;">
                Or copy this link: ${discordLink}
              </p>
            </div>
            
            <p style="color: #333; line-height: 1.6;">
              Your portal activation will come after you join. That's how we know you're serious.
            </p>
            
            <p style="color: #333; line-height: 1.6;">
              <strong>Execute. Build. Lead.</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #666; font-size: 14px;">
              - The Argent Order
            </p>
          </div>
        `,
        text: `
Welcome, Brother.

You've taken the first step toward something different.

This isn't another Catholic community where you consume content and feel good.

This is a forge.

JOIN DISCORD NOW: ${discordLink}

Your portal activation will come after you join. That's how we know you're serious.

Execute. Build. Lead.

- The Argent Order
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend email error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Resend email failed:', error);
    return false;
  }
}

/**
 * Subscribe to newsletter (sends welcome email)
 */
export async function subscribeToNewsletter(
  options: { email: string; first_name?: string }
): Promise<{ id: string; email: string } | null> {
  const sent = await sendWelcomeEmail({
    to: options.email,
    first_name: options.first_name,
  });

  if (!sent) {
    return null;
  }

  return {
    id: 'subscribed',
    email: options.email,
  };
}

export async function getSubscriber(email: string): Promise<{ id: string; email: string } | null> {
  return null;
}

export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  return true;
}

export async function addTag(email: string, tagId: number): Promise<boolean> {
  return true;
}

export const COHORTS = {
  LEAD_MAGNET: 'lead_magnet_downloaded',
  APPLIED: 'applied',
  ACTIVE_MEMBER: 'active_member',
  FORMER_MEMBER: 'former_member',
} as const;

export const LEAD_MAGNETS = {
  CATHOLIC_BUILDER_STARTER: {
    id: 'catholic_builder_starter',
    name: 'Catholic Builder System',
    description: 'Instant access to Discord brotherhood + Portal with Rule of Life Builder, Campaigns, Pods, Daily Protocol',
    value: 'Priceless',
    cohort: 'catholic_builder_system_access',
  },
} as const;
