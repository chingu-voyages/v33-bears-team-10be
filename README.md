# SpotMe Backend

## v33-bears-team-10be

## About

SpotMe uses your Spotify data to create quizzes to test your musical knowledge. Only a free Spotify subscription is required.

## Technology

-- Javascript, Typescript
-- Node + Express
-- Async/Await syntax

-- PostgreSQL + Sequelize(tbd)
-- REST API

-- Heroku deployment

## Routes

| Route | Purpose | Parameters | HTTP Code | Return |
|-------|---------|------------|--------|------|
|`/api/auth`| Authenticate to the Spotify server, will provide a redirect | None | `302`| None
|`/api/auth/callback`| If authentication with Spotify is successful, you will be redirected here | None| `200` | A `User` object |
|`/api/auth/error`| If authentication with Spotify is unsuccesful, you will be redirected here | None | `400` | None|
|`/api/auth/logout`| To log out of Spotify | None| `204`| None |
|`/api/playlists` | Retrieve a user's playlists | **Limit** - The number of entities to return. Default: 20. Minimum: 1. Maximum: 50. <br> **Offset** - The index of the first entity to return. Default: 0 (i.e., the first track). Use with limit to get the next set of entities. | `200` | <br> `{ playlists: [...] }`
|`api/top/tracks` | Retrieves a user's top tracks | **Limit** - The number of entities to return. Default: 20. Minimum: 1. Maximum: 50. <br> **Offset** - The index of the first entity to return. Default: 0 | `200` | <br> `{ items: [...], next: 'url', previous: null \|\| 'url' }`
|`api/top/artists` | Retrieves a user's top artists | **Limit** - The number of entities to return. Default: 20. Minimum: 1. Maximum: 50. <br> **Offset** - The index of the first entity to return. Default: 0 | `200` | <br> `{ items: [...], next: 'url', previous: null \|\| 'url' }`
|`api/top/genres` | Retrieves a user's top genres | None | `200` | <br> `{ items: [...] }`