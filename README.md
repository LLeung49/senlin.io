# Senlin Service API

The Senlin service is the place to manage users, cards, memories and tags. It has two main APIs - a mangement API to create and modify users, cards, and tags and a syncing API for clients to sync memories to and from the service. This architecture was chosen so that clients could run offline as much as possible. 


# Databases

There is a card table which will contain all cards in the Senlin system. Each will have a UUID, a front, a back and a set of tags.
There is a user table which will contain all users in the Senlin system. Each will have a UUID, an email, a password hash and a set of tags.
There is a memories table which will contain all memories in the Senlin system. Each will have a UUID, a timestamp, a card ID, a correct field and the time taken on the card.

There are user-specific views of the database. Given a user id, the user specific view of the database contains a card table with all of the cards which match the user's tags, and a memories table which
contains all of the memories for that user. 

There are card-specific views of a memories table. Given a card ID, and a user-specific memory table, the card-specific view contains just the memories of that card by that user.

There is a pure function which takes in a card-specific view of the memory table of a user and returns the optimum revision time for that card. 

All of the revision times together form a revision table. Each entry in this table will contain a card ID and a timestamp indicating the optimum time to revise that card.

The revision schedule is consumed by a revision client - which can be a web app, phone app or a purpose-built revision device. This will show the user words as close as possible to the optimum revision 
times. Each time a card is revised, a new memory is created. Creating a new memory will then modify the revision time for that card.


# Revision Process

When a card is revised, a new memory is created and inserted into the database. The revision schedule for that card and that user is recalculated. Then the next card in the revision schedule is chosen and
displayed to the user.

The revision client attempts to sync with the Senlin Service each time it creates a new memory. If it is unable to sync due to connectivity issues, the revision client continues to show the user new cards. The
revision client then periodically attempts to sync with the server. 

When choosing a card to revise, the revision client first tries to show the card with the earliest revision time. If the revision time of the current card is in the future, the client should indicate that the 
user is revising cards scheduled for the future.


# Managing Cards

A user can add tags to their account in order to choose which cards to study. For example, a user can add the "mandarin-english/fruit" tag to their account to study the mandarin to english flash cards for fruit.
When a tag is added to a user's account, the list of cards in the user-specific database view will contain all cards which contain the "mandarin-english/fruit" tag. 

When there are new cards that haven't been revised yet, the revision client schedules them for the first revision. <TODO define how>

# Sync API

This API is used for clients to sync with the senlin service.

Request:

```
POST /sync

Cookie: user=<user_id>&session_id=<session_id>

{
	"sync_version": "1.0",
	"hash_type": "CRC",
	"last_sync_hash": "<sync_hash>", 
	"diff": { 
		"memories": [
			{"timestamp": "<timestamp>", "correct": "true", "time_taken": 2.53}, 
			...
		]
	}
}
```

Response:

```
HTTP 200 OK

{
	"sync_version": "1.0",
	"hash_type": "CRC-32",
	"last_sync_hash": "<sync_hash>", 
	"new_sync_hash": "<new_sync_hash>",
	"diff": { 
		"memories": [
			{"timestamp": "1491693776.231", "correct": true, "time_taken": 2.53}, 
			...
		]
	}
}
```

# Sync Hashes


Take all of the memories, order them by timestamp (then memory id if there are collisions).
Serialize each memory to be of the form:

`<memory_id> <timestamp to 3 decimal places> <card_id> <correct true or false> <time_taken in seconds to 3 decimal places>`

Then concatenate all memories with newline characters in between and calculate the CRC32 hash of the resultant string.

For example:
```
c21746fb-c4ab-4e22-971a-8a18e6a7cb99 1491694736.213 ff694581-85a0-46b9-89fe-61f5a9fd8e39 true 4.282
2438e1af-e1b6-48b1-a793-9391b61ef4de 1491694800.120 110030b8-d950-4257-8ebe-bc586ab89fb5 false 1.293
a9ee8909-80a5-4a86-873a-163098ff0f9d 1491694826.012 9dc7ba58-8ea2-424a-935d-69b26923f7fc false 12.301
```
The memory hash is therefore `27EED97B`

Take all of the cards, order them by card_id.
Serialize each card to be of the form:

`<card_id> <front (utf-8 encoded)> <back (utf-8 encoded)>`

Then concatenate all cards with newline characters in between and calculate the CRC32 hash of the resultant string.

For example

```
ff694581-85a0-46b9-89fe-61f5a9fd8e39 apple 苹果
110030b8-d950-4257-8ebe-bc586ab89fb5 banana 香蕉
9dc7ba58-8ea2-424a-935d-69b26923f7fc orange 橘子
```

The card hash is therefore `83185FAB`

The final sync hash is the memory hash concatenated to the card hash. For the examples above, it would be `27EED97B83185FAB`

Management API
==============

The Senlin service also has a management API.

## Create a user

Request

```
POST /v1/user

{
	"username": "harryeakins",
	"email_address": "harry.eakins@gmail.com"
	"password": "sa2kem3ls"
}
```

Response:

```
HTTP 201 Created

Location: /v1/user/1bd96868-cb13-4760-8a52-582a615881e1

{
	"user_id": "1bd96868-cb13-4760-8a52-582a615881e1"
	"username": "harryeakins",
	"email_address": "harry.eakins@gmail.com",
	"tags": []
}
```

## Add a tag to a user

Request

```
POST /v1/user/1bd96868-cb13-4760-8a52-582a615881e1/tags

fruit
```

Response:

```
HTTP 201 Created

Location: /v1/user/1bd96868-cb13-4760-8a52-582a615881e1/tags/fruit
```

## Remove a tag from a user

Request

```
DELETE /v1/user/1bd96868-cb13-4760-8a52-582a615881e1/tags/fruit
```

Response

```
HTTP 200 OK
```

