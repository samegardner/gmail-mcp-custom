import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { initMcpServer, newMcpServer } from './server';

export const launchStdioServer = async () => {
  const server = newMcpServer();

  // Read auth token from environment variable
  const accessToken = process.env['GMAIL_ACCESS_TOKEN'];
  const clientOptions = accessToken
    ? { defaultHeaders: { Authorization: `Bearer ${accessToken}` } }
    : {};

  initMcpServer({ server, clientOptions });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server running on stdio');
};
