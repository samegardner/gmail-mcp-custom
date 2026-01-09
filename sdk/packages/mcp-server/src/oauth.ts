import * as fs from 'fs';
import * as path from 'path';

// Token file location - same location as the Python script uses
const TOKEN_FILE = path.join(
  process.env['HOME'] || '',
  'Work/projects/Gmail MCP/.gmail-token.json'
);

interface TokenData {
  token: string;
  refresh_token: string;
  token_uri: string;
  client_id: string;
  client_secret: string;
  expiry: string;
  scopes?: string[];
}

interface RefreshResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

// Cache the token in memory to avoid reading file on every request
let cachedToken: TokenData | null = null;

/**
 * Gets a valid access token, refreshing if necessary.
 * Reads from ~/.gmail-token.json and auto-refreshes when expired.
 */
export async function getAccessToken(): Promise<string> {
  // Read token file if not cached
  if (!cachedToken) {
    cachedToken = readTokenFile();
  }

  // Check if token is expired (with 5 minute buffer)
  const expiryTime = new Date(cachedToken.expiry).getTime();
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5 minutes

  if (now >= expiryTime - bufferMs) {
    // Token is expired or about to expire, refresh it
    cachedToken = await refreshToken(cachedToken);
  }

  return cachedToken.token;
}

/**
 * Reads the token file from disk.
 */
function readTokenFile(): TokenData {
  if (!fs.existsSync(TOKEN_FILE)) {
    throw new Error(
      `Token file not found at ${TOKEN_FILE}. Run the Python script to authenticate first:\n` +
      `  cd "/Users/samgardner/Work/projects/Gmail MCP" && python get_gmail_token.py`
    );
  }

  const content = fs.readFileSync(TOKEN_FILE, 'utf-8');
  return JSON.parse(content) as TokenData;
}

/**
 * Refreshes the access token using the refresh token.
 */
async function refreshToken(tokenData: TokenData): Promise<TokenData> {
  const params = new URLSearchParams({
    client_id: tokenData.client_id,
    client_secret: tokenData.client_secret,
    refresh_token: tokenData.refresh_token,
    grant_type: 'refresh_token',
  });

  const response = await fetch(tokenData.token_uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to refresh token: ${response.status} ${response.statusText}\n${errorText}\n\n` +
      `You may need to re-authenticate. Run:\n` +
      `  cd "/Users/samgardner/Work/projects/Gmail MCP" && python get_gmail_token.py`
    );
  }

  const refreshResponse = (await response.json()) as RefreshResponse;

  // Calculate new expiry time
  const expiryDate = new Date(Date.now() + refreshResponse.expires_in * 1000);

  // Update token data
  const updatedTokenData: TokenData = {
    ...tokenData,
    token: refreshResponse.access_token,
    expiry: expiryDate.toISOString(),
  };

  // Save updated token to file
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(updatedTokenData, null, 2));

  return updatedTokenData;
}

/**
 * Clears the cached token, forcing a re-read from disk on next access.
 */
export function clearTokenCache(): void {
  cachedToken = null;
}
