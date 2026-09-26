# HorizonTechX ConnectSphere

ConnectSphere is a full-stack social networking web application built on the MERN stack (MongoDB, Express, React 19, Node.js). It provides user authentication, profile management, a community post feed with media uploads via Cloudinary, social interactions, and real-time event notifications via Socket.IO.

## Features

### Authentication
- User registration with username, password, and optional full name and email
- User login with either username or email and password
- JWT access tokens for authorization and HTTP-only refresh token cookies
- Session verification endpoint (`/api/auth/me`) with automatic client-side authentication hydration
- Secure logout clearing authentication state and cookies

### User Profiles
- Public profile view by username displaying avatar, full name, username, bio, website link, post count, and follower/following counts
- Profile editing for authenticated users to update full name, bio, website, and avatar
- Avatar image uploads handled via Multer and Cloudinary
- Dynamic suggested users widget ("Who to follow") listing non-followed accounts

### Posts and Comments
- Post creation supporting text content and optional media uploads (images and videos)
- Chronological community feed with infinite scroll pagination
- Author post management with in-place text editing and deletion
- Post deletion cascades to remove associated likes and comments
- Post commenting with paginated comment lists per post
- Author comment deletion

### Social Interactions
- Like and unlike posts with immediate UI updates and synchronized counters
- Follow and unfollow users with synchronized follower and following counters
- Modal dialogs to view followers and following lists on user profiles

### Real-Time Updates
- Authenticated Socket.IO connection using JWT tokens
- Real-time notification toasts and navbar badge counter for incoming follows, likes, and comments
- Real-time feed event updates for post creation and post deletion

## In progress / Not built yet
- Password recovery and reset via email
- Email verification flow (registration currently activates immediately)
- Direct messaging and private 1-on-1 chat
- Stories and temporary status updates
- Persistent notification history page (notifications are real-time toasts and navbar badge counters)
- Global search for users and posts
- Bookmarked and saved posts collection

## Tech Stack

### Backend
- Node.js & Express 5.2.1
- MongoDB & Mongoose 9.10.1
- Socket.IO 4.8.3
- JSON Web Token (jsonwebtoken 9.0.3) & bcryptjs 3.0.3
- Cloudinary 2.11.0 & Multer 2.4.0
- Helmet 8.3.0, Compression 1.8.2, Express Rate Limit 8.7.0
- Express Validator 7.3.2
- Cookie Parser 1.4.7, CORS 2.8.6, Morgan 1.12.1, Dotenv 18.0.1

### Frontend
- React 19.2.8 & React DOM 19.2.8
- Vite 8.3.0
- React Router DOM 7.18.4
- Zustand 5.0.15
- Axios 1.20.0
- Socket.IO Client 4.8.3
- Tailwind CSS 4.3.3 & @tailwindcss/vite
- Framer Motion 13.4.0
- Lucide React 1.47.0
- Date-fns 4.4.0

## Project Structure

```
HorizonTechX_ConnectSphere/
├── HorizonTechX_ConnectSphere_backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── socket.js
│       ├── constents.js
│       ├── configs/
│       │   ├── cloudinary.config.js
│       │   ├── db.config.js
│       │   └── env.config.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── comment.controller.js
│       │   ├── follow.controller.js
│       │   ├── post.controller.js
│       │   └── user.controller.js
│       ├── middlewares/
│       │   ├── auth.middleware.js
│       │   ├── error.middleware.js
│       │   ├── sanitize.middleware.js
│       │   ├── upload.middleware.js
│       │   └── validate.middleware.js
│       ├── models/
│       │   ├── Comment.model.js
│       │   ├── Follow.model.js
│       │   ├── Like.model.js
│       │   ├── Post.model.js
│       │   └── User.model.js
│       ├── repositories/
│       │   ├── comment.repository.js
│       │   ├── follow.repository.js
│       │   ├── post.repository.js
│       │   └── user.repository.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── comment.routes.js
│       │   ├── follow.routes.js
│       │   ├── post.routes.js
│       │   ├── user.routes.js
│       │   └── index.js
│       ├── services/
│       │   ├── auth.service.js
│       │   ├── comment.service.js
│       │   ├── cron.service.js
│       │   ├── follow.service.js
│       │   ├── post.service.js
│       │   └── user.service.js
│       ├── utils/
│       │   ├── ApiError.js
│       │   ├── ApiResponse.js
│       │   ├── asyncHandler.js
│       │   ├── generateToken.js
│       │   └── pagination.js
│       └── validators/
│           ├── auth.validator.js
│           ├── comment.validator.js
│           ├── common.validator.js
│           ├── post.validator.js
│           └── user.validator.js
└── HorizonTechX_ConnectSphere_frontend/
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── api/
        │   ├── authApi.js
        │   ├── axios.js
        │   ├── commentApi.js
        │   ├── followApi.js
        │   ├── postApi.js
        │   └── userApi.js
        ├── components/
        │   ├── comments/
        │   ├── common/
        │   ├── layout/
        │   ├── posts/
        │   └── users/
        ├── context/
        │   ├── AuthContext.jsx
        │   └── SocketContext.jsx
        ├── hooks/
        │   ├── useDebounce.js
        │   └── useInfiniteScroll.js
        ├── pages/
        │   ├── EditProfile.jsx
        │   ├── Feed.jsx
        │   ├── Login.jsx
        │   ├── NotFound.jsx
        │   ├── Profile.jsx
        │   └── Register.jsx
        ├── routes/
        │   └── ProtectedRoute.jsx
        ├── store/
        │   ├── useAuthStore.js
        │   ├── useCommentStore.js
        │   ├── usePostStore.js
        │   ├── useSocketStore.js
        │   ├── useThemeStore.js
        │   ├── useToastStore.js
        │   └── useUserStore.js
        └── utils/
            ├── constants.js
            ├── formatDate.js
            └── formatError.js
```

