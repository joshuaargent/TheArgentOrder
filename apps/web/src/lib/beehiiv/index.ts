/**
 * Beehiiv API Integration
 * 
 * Handles email capture and newsletter subscription for The Argent Order.
 * 
 * Docs: https://developers.beehiiv.com/
 */

const BEEHIIV_API_URL = 'https://api.beehiiv.com/v2';

export interface BeehiivSubscriber {
  id: string;
  email: string;
  status: 'active' | 'inactive' | 'bounced' | 'unsubscribed';
  created_at: string;
  cohorts?: string[];
}

export interface SubscribeOptions {
  email: string;
  first_name?: string;
  reactivate_if_exists?: boolean;
  send_welcome_email?: boolean;
  stage?: string;
}

export interface BeehiivError {
  status: number;
  message: string;
}

/**
 * Get Beehiiv API key from environment
 */
function getApiKey(): string {
  const apiKey = process.env.BEEHIIV_API_KEY;
  if (!apiKey) {
    throw new Error('BEEHIIV_API_KEY is not set');
  }
  return apiKey;
}

/**
 * Get Beehiiv Publication ID from environment
 */
function getPublicationId(): string {
  const pubId = process.env.NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID;
  if (!pubId) {
    throw new Error('NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID is not set');
  }
  return pubId;
}

/**
 * Subscribe an email to the newsletter
 */
export async function subscribeToNewsletter(
  options: SubscribeOptions
): Promise<BeehiivSubscriber | null> {
  try {
    const response = await fetch(`${BEEHIIV_API_URL}/publications/${getPublicationId()}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: options.email,
        reactivate_if_exists: options.reactivate_if_exists ?? true,
        send_welcome_email: options.send_welcome_email ?? false,
        ...(options.first_name && { first_name: options.first_name }),
        ...(options.stage && { cohort_metadata: [{ stage: options.stage }] }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Beehiiv subscribe error:', error);
      return null;
    }

    const data = await response.json();
    return data.data as BeehiivSubscriber;
  } catch (error) {
    console.error('Beehiiv subscribe failed:', error);
    return null;
  }
}

/**
 * Check if an email is subscribed
 */
export async function getSubscriber(email: string): Promise<BeehiivSubscriber | null> {
  try {
    const response = await fetch(
      `${BEEHIIV_API_URL}/publications/${getPublicationId()}/subscriptions/${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Bearer ${getApiKey()}`,
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data as BeehiivSubscriber;
  } catch (error) {
    console.error('Beehiiv get subscriber failed:', error);
    return null;
  }
}

/**
 * Unsubscribe an email from the newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${BEEHIIV_API_URL}/publications/${getPublicationId()}/subscriptions/${encodeURIComponent(email)}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getApiKey()}`,
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Beehiiv unsubscribe failed:', error);
    return false;
  }
}

/**
 * Add subscriber to a cohort (stage/tag)
 */
export async function addToCohort(
  email: string,
  cohort: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${BEEHIIV_API_URL}/publications/${getPublicationId()}/subscriptions/${encodeURIComponent(email)}/cohorts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getApiKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cohort }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Beehiiv add to cohort failed:', error);
    return false;
  }
}

/**
 * Cohort stages for The Argent Order onboarding funnel
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
    name: 'Catholic Builder Starter Kit',
    description: 'Rule of Life template, 90-Day Campaign Planner, Morning Protocol, Catholic Man\'s Oath',
    value: '$247',
    cohort: 'starter_kit_downloaded',
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
