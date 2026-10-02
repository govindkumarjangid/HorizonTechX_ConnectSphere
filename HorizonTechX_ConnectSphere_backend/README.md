# HorizonTechX ConnectSphere — Backend API

Express.js, MongoDB (Mongoose), and Socket.IO backend for the ConnectSphere social platform.

## Features

- RESTful API structured with modular controllers, services, repositories, and routes
- Authentication with bcrypt password hashing, JWT access tokens, and HTTP-only refresh cookies
- Real-time event notifications and live feed synchronization with Socket.IO
- Cloudinary media upload integration via Multer for user avatars and post photos/videos
- Request validation with express-validator and input sanitization
- Security middleware including Helmet, CORS, and Express Rate Limit
- Aggregation pipelines for suggested users and synchronized social counters

## Tech Stack & Dependencies

- Node.js (v18+) & Express (`^5.2.1`)
- Mongoose (`^9.10.1`)
- Socket.IO (`^4.8.3`)
- JSON Web Token (`^9.0.3`) & bcryptjs (`^3.0.3`)
- Cloudinary (`^2.11.0`) & Multer (`^2.4.0`)
- Express Validator (`^7.3.2`) & Express Rate Limit (`^8.7.0`)
- Helmet (`^8.3.0`), Compression (`^1.8.2`), Morgan (`^1.12.1`), Cookie Parser (`^1.4.7`), Dotenv (`^18.0.1`)

## Environment Configuration

Create a `.env` file in this directory based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/connectsphere
MONGO_DNS_SERVERS=1.1.1.1,8.8.8.8
ACCESS_TOKEN_SECRET=your_access_token_secret_min_32_characters
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_min_32_characters
REFRESH_TOKEN_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server (nodemon)
npm run dev

# 3. Or start production server
npm start
```

The API server runs on `http://localhost:5000`.

## API Routes Summary

Mounted under `/api` and `/api/v1`:

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Posts**: `/api/posts`, `/api/posts/:postId`, `/api/posts/:postId/like`
- **Comments**: `/api/posts/:postId/comments`, `/api/posts/:postId/comments/:commentId`
- **Follow**: `/api/follow/:userId`, `/api/follow/:username/followers`, `/api/follow/:username/following`
- **Users**: `/api/users/suggestions`, `/api/users/profile`, `/api/users/:username`, `/api/users/:username/posts`
- **Health**: `/health`, `/api/health`
