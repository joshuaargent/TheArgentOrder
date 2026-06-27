/**
 * ConvertKit (Kit) API Integration
 * 
 * Handles email capture and newsletter subscription for The Argent Order.
 * 
 * Docs: https://developers.kit.com/
 * 
 * Uses V3 API for third-party integrations.
 */

const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3';

export interface ConvertKitSubscriber {
  id: number;
  email_address: string;
  state: 'active' | 'inactive' | 'bounced' | 'cancelled' | 'unconfirmed';
  created_at: string;
  first_name?: string;
}

export interface SubscribeOptions {
  email: string;
  first_name?: string;
  reactivate_if_exists?: boolean;
  send_welcome_email?: boolean;
  stage?: string;
}

export interface ConvertKitError {
  status: number;
  message: string;
}

/**
 * Get ConvertKit API key from environment
 * Use the V3 API Key for third-party integrations
 */
function getApiKey(): string {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  if (!apiKey) {
    throw new Error('CONVERTKIT_API_KEY is not set');
  }
  return apiKey;
}

/**
 * Get ConvertKit Form ID from environment
 */
function getFormId(): string {
  const formId = process.env.CONVERTKIT_FORM_ID;
  if (!formId) {
    throw new Error('CONVERTKIT_FORM_ID is not set');
  }
  return formId;
}

/**
 * Subscribe an email to the newsletter
 */
export async function subscribeToNewsletter(
  options: SubscribeOptions
): Promise<ConvertKitSubscriber | null> {
  try {
    const response = await fetch(`${CONVERTKIT_API_URL}/forms/${getFormId()}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: getApiKey(),
        email: options.email,
        firstName: options.first_name || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('ConvertKit subscribe error:', error);
      return null;
    }

    const data = await response.json();
    return data.subscriber as ConvertKitSubscriber;
  } catch (error) {
    console.error('ConvertKit subscribe failed:', error);
    return null;
  }
}

/**
 * Check if an email is subscribed
 */
export async function getSubscriber(email: string): Promise<ConvertKitSubscriber | null> {
  try {
    const response = await fetch(
      `${CONVERTKIT_API_URL}/subscribers?api_key=${getApiKey()}&email_address=${encodeURIComponent(email)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    // ConvertKit returns subscribers array, check if email matches
    const subscriber = data.subscribers?.find((s: ConvertKitSubscriber) => s.email_address === email);
    return subscriber || null;
  } catch (error) {
    console.error('ConvertKit get subscriber failed:', error);
    return null;
  }
}

/**
 * Unsubscribe an email from the newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  try {
    const response = await fetch(`${CONVERTKIT_API_URL}/unsubscribe`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: getApiKey(),
        email: email,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('ConvertKit unsubscribe failed:', error);
    return false;
  }
}

/**
 * Add subscriber to a tag
 */
export async function addTag(
  email: string,
  tagId: number
): Promise<boolean> {
  try {
    const response = await fetch(`${CONVERTKIT_API_URL}/tags/${tagId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: getApiKey(),
        email: email,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('ConvertKit add tag failed:', error);
    return false;
  }
}

/**
 * Cohort stages for The Argent Order onboarding funnel
 * (Using ConvertKit tags)
 */
export const COHORTS = {
  LEAD_MAGNET: 'lead_magnet_downloaded',
  APPLIED: 'applied',
  ACTIVE_MEMBER: 'active_member',
  FORMER_MEMBER: 'former_member',
} as const;

/**
 * Lead magnet options
 */
export const LEAD_MAGNETS = {
  CATHOLIC_BUILDER_STARTER: {
    id: 'catholic_builder_starter',
    name: 'Catholic Builder System',
    description: 'Instant access to Discord brotherhood + Portal with Rule of Life Builder, Campaigns, Pods, Daily Protocol',
    value: 'Priceless',
    cohort: 'catholic_builder_system_access',
  },
  FOUNDATION_PACK: {
    id: 'foundation_pack',
    name: 'Foundation Pack',
    description: 'Prayer Guide, Scripture Plan, Formation Roadmap',
    value: '$127',
    cohort: 'foundation_pack_downloaded',
  },
  DISCIPLINE_GUIDE: {
    id: 'discipline_guide',
    name: 'Discipline Guide',
    description: 'Habit system, Wake protocol, Focus system',
    value: '$97',
    cohort: 'discipline_guide_downloaded',
  },
} as const;
