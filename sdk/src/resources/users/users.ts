// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as DraftsAPI from './drafts';
import {
  Draft,
  DraftCreateParams,
  DraftDeleteParams,
  DraftListParams,
  DraftListResponse,
  DraftRetrieveParams,
  DraftSendParams,
  DraftUpdateParams,
  Drafts,
} from './drafts';
import * as MessagesAPI from './messages';
import {
  Message,
  MessageDeleteParams,
  MessageGetAttachmentParams,
  MessageGetAttachmentResponse,
  MessageListParams,
  MessageListResponse,
  MessagePart,
  MessageRetrieveParams,
  MessageSendParams,
  MessageTrashParams,
  Messages,
} from './messages';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Users extends APIResource {
  messages: MessagesAPI.Messages = new MessagesAPI.Messages(this._client);
  drafts: DraftsAPI.Drafts = new DraftsAPI.Drafts(this._client);

  /**
   * Gets the current user's Gmail profile (email address, message count, etc.)
   */
  getProfile(userID: string, options?: RequestOptions): APIPromise<UserGetProfileResponse> {
    return this._client.get(path`/users/${userID}/profile`, options);
  }
}

/**
 * User's Gmail profile information
 */
export interface UserGetProfileResponse {
  /**
   * The user's email address
   */
  emailAddress?: string;

  /**
   * The current history record ID
   */
  historyId?: string;

  /**
   * Total number of messages in the mailbox
   */
  messagesTotal?: number;

  /**
   * Total number of threads in the mailbox
   */
  threadsTotal?: number;
}

Users.Messages = Messages;
Users.Drafts = Drafts;

export declare namespace Users {
  export { type UserGetProfileResponse as UserGetProfileResponse };

  export {
    Messages as Messages,
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

  export {
    Drafts as Drafts,
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
