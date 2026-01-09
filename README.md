# Gmail MCP Server

A custom Gmail MCP (Model Context Protocol) server that enables AI assistants like Claude to interact with your Gmail account. Includes OAuth authentication handling and custom tools like `send_email` with markdown-to-HTML formatting.

Built with [Stainless](https://www.stainless.com/).

## Features

- **OAuth Integration** - Automatic token refresh, secure credential handling
- **`send_email` Tool** - Send formatted HTML emails using markdown syntax
- **`execute` Tool** - Run arbitrary code against the Gmail API
- **`search_docs` Tool** - Search SDK documentation

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/samegardner/gmail-mcp-custom.git
cd gmail-mcp-custom
```

### 2. Set up Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Gmail API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Gmail API" and enable it
4. Create OAuth credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Choose **Desktop app** as the application type
   - Download the JSON file
5. Save the downloaded file as `google-oauth-credentials.json` in the repo root

### 3. Get your Gmail token

Install the Python dependencies and run the auth script:

```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2
python get_gmail_token.py
```

This will:
- Open your browser for Google login
- Ask you to authorize Gmail access
- Save your tokens to `.gmail-token.json` (automatically refreshed)

### 4. Build the MCP server

```bash
cd sdk
pnpm install
cd packages/mcp-server
pnpm run build
```

### 5. Configure Claude Code

Add the MCP server to your Claude configuration. Edit `~/.claude.json` (or your MCP config file):

```json
{
  "mcpServers": {
    "gmail-mcp": {
      "command": "node",
      "args": ["/full/path/to/gmail-mcp-custom/sdk/packages/mcp-server/dist/index.js"]
    }
  }
}
```

Replace `/full/path/to/` with the actual path on your system.

### 6. Restart Claude and verify

Restart Claude Code, then run:

```
/mcp
```

You should see `gmail-mcp` listed as connected.

---

## Available Tools

### `send_email`

Send formatted HTML emails with markdown support:

```
To: someone@example.com
Subject: Hello
Body:
## This is a header

Here's some **bold** and *italic* text.

- Bullet point 1
- Bullet point 2

`code snippet`
```

Supported markdown:
- `**bold**` or `__bold__`
- `*italic*` or `_italic_`
- `# H1`, `## H2`, `### H3` headers
- `` `inline code` `` and ``` code blocks ```
- `- bullet lists`
- `[link text](url)`
- `---` horizontal rules

### `execute`

Run arbitrary JavaScript against the Gmail SDK:

```javascript
async function run(client) {
  const authedClient = client.withOptions({
    defaultHeaders: { 'Authorization': `Bearer ${process.env.GMAIL_ACCESS_TOKEN}` }
  });

  const messages = await authedClient.users.messages.list('me', { maxResults: 5 });
  return messages;
}
```

### `search_docs`

Search the SDK documentation for API methods and usage examples.

---

## Troubleshooting

### Token expired or invalid

Re-run the auth script:

```bash
python get_gmail_token.py
```

### MCP not connecting

1. Check the path in your Claude config is correct
2. Make sure you've built the server (`pnpm run build`)
3. Restart Claude Code after config changes

### Permission denied errors

Make sure your Google Cloud OAuth consent screen includes the required scopes:
- `gmail.readonly`
- `gmail.send`
- `gmail.compose`
- `gmail.modify`

---

## Project Structure

```
gmail-mcp-custom/
├── google-oauth-credentials.json  # Your OAuth client credentials (create this)
├── .gmail-token.json              # Auto-generated tokens (gitignored)
├── get_gmail_token.py             # OAuth helper script
└── sdk/
    └── packages/
        └── mcp-server/
            └── src/
                ├── oauth.ts           # Token refresh logic
                ├── send-email-tool.ts # Custom send_email tool
                ├── code-tool.ts       # Execute tool
                └── server.ts          # MCP server setup
```

---

## Security Notes

- `google-oauth-credentials.json` and `.gmail-token.json` are gitignored
- Never commit credentials to version control
- Tokens are automatically refreshed when expired

---

## License

Apache-2.0
