export interface FacebookBusiness {
  id: string;
  name: string;
}

export interface FacebookAdAccount {
  id: string;
  name: string;
  account_id: string;
}

export interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface FacebookLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface FacebookUserInfo {
  id: string;
  name: string;
  email?: string;
}

export interface FacebookConnectionData {
  fbUserId: string;
  businessIds: string[];
  adAccountIds: string[];
  accessToken: string;
  expiresAt: Date | null;
  dataAccessExpiresAt: Date | null;
}

