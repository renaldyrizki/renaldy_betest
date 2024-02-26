# User API Spec

## Register User API

Endpoint :  POST /api/users 

Request Body :

```json
{
  "userName" : "renaldy",
  "pin" : "123456",
  "accountNumber" : "1234567890",
  "emailAddress" : "renaldy@gmail.com",
  "identityNumber" : "1234567890123456"
}
```

Response Body Success :

```json
{
  "data" : {
    "userName" : "renaldy",
    "accountNumber" : "1234567890",
    "emailAddress" : "renaldy@gmail.com",
    "identityNumber" : "1234567890123456"
  }
}
```

Response Body Error : 

```json
{
  "errors" : "userName already exist"
}
```
```json
{
  "errors": "Bad Request"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "userName" : "renaldy",
  "pin" : "123456"
}
```

Response Body Success : 

```json
{
  "data" : {
    "token_type": "Bearer",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZGJhMmE2MmE4NDM2NzgxNzBhYTQ3NyIsInVzZXJOYW1lIjoicmVuYWxkeTMiLCJlbWFpbEFkZHJlc3MiOiJyZW5hbGR5M0BnbWFpbC5jb20iLCJhY2NvdW50TnVtYmVyIjoiMTIzNDU2Nzg5MDEyMzQ1MyIsImlkZW50aXR5TnVtYmVyIjoiMTIzNDU2Nzg5MDEyMzQ1MyIsImlhdCI6MTcwODg5MjkwNiwiZXhwIjoxNzA4OTc5MzA2fQ.HRzam7hNvpLklwCzc7neUD34VGU26t5oplPAuhPVjBE",
    "expiresIn": "1d"
  }
}
```

Response Body Error :

```json
{
  "errors" : "Username or pin wrong"
}
```
```json
{
  "errors": "Bad Request"
}
```

## Get User API

Endpoint : GET /api/users/me

Headers :
- Authorization : Bearer token

Response Body Success:

```json
{
  "data" : {
    "userName" : "renaldy",
    "accountNumber" : "1234567890",
    "emailAddress" : "renaldy@gmail.com",
    "identityNumber" : "1234567890123456"
  }
}
```

Response Body Error : 

```json
{
  "errors" : "Unauthorized"
}
```

## Get User By Account Number API

Endpoint : GET /api/users/account_number/:accountNumber

Headers :
- Authorization : Bearer token

Response Body Success:

```json
{
  "data" : {
    "userName" : "renaldy",
    "accountNumber" : "1234567890",
    "emailAddress" : "renaldy@gmail.com",
    "identityNumber" : "1234567890123456"
  }
}
```

Response Body Error : 

```json
{
  "errors" : "Unauthorized"
}
```
```json
{
  "errors": "Bad Request"
}
```

## Get User By Identity Number API

Endpoint : GET /api/users/identity_number/:identityNumber

Headers :
- Authorization : Bearer token

Response Body Success:

```json
{
  "data" : {
    "userName" : "renaldy",
    "accountNumber" : "1234567890",
    "emailAddress" : "renaldy@gmail.com",
    "identityNumber" : "1234567890123456"
  }
}
```

Response Body Error : 

```json
{
  "errors" : "Unauthorized"
}
```
```json
{
  "errors": "Bad Request"
}
```

## Update User API

Endpoint : PATCH /api/users/me

Headers :
- Authorization : Bearer token 

Request Body :

```json
{
  "userName" : "renaldy", // opsional
  "pin" : "123456", // opsional
  "accountNumber" : "1234567890", // opsional
  "emailAddress" : "renaldy@gmail.com", // opsional
  "identityNumber" : "1234567890123456" // opsional
}
```

Response Body Success : 

```json
{
  "data" : {
    "userName" : "renaldy",
    "accountNumber" : "1234567890",
    "emailAddress" : "renaldy@gmail.com",
    "identityNumber" : "1234567890123456"
  }
}
```

Response Body Error : 

```json
{
  "errors" : "Unauthorized"
}
```
```json
{
  "errors": "Bad Request"
}
```
```json
{
  "errors" : "userName already exist"
}
```


## Delete User API

Endpoint : DELETE /api/users/me

Headers :
- Authorization : Bearer token

Response Body Success : 

```json
{
  "data" : "OK"
}
```

Response Body Error : 

```json
{
  "errors" : "Unauthorized"
}
```
