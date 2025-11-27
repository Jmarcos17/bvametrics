import type {
  FacebookBusiness,
  FacebookAdAccount,
  FacebookTokenResponse,
  FacebookLongLivedTokenResponse,
  FacebookUserInfo,
} from '@/types/facebook';

const FACEBOOK_GRAPH_API = 'https://graph.facebook.com/v19.0';

/**
 * Exchange OAuth code for access token
 */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<FacebookTokenResponse> {
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('Facebook OAuth credentials not configured');
  }

  const params = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirectUri,
    code,
  });

  const response = await fetch(
    `${FACEBOOK_GRAPH_API}/oauth/access_token?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Failed to exchange code: ${error.error?.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Exchange short-lived token for long-lived token (60 days)
 */
export async function getLongLivedToken(
  shortLivedToken: string
): Promise<FacebookLongLivedTokenResponse> {
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('Facebook OAuth credentials not configured');
  }

  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortLivedToken,
  });

  const response = await fetch(
    `${FACEBOOK_GRAPH_API}/oauth/access_token?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Failed to get long-lived token: ${error.error?.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Get user info from Facebook
 */
export async function getUserInfo(accessToken: string): Promise<FacebookUserInfo> {
  const response = await fetch(
    `${FACEBOOK_GRAPH_API}/me?fields=id,name,email&access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Failed to get user info: ${error.error?.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Get user's Business Managers
 */
export async function getBusinessManagers(accessToken: string): Promise<FacebookBusiness[]> {
  const response = await fetch(
    `${FACEBOOK_GRAPH_API}/me/businesses?access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Failed to get businesses: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Get Ad Accounts for a Business Manager
 */
export async function getAdAccounts(
  businessId: string,
  accessToken: string
): Promise<FacebookAdAccount[]> {
  const response = await fetch(
    `${FACEBOOK_GRAPH_API}/${businessId}/owned_ad_accounts?fields=id,name,account_id&access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Failed to get ad accounts: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Get all Ad Accounts for a user (across all Business Managers)
 */
export async function getAllAdAccounts(accessToken: string): Promise<FacebookAdAccount[]> {
  const businesses = await getBusinessManagers(accessToken);
  const allAdAccounts: FacebookAdAccount[] = [];

  for (const business of businesses) {
    try {
      const adAccounts = await getAdAccounts(business.id, accessToken);
      allAdAccounts.push(...adAccounts);
    } catch (error) {
      console.error(`Failed to get ad accounts for business ${business.id}:`, error);
      // Continue with other businesses
    }
  }

  return allAdAccounts;
}

/**
 * Get token expiration info
 */
export async function getTokenInfo(accessToken: string): Promise<{
  expires_at: number | null;
  data_access_expires_at: number | null;
}> {
  const response = await fetch(
    `${FACEBOOK_GRAPH_API}/debug_token?input_token=${accessToken}&access_token=${accessToken}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Failed to debug token: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const tokenData = data.data;

  return {
    expires_at: tokenData.expires_at || null,
    data_access_expires_at: tokenData.data_access_expires_at || null,
  };
}

