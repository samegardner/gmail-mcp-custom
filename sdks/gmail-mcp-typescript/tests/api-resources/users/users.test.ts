// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import GmailMcp from 'gmail-mcp';

const client = new GmailMcp({ baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010' });

describe('resource users', () => {
  // Prism tests are disabled
  test.skip('getProfile', async () => {
    const responsePromise = client.users.getProfile('userId');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
