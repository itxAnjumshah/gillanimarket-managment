# Shop Rent Management Backend

Node/Express + MongoDB (Mongoose) backend for the Shop Rent Management system.

## Requirements

- Node.js (your current version works)
- MongoDB (local) **or** MongoDB Atlas

## Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env`

Copy `.env.example` to `.env` and fill in:

- `MONGODB_URI`
- `JWT_SECRET`

3. Run the server

```bash
npm start
```

For development (auto-reload):

```bash
npm run dev
```

## Health check

- `GET /health` returns server status + Mongo connection state.

## Seed (optional)

Create an admin user (if it doesn’t exist):

```bash
npm run seed
```

Delete all users (danger):

```bash
npm run seed -- --destroy
```

## Notes

- If MongoDB is unreachable in **development**, the server will still start so you can hit `/health` and debug. In **production**, the process exits on DB failure.
