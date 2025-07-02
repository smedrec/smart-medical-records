import axios from 'axios';
import { URLSearchParams } from 'url';
import { SmartClientConfig, GetAuthUrlParams, AuthResponse, TokenResponse, RefreshTokenResponse } from './types';

export class SmartClient {
  private config: SmartClientConfig;

  constructor(config: SmartClientConfig) {
    this.config = config;
  }

  public getAuthorizationUrl(params: GetAuthUrlParams): string {
    const searchParams = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: params.scope,
    });

    if (params.state) {
      searchParams.append('state', params.state);
    }

    if (params.aud) {
      searchParams.append('aud', params.aud);
    }

    return `${this.config.authUrl}?${searchParams.toString()}`;
  }

  public handleAuthorizationResponse(query: { [key: string]: string | string[] | undefined }): AuthResponse {
    const { code, state } = query;

    if (typeof code !== 'string') {
      throw new Error('Invalid authorization response: missing or invalid code');
    }

    const response: AuthResponse = { code };

    if (state && typeof state === 'string') {
      response.state = state;
    }

    return response;
  }

  public async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
    });

    if (this.config.clientSecret) {
      params.append('client_secret', this.config.clientSecret);
    }

    try {
      const response = await axios.post<TokenResponse>(this.config.tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Failed to exchange code for token: ${error.response.status} ${error.response.data}`);
      }
      throw new Error('Failed to exchange code for token');
    }
  }

  public async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.config.clientId,
    });

    if (this.config.clientSecret) {
      params.append('client_secret', this.config.clientSecret);
    }

    try {
      const response = await axios.post<RefreshTokenResponse>(this.config.tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Failed to refresh access token: ${error.response.status} ${error.response.data}`);
      }
      throw new Error('Failed to refresh access token');
    }
  }
}