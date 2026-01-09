import { McpTool, Metadata, ToolCallResult, asTextContentResult, asErrorResult, HandlerFunction } from './types';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getAccessToken } from './oauth';
import GmailMcp from 'gmail-mcp';

/**
 * Converts markdown to HTML for email formatting.
 */
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Escape HTML entities first
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (``` ... ```) - must come before inline code
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre style="background-color: #f4f4f4; padding: 12px; border-radius: 4px; overflow-x: auto;"><code>${code.trim()}</code></pre>`;
  });

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code style="background-color: #f4f4f4; padding: 2px 6px; border-radius: 3px;">$1</code>');

  // Headers (## Header)
  html = html.replace(/^### (.+)$/gm, '<h3 style="margin-top: 20px; margin-bottom: 10px;">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="margin-top: 24px; margin-bottom: 12px;">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="margin-top: 28px; margin-bottom: 14px;">$1</h1>');

  // Bold (**text** or __text__)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic (*text* or _text_)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #0066cc;">$1</a>');

  // Unordered lists (- item)
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul style="margin: 10px 0; padding-left: 20px;">${match}</ul>`);

  // Ordered lists (1. item)
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Horizontal rules (---)
  html = html.replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">');

  // Paragraphs - convert double newlines to paragraph breaks
  html = html.replace(/\n\n/g, '</p><p style="margin: 12px 0;">');

  // Single newlines to <br>
  html = html.replace(/\n/g, '<br>');

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = `<p style="margin: 12px 0;">${html}</p>`;
  }

  return html;
}

/**
 * Creates an RFC 2822 email with HTML content.
 */
function createHtmlEmail(params: {
  from: string;
  to: string;
  subject: string;
  htmlBody: string;
  cc?: string;
  bcc?: string;
}): string {
  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substring(2)}`;

  const headers = [
    `From: ${params.from}`,
    `To: ${params.to}`,
    ...(params.cc ? [`Cc: ${params.cc}`] : []),
    ...(params.bcc ? [`Bcc: ${params.bcc}`] : []),
    `Subject: ${params.subject}`,
    'MIME-Version: 1.0',
    `Content-Type: text/html; charset=utf-8`,
    '',
  ];

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; }
    h1, h2, h3 { color: #222; }
    code { font-family: 'SF Mono', Monaco, 'Courier New', monospace; }
    pre { font-family: 'SF Mono', Monaco, 'Courier New', monospace; }
  </style>
</head>
<body>
${params.htmlBody}
</body>
</html>`;

  return headers.join('\r\n') + '\r\n' + htmlContent;
}

/**
 * Base64url encodes a string for Gmail API.
 */
function base64urlEncode(str: string): string {
  const base64 = Buffer.from(str, 'utf-8').toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * A tool for sending formatted HTML emails via Gmail.
 */
export function sendEmailTool(): McpTool {
  const metadata: Metadata = {
    resource: 'users.messages',
    operation: 'write',
    tags: ['email', 'send'],
    httpMethod: 'POST',
    httpPath: '/users/{userId}/messages/send'
  };

  const tool: Tool = {
    name: 'send_email',
    description:
      'Sends a formatted HTML email via Gmail. The body supports markdown formatting which will be converted to HTML:\n\n' +
      '- **Bold**: Use `**text**` or `__text__`\n' +
      '- *Italic*: Use `*text*` or `_text_`\n' +
      '- Headers: Use `# H1`, `## H2`, `### H3`\n' +
      '- Code: Use backticks for `inline code` or triple backticks for code blocks\n' +
      '- Lists: Use `- item` for bullet points\n' +
      '- Links: Use `[text](url)`\n\n' +
      'The email will be sent from the authenticated user\'s Gmail account.',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient email address (required)'
        },
        subject: {
          type: 'string',
          description: 'Email subject line (required)'
        },
        body: {
          type: 'string',
          description: 'Email body in markdown format - will be converted to HTML'
        },
        cc: {
          type: 'string',
          description: 'CC recipient email address (optional)'
        },
        bcc: {
          type: 'string',
          description: 'BCC recipient email address (optional)'
        }
      },
      required: ['to', 'subject', 'body']
    },
  };

  const handler: HandlerFunction = async (_client: GmailMcp, args: Record<string, unknown> | undefined): Promise<ToolCallResult> => {
    const to = args?.['to'] as string;
    const subject = args?.['subject'] as string;
    const body = args?.['body'] as string;
    const cc = args?.['cc'] as string | undefined;
    const bcc = args?.['bcc'] as string | undefined;

    if (!to || !subject || !body) {
      return asErrorResult('Missing required fields: to, subject, and body are required');
    }

    try {
      // Get access token
      const accessToken = await getAccessToken();

      // Get sender's email address
      const profileResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (!profileResponse.ok) {
        throw new Error(`Failed to get profile: ${profileResponse.status} ${profileResponse.statusText}`);
      }

      const profile = await profileResponse.json() as { emailAddress: string };
      const fromEmail = profile.emailAddress;

      // Convert markdown to HTML
      const htmlBody = markdownToHtml(body);

      // Create the email
      const emailParams: {
        from: string;
        to: string;
        subject: string;
        htmlBody: string;
        cc?: string;
        bcc?: string;
      } = {
        from: fromEmail,
        to,
        subject,
        htmlBody,
      };
      if (cc) emailParams.cc = cc;
      if (bcc) emailParams.bcc = bcc;

      const email = createHtmlEmail(emailParams);

      // Base64url encode
      const raw = base64urlEncode(email);

      // Send via Gmail API
      const sendResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw })
      });

      if (!sendResponse.ok) {
        const errorText = await sendResponse.text();
        throw new Error(`Failed to send email: ${sendResponse.status} ${sendResponse.statusText}\n${errorText}`);
      }

      const result = await sendResponse.json() as { id: string; threadId: string };

      return asTextContentResult({
        success: true,
        messageId: result.id,
        threadId: result.threadId,
        to,
        subject,
        message: 'Email sent successfully with HTML formatting'
      });

    } catch (error) {
      return asErrorResult(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return { metadata, tool, handler };
}
