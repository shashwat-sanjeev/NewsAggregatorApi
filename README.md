# News Aggregator API

Endpoints to manage users and their news preferences

## API Reference

#### Register a user

```http
  POST /register
```

| Body Parameter | Type     | Description                                |
| :------------- | :------- | :----------------------------------------- |
| `username`     | `string` | **Required**. user_name                    |
| `email`        | `string` | **Required**. valid email                  |
| `password`     | `string` | **Required**. password for user validation |

#### Log In

```http
  POST /login
```

| Body Parameter | Type     | Description                                |
| :------------- | :------- | :----------------------------------------- |
| `email`        | `string` | **Required**. user email                   |
| `password`     | `string` | **Required**. password created at register |

#### Get LoggedIn user

```http
  GET /me
```

#### Logout

```http
  POST /logout
  Add accessToken in Authorization header with type Bearer
```

```http
  GET /news
```

```http
  GET /news/search/:keyword
```
