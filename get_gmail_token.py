#!/usr/bin/env python3
"""
Gmail OAuth Token Helper

Gets an access token for Gmail API. First run opens browser for login.
Subsequent runs use stored refresh token.

Usage:
    python get_gmail_token.py          # Prints access token
    python get_gmail_token.py --json   # Prints full token info as JSON
"""

import json
import os
import sys
from pathlib import Path

# Google OAuth libraries
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

# Gmail API scopes
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.modify',
]

# File paths
SCRIPT_DIR = Path(__file__).parent
CREDENTIALS_FILE = SCRIPT_DIR / 'google-oauth-credentials.json'
TOKEN_FILE = SCRIPT_DIR / '.gmail-token.json'


def get_token():
    """Get a valid access token, refreshing or re-authenticating as needed."""
    creds = None

    # Load existing token if available
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    # If no valid credentials, get new ones
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            # Refresh the token
            creds.refresh(Request())
        else:
            # Run OAuth flow (opens browser)
            if not CREDENTIALS_FILE.exists():
                print(f"Error: Credentials file not found at {CREDENTIALS_FILE}", file=sys.stderr)
                sys.exit(1)

            flow = InstalledAppFlow.from_client_secrets_file(
                str(CREDENTIALS_FILE), SCOPES
            )
            creds = flow.run_local_server(port=0)

        # Save the token for future runs
        with open(TOKEN_FILE, 'w') as f:
            f.write(creds.to_json())

    return creds


def main():
    creds = get_token()

    if '--json' in sys.argv:
        print(json.dumps({
            'access_token': creds.token,
            'expires': creds.expiry.isoformat() if creds.expiry else None,
            'scopes': creds.scopes,
        }, indent=2))
    else:
        print(creds.token)


if __name__ == '__main__':
    main()
