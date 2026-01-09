// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import GmailMcp from 'gmail-mcp';

const client = new GmailMcp({ baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010' });

describe('resource messages', () => {
  // Prism tests are disabled
  test.skip('retrieve: only required params', async () => {
    const responsePromise = client.users.messages.retrieve('id', { userId: 'userId' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('retrieve: required and optional params', async () => {
    const response = await client.users.messages.retrieve('id', {
      userId: 'userId',
      format: 'full',
      metadataHeaders: ['string'],
    });
  });

  // Prism tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.users.messages.list('userId');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.users.messages.list(
        'userId',
        {
          includeSpamTrash: true,
          labelIds: ['string'],
          maxResults: 0,
          pageToken: 'pageToken',
          q: 'q',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(GmailMcp.NotFoundError);
  });

  // Prism tests are disabled
  test.skip('delete: only required params', async () => {
    const responsePromise = client.users.messages.delete('id', { userId: 'userId' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('delete: required and optional params', async () => {
    const response = await client.users.messages.delete('id', { userId: 'userId' });
  });

  // Prism tests are disabled
  test.skip('getAttachment: only required params', async () => {
    const responsePromise = client.users.messages.getAttachment('id', {
      userId: 'userId',
      messageId: 'messageId',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('getAttachment: required and optional params', async () => {
    const response = await client.users.messages.getAttachment('id', {
      userId: 'userId',
      messageId: 'messageId',
    });
  });

  // Prism tests are disabled
  test.skip('send', async () => {
    const responsePromise = client.users.messages.send('userId', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('trash: only required params', async () => {
    const responsePromise = client.users.messages.trash('id', { userId: 'userId' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('trash: required and optional params', async () => {
    const response = await client.users.messages.trash('id', { userId: 'userId' });
  });
});
