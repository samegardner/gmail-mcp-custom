// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as MessagesAPI from './messages';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Drafts extends APIResource {
  /**
   * Creates a new draft email.
   */
  create(userID: string, body: DraftCreateParams, options?: RequestOptions): APIPromise<Draft> {
    return this._client.post(path`/users/${userID}/drafts`, { body, ...options });
  }

  /**
   * Gets a specific draft by ID.
   */
  retrieve(id: string, params: DraftRetrieveParams, options?: RequestOptions): APIPromise<Draft> {
    const { userId, ...query } = params;
    return this._client.get(path`/users/${userId}/drafts/${id}`, { query, ...options });
  }

  /**
   * Replaces a draft's content.
   */
  update(pathID: string, params: DraftUpdateParams, options?: RequestOptions): APIPromise<Draft> {
    const { userId, ...body } = params;
    return this._client.put(path`/users/${userId}/drafts/${pathID}`, { body, ...options });
  }

  /**
   * Lists drafts in the user's mailbox.
   */
  list(
    userID: string,
    query: DraftListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<DraftListResponse> {
    return this._client.get(path`/users/${userID}/drafts`, { query, ...options });
  }

  /**
   * Immediately and permanently deletes a draft.
   */
  delete(id: string, params: DraftDeleteParams, options?: RequestOptions): APIPromise<void> {
    const { userId } = params;
    return this._client.delete(path`/users/${userId}/drafts/${id}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Sends a draft to the recipients in To, Cc, and Bcc headers.
   */
  send(userID: string, body: DraftSendParams, options?: RequestOptions): APIPromise<MessagesAPI.Message> {
    return this._client.post(path`/users/${userID}/drafts/send`, { body, ...options });
  }
}

/**
 * A draft email message
 */
export interface Draft {
  /**
   * The draft ID
   */
  id?: string;

  /**
   * An email message
   */
  message?: MessagesAPI.Message;
}

/**
 * Response for listing drafts
 */
export interface DraftListResponse {
  /**
   * List of drafts
   */
  drafts?: Array<Draft>;

  /**
   * Token for the next page of results
   */
  nextPageToken?: string;

  /**
   * Estimated total number of results
   */
  resultSizeEstimate?: number;
}

export interface DraftCreateParams {
  /**
   * The draft ID
   */
  id?: string;

  /**
   * An email message
   */
  message?: MessagesAPI.Message;
}

export interface DraftRetrieveParams {
  /**
   * Path param: The user's email address. Use 'me' for the authenticated user.
   */
  userId: string;

  /**
   * Query param: The format to return the draft in
   */
  format?: 'full' | 'metadata' | 'minimal' | 'raw';
}

export interface DraftUpdateParams {
  /**
   * Path param: The user's email address. Use 'me' for the authenticated user.
   */
  userId: string;

  /**
   * Body param: The draft ID
   */
  body_id?: string;

  /**
   * Body param: An email message
   */
  message?: MessagesAPI.Message;
}

export interface DraftListParams {
  /**
   * Maximum number of drafts to return
   */
  maxResults?: number;

  /**
   * Page token for pagination
   */
  pageToken?: string;

  /**
   * Gmail search query to filter drafts
   */
  q?: string;
}

export interface DraftDeleteParams {
  /**
   * The user's email address. Use 'me' for the authenticated user.
   */
  userId: string;
}

export interface DraftSendParams {
  /**
   * The draft ID
   */
  id?: string;

  /**
   * An email message
   */
  message?: MessagesAPI.Message;
}

export declare namespace Drafts {
  export {
    type Draft as Draft,
    type DraftListResponse as DraftListResponse,
    type DraftCreateParams as DraftCreateParams,
    type DraftRetrieveParams as DraftRetrieveParams,
    type DraftUpdateParams as DraftUpdateParams,
    type DraftListParams as DraftListParams,
    type DraftDeleteParams as DraftDeleteParams,
    type DraftSendParams as DraftSendParams,
  };
}
