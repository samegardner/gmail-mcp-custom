// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Messages extends APIResource {
  /**
   * Gets a specific message by ID, including headers, body, and attachments.
   */
  retrieve(id: string, params: MessageRetrieveParams, options?: RequestOptions): APIPromise<Message> {
    const { userId, ...query } = params;
    return this._client.get(path`/users/${userId}/messages/${id}`, { query, ...options });
  }

  /**
   * Lists messages in the user's mailbox. Use 'q' parameter for Gmail search
   * queries.
   */
  list(
    userID: string,
    query: MessageListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MessageListResponse> {
    return this._client.get(path`/users/${userID}/messages`, { query, ...options });
  }

  /**
   * Immediately and permanently deletes a message (cannot be undone).
   */
  delete(id: string, params: MessageDeleteParams, options?: RequestOptions): APIPromise<void> {
    const { userId } = params;
    return this._client.delete(path`/users/${userId}/messages/${id}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Gets a specific message attachment.
   */
  getAttachment(
    id: string,
    params: MessageGetAttachmentParams,
    options?: RequestOptions,
  ): APIPromise<MessageGetAttachmentResponse> {
    const { userId, messageId } = params;
    return this._client.get(path`/users/${userId}/messages/${messageId}/attachments/${id}`, options);
  }

  /**
   * Sends an email to recipients specified in To, Cc, and Bcc headers.
   */
  send(userID: string, body: MessageSendParams, options?: RequestOptions): APIPromise<Message> {
    return this._client.post(path`/users/${userID}/messages/send`, { body, ...options });
  }

  /**
   * Moves a message to the trash.
   */
  trash(id: string, params: MessageTrashParams, options?: RequestOptions): APIPromise<Message> {
    const { userId } = params;
    return this._client.post(path`/users/${userId}/messages/${id}/trash`, options);
  }
}

/**
 * An email message
 */
export interface Message {
  /**
   * The immutable message ID
   */
  id?: string;

  /**
   * The history record ID
   */
  historyId?: string;

  /**
   * Internal message creation timestamp (epoch ms)
   */
  internalDate?: string;

  /**
   * List of label IDs applied to this message
   */
  labelIds?: Array<string>;

  /**
   * A single MIME message part
   */
  payload?: MessagePart;

  /**
   * The entire email in RFC 2822 format, base64url encoded
   */
  raw?: string;

  /**
   * Estimated size in bytes
   */
  sizeEstimate?: number;

  /**
   * A short excerpt from the message body
   */
  snippet?: string;

  /**
   * The thread ID this message belongs to
   */
  threadId?: string;
}

/**
 * A single MIME message part
 */
export interface MessagePart {
  /**
   * The body of a MIME message part
   */
  body?: MessagePart.Body;

  /**
   * The filename of the attachment (if applicable)
   */
  filename?: string;

  /**
   * List of headers for this part
   */
  headers?: Array<MessagePart.Header>;

  /**
   * The MIME type of this part
   */
  mimeType?: string;

  /**
   * The part ID
   */
  partId?: string;

  /**
   * Child MIME parts (for multipart messages)
   */
  parts?: Array<MessagePart>;
}

export namespace MessagePart {
  /**
   * The body of a MIME message part
   */
  export interface Body {
    /**
     * Attachment ID for fetching attachment data
     */
    attachmentId?: string;

    /**
     * The body data, base64url encoded
     */
    data?: string;

    /**
     * Size of the body data in bytes
     */
    size?: number;
  }

  /**
   * A message header
   */
  export interface Header {
    /**
     * Header name (e.g., From, To, Subject)
     */
    name?: string;

    /**
     * Header value
     */
    value?: string;
  }
}

/**
 * Response for listing messages
 */
export interface MessageListResponse {
  /**
   * List of messages (only id and threadId populated)
   */
  messages?: Array<Message>;

  /**
   * Token for the next page of results
   */
  nextPageToken?: string;

  /**
   * Estimated total number of results
   */
  resultSizeEstimate?: number;
}

/**
 * The body of a MIME message part
 */
export interface MessageGetAttachmentResponse {
  /**
   * Attachment ID for fetching attachment data
   */
  attachmentId?: string;

  /**
   * The body data, base64url encoded
   */
  data?: string;

  /**
   * Size of the body data in bytes
   */
  size?: number;
}

export interface MessageRetrieveParams {
  /**
   * Path param: The user's email address. Use 'me' for the authenticated user.
   */
  userId: string;

  /**
   * Query param: The format to return the message in
   */
  format?: 'full' | 'metadata' | 'minimal' | 'raw';

  /**
   * Query param: When format is METADATA, only include these headers
   */
  metadataHeaders?: Array<string>;
}

export interface MessageListParams {
  /**
   * Include messages from SPAM and TRASH
   */
  includeSpamTrash?: boolean;

  /**
   * Only return messages with these label IDs
   */
  labelIds?: Array<string>;

  /**
   * Maximum number of messages to return (default 100, max 500)
   */
  maxResults?: number;

  /**
   * Page token for pagination
   */
  pageToken?: string;

  /**
   * Gmail search query (e.g., 'from:sender@example.com', 'is:unread',
   * 'subject:hello')
   */
  q?: string;
}

export interface MessageDeleteParams {
  /**
   * The user's email address. Use 'me' for the authenticated user.
   */
  userId: string;
}

export interface MessageGetAttachmentParams {
  /**
   * The user's email address. Use 'me' for the authenticated user.
   */
  userId: string;

  /**
   * The message ID containing the attachment
   */
  messageId: string;
}

export interface MessageSendParams {
  /**
   * The immutable message ID
   */
  id?: string;

  /**
   * The history record ID
   */
  historyId?: string;

  /**
   * Internal message creation timestamp (epoch ms)
   */
  internalDate?: string;

  /**
   * List of label IDs applied to this message
   */
  labelIds?: Array<string>;

  /**
   * A single MIME message part
   */
  payload?: MessagePart;

  /**
   * The entire email in RFC 2822 format, base64url encoded
   */
  raw?: string;

  /**
   * Estimated size in bytes
   */
  sizeEstimate?: number;

  /**
   * A short excerpt from the message body
   */
  snippet?: string;

  /**
   * The thread ID this message belongs to
   */
  threadId?: string;
}

export interface MessageTrashParams {
  /**
   * The user's email address. Use 'me' for the authenticated user.
   */
  userId: string;
}

export declare namespace Messages {
  export {
    type Message as Message,
    type MessagePart as MessagePart,
    type MessageListResponse as MessageListResponse,
    type MessageGetAttachmentResponse as MessageGetAttachmentResponse,
    type MessageRetrieveParams as MessageRetrieveParams,
    type MessageListParams as MessageListParams,
    type MessageDeleteParams as MessageDeleteParams,
    type MessageGetAttachmentParams as MessageGetAttachmentParams,
    type MessageSendParams as MessageSendParams,
    type MessageTrashParams as MessageTrashParams,
  };
}
