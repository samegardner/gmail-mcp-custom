# Users

Types:

- <code><a href="./src/resources/users/users.ts">UserGetProfileResponse</a></code>

Methods:

- <code title="get /users/{userId}/profile">client.users.<a href="./src/resources/users/users.ts">getProfile</a>(userID) -> UserGetProfileResponse</code>

## Messages

Types:

- <code><a href="./src/resources/users/messages.ts">Message</a></code>
- <code><a href="./src/resources/users/messages.ts">MessagePart</a></code>
- <code><a href="./src/resources/users/messages.ts">MessageListResponse</a></code>
- <code><a href="./src/resources/users/messages.ts">MessageGetAttachmentResponse</a></code>

Methods:

- <code title="get /users/{userId}/messages/{id}">client.users.messages.<a href="./src/resources/users/messages.ts">retrieve</a>(id, { ...params }) -> Message</code>
- <code title="get /users/{userId}/messages">client.users.messages.<a href="./src/resources/users/messages.ts">list</a>(userID, { ...params }) -> MessageListResponse</code>
- <code title="delete /users/{userId}/messages/{id}">client.users.messages.<a href="./src/resources/users/messages.ts">delete</a>(id, { ...params }) -> void</code>
- <code title="get /users/{userId}/messages/{messageId}/attachments/{id}">client.users.messages.<a href="./src/resources/users/messages.ts">getAttachment</a>(id, { ...params }) -> MessageGetAttachmentResponse</code>
- <code title="post /users/{userId}/messages/send">client.users.messages.<a href="./src/resources/users/messages.ts">send</a>(userID, { ...params }) -> Message</code>
- <code title="post /users/{userId}/messages/{id}/trash">client.users.messages.<a href="./src/resources/users/messages.ts">trash</a>(id, { ...params }) -> Message</code>

## Drafts

Types:

- <code><a href="./src/resources/users/drafts.ts">Draft</a></code>
- <code><a href="./src/resources/users/drafts.ts">DraftListResponse</a></code>

Methods:

- <code title="post /users/{userId}/drafts">client.users.drafts.<a href="./src/resources/users/drafts.ts">create</a>(userID, { ...params }) -> Draft</code>
- <code title="get /users/{userId}/drafts/{id}">client.users.drafts.<a href="./src/resources/users/drafts.ts">retrieve</a>(id, { ...params }) -> Draft</code>
- <code title="put /users/{userId}/drafts/{id}">client.users.drafts.<a href="./src/resources/users/drafts.ts">update</a>(pathID, { ...params }) -> Draft</code>
- <code title="get /users/{userId}/drafts">client.users.drafts.<a href="./src/resources/users/drafts.ts">list</a>(userID, { ...params }) -> DraftListResponse</code>
- <code title="delete /users/{userId}/drafts/{id}">client.users.drafts.<a href="./src/resources/users/drafts.ts">delete</a>(id, { ...params }) -> void</code>
- <code title="post /users/{userId}/drafts/send">client.users.drafts.<a href="./src/resources/users/drafts.ts">send</a>(userID, { ...params }) -> Message</code>
