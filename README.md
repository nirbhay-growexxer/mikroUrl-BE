# Mikro-URL-BE

URL shortening backend service built with Express, MongoDB, and TypeScript.

## Setup

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository

```bash
git clone https://github.com/nirbhay-growexxer/mikroUrl-BE
cd mikroUrl-FE
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory:

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/mikro-url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Running the Application

### Development mode

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Database migrations

```bash
npm run migrate:up   # Apply migrations
npm run migrate:down # Revert migrations
```

## API Documentation

After starting the server, access the Swagger documentation:

```
http://localhost:3001/api-docs
```