## Prerequisites

- Node.js 18.x or higher (Node 20+ recommended)
- npm 9.x or higher
- MongoDB instance (MongoDB Atlas connection string or local MongoDB instance)
- Cloudinary account for media assets (Cloud Name, API Key, API Secret)

## Environment Variables

Configuration is handled through `.env` files. Reference templates are provided in `.env.example` in each folder.

### Backend (`HorizonTechX_ConnectSphere_backend/.env`)

| Variable | Description | Placeholder Value |
|---|---|---|
| `PORT` | Port number the backend server listens on | `5000` |
| `NODE_ENV` | Application environment (`development` or `production`) | `development` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/connectsphere` |
| `MONGO_DNS_SERVERS` | Optional DNS servers for resolving MongoDB Atlas SRV records | `1.1.1.1,8.8.8.8` |
| `ACCESS_TOKEN_SECRET` | Secret key used to sign JWT access tokens (minimum 32 characters) | `your_access_token_secret` |
| `ACCESS_TOKEN_EXPIRES_IN` | Access token duration | `15m` |
| `REFRESH_TOKEN_SECRET` | Secret key used to sign JWT refresh tokens (minimum 32 characters) | `your_refresh_token_secret` |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token duration | `7d` |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `your_cloudinary_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_cloudinary_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_cloudinary_api_secret` |

### Frontend (`HorizonTechX_ConnectSphere_frontend/.env`)

| Variable | Description | Placeholder Value |
|---|---|---|
| `VITE_API_URL` | Base URL for REST API requests | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | URL for the Socket.IO server | `http://localhost:5000` |

## Installation & Setup

### 1. Backend Setup

```bash
cd HorizonTechX_ConnectSphere_backend

# Install dependencies
npm install

# Create environment configuration from template
cp .env.example .env

# Edit .env with your MongoDB and Cloudinary credentials

# Start the development server
npm run dev
```

The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup

In a separate terminal:

```bash
cd HorizonTechX_ConnectSphere_frontend

# Install dependencies
npm install

# Create environment configuration from template
cp .env.example .env

# Start Vite development server
npm run dev
```

The frontend client will run on `http://localhost:5173`.

## API Overview

All routes are mounted under `/api` (and `/api/v1`).

| Method | Path | Auth Required | Purpose |
|---|---|---|---|
| `GET` | `/health`, `/api/health` | No | Server health and database connection check |
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Authenticate user credentials and return token |
| `POST` | `/api/auth/logout` | No | Log out user and clear auth cookies |
| `GET` | `/api/auth/me` | Yes | Retrieve authenticated user profile |
| `GET` | `/api/posts` | Yes | Get paginated community feed posts |
| `POST` | `/api/posts` | Yes | Create a new post with optional media upload |
| `PATCH` | `/api/posts/:postId` | Yes | Edit text or media of an existing post |
| `DELETE` | `/api/posts/:postId` | Yes | Delete own post and cascade associated data |
| `POST` | `/api/posts/:postId/like` | Yes | Toggle like/unlike on a post |
| `GET` | `/api/posts/:postId/comments` | Yes | Get paginated comments for a post |
| `POST` | `/api/posts/:postId/comments` | Yes | Add a comment to a post |
| `DELETE` | `/api/posts/:postId/comments/:commentId` | Yes | Delete own comment from a post |
| `POST` | `/api/follow/:userId` | Yes | Follow a user |
| `DELETE` | `/api/follow/:userId` | Yes | Unfollow a user |
| `GET` | `/api/follow/:username/followers` | Yes | Get paginated followers of a user |
| `GET` | `/api/follow/:username/following` | Yes | Get paginated following list of a user |
| `GET` | `/api/users/suggestions` | Yes | Get suggested users to follow |
| `PATCH` | `/api/users/profile` | Yes | Update profile details and upload new avatar |
| `GET` | `/api/users/:username` | Yes | Get user profile by username |
| `GET` | `/api/users/:username/posts` | Yes | Get paginated posts authored by a user |

## Known Limitations

- In-memory WebSocket state: Socket.IO connections and room memberships are maintained in single-process memory. Horizontal scaling across multiple server instances requires a shared adapter such as Redis.
- Username/password only: There is no password reset via email or email confirmation pipeline.
- Ephemeral notifications: Notifications are emitted directly via WebSockets to connected clients as toasts and navbar counter updates; there is no persistent notification log stored in the database.
- Cloudinary dependency: Media uploads require an active Cloudinary account; local filesystem fallback for uploaded files is not implemented.
- Test coverage: Automated test suites (unit/integration) are not currently configured in package.json scripts.

## License

ISC
