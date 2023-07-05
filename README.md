# News Aggregator API

Endpoints to manage users and their news preferences

## API Reference

#### Register a user

```http
  POST /register
```

| Parameter | Type     | Description               |
| :-------- | :------- | :------------------------ |
| `name`    | `string` | **Required**. user_name   |
| `email`   | `string` | **Required**. valid email |
