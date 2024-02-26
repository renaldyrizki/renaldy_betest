# READ ME

## Recipe

- [Express JS](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io)
- [JWT](https://jwt.io/)
- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## API Specification

- [User Api](./docs/user.md)

## Installation 

Install dependencies

```
npm install
```
Prisma ORM
```
npm run migrate:generate
```

```
npm run migrate
```
> Migration file located in `/prisma/schema.prisma`

Runing application
```
npm run start / npm run dev
```
> Main file located in `/src/main.js`


## Docker

Runing application
```
docker compose up -d --build
```

## Jest Test

Running Test

```
npm test
```

> Migration file located in `/test/`
