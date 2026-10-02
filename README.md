# HorizonTechX ConnectSphere

ConnectSphere (branded in the web client as Connectly) is a full-stack social networking web application built on the MERN stack (MongoDB, Express, React 19, Node.js). It provides user authentication, customizable profiles, media post sharing with Cloudinary, real-time social notifications over WebSockets via Socket.IO, and a responsive interface with dark/light theme support.

## Features

### Authentication & Sessions
- User registration requiring username and password, with optional full name and email
- User login accepting either username or email with password
- Dual-token session strategy: JWT access token in the response payload and HTTP-only refresh token in secure cookies
- Session verification endpoint (`/api/auth/me`) with automatic client-side hydration on page refresh
- Secure logout clearing client-side tokens and backend cookies
- Protected client-side routing redirecting unauthenticated users to `/login`

### User Profiles
- Public profile view by username showing avatar, full name, username, bio, website link, post count, and follower/following counts
- Profile editing for authenticated users to update full name, bio, website link, and avatar
- Avatar image uploads processed through Multer and uploaded to Cloudinary
- Dynamic suggested users widget ("Who to follow") listing non-followed accounts
- Followers and following list modals with quick follow/unfollow actions

### Posts & Media
- Post creation supporting text content and optional media attachments (images and videos)
- Live client-side media previews with remove options before publishing
- Direct media uploading to Cloudinary with automatic format optimization
- Chronological global feed with infinite scroll pagination
- Profile posts tab showing all posts authored by a specific user
- Author post management with in-place text and media updating
- Author post deletion cascading to delete associated likes and comments from MongoDB
- Text parsing for `@username` mentions (links to user profile) and `#hashtag` highlights

### Comments & Reactions
- Commenting system on all posts with paginated comment lists
- Author comment deletion
- Like and unlike toggling with optimistic UI updates and synchronized counters
- Dedicated confirmation modals before deleting posts or comments

### Real-Time Interactions (Socket.IO)
- Authenticated WebSocket handshake validating JWT access tokens
- Instant pop-up toast notifications and navbar unread counter increments for:
  - New followers
  - Likes on own posts
  - Comments on own posts
- Real-time feed synchronization for post creation and post deletion across active sessions
- Unread notification counter badge on the navbar bell icon, reset on click

### UI & Styling
- Dark mode and light mode theme toggle with system preference detection and localStorage persistence
- Full-page and component skeleton loaders during data fetching for feed, profile, and suggested users
- Responsive navigation layout featuring a desktop sidebar, a suggested users sidebar, and a mobile bottom navigation bar
- Error boundary wrapper to catch runtime rendering errors gracefully

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
        │   │   ├── CommentBox.jsx
        │   │   ├── CommentItem.jsx
        │   │   └── CommentList.jsx
        │   ├── common/
        │   │   ├── ConfirmModal.jsx
        │   │   ├── EmptyState.jsx
        │   │   ├── ErrorBoundary.jsx
        │   │   ├── Loader.jsx
        │   │   ├── Logo.jsx
        │   │   ├── Modal.jsx
        │   │   └── Toast.jsx
        │   ├── layout/
        │   │   ├── Layout.jsx
        │   │   ├── MobileNav.jsx
        │   │   ├── Navbar.jsx
        │   │   ├── RightSidebar.jsx
        │   │   └── Sidebar.jsx
        │   ├── posts/
        │   │   ├── EditPostModal.jsx
        │   │   ├── FormattedText.jsx
        │   │   ├── LikeButton.jsx
        │   │   ├── PostCard.jsx
        │   │   ├── PostForm.jsx
        │   │   └── PostList.jsx
        │   └── users/
        │       ├── Avatar.jsx
        │       ├── FollowButton.jsx
        │       ├── FollowListModal.jsx
        │       └── ProfileHeader.jsx
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

- Node.js 18.x or higher (tested on Node 20+)
- npm 9.x or higher
- MongoDB instance (MongoDB Atlas cluster URI or local MongoDB instance)
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
| `POST` | `/api/auth/register` | No | Register a new user account |
| `POST` | `/api/auth/login` | No | Authenticate user credentials and return access token |
| `POST` | `/api/auth/logout` | No | Log out user and clear authentication cookies |
| `GET` | `/api/auth/me` | Yes | Retrieve authenticated user profile |
| `GET` | `/api/posts` | Yes | Get paginated community feed posts |
| `POST` | `/api/posts` | Yes | Create a new post with optional media upload |
| `PATCH` | `/api/posts/:postId` | Yes | Edit text or media of an existing post |
| `DELETE` | `/api/posts/:postId` | Yes | Delete own post and cascade associated data |
| `POST` | `/api/posts/:postId/like` | Yes | Toggle like/unlike on a post |
| `GET` | `/api/posts/:postId/comments` | Yes | Get paginated comments for a post |
| `POST` | `/api/posts/:postId/comments` | Yes | Add a comment to a post |
| `DELETE` | `/api/posts/:postId/comments/:commentId` | Yes | Delete own comment from a post |
| `POST` | `/api/follow/:userId` | Yes | Follow a target user |
| `DELETE` | `/api/follow/:userId` | Yes | Unfollow a target user |
| `GET` | `/api/follow/:username/followers` | Yes | Get paginated followers of a user |
| `GET` | `/api/follow/:username/following` | Yes | Get paginated following list of a user |
| `GET` | `/api/users/suggestions` | Yes | Get suggested users to follow |
| `PATCH` | `/api/users/profile` | Yes | Update profile details and upload new avatar |
| `GET` | `/api/users/:username` | Yes | Get user profile by username |
| `GET` | `/api/users/:username/posts` | Yes | Get paginated posts authored by a user |

## WebSocket Events (Socket.IO)

| Event | Direction | Payload | Purpose |
|---|---|---|---|
| `connection` | Client &rarr; Server | Auth token in handshake | Authenticates client and joins room `user:<userId>` |
| `notification:new` | Server &rarr; Client | `{ type, message, sender, postId? }` | Dispatches live toast and increments navbar unread counter |
| `post:created` | Server &rarr; Client | `{ post }` | Broadcasts newly published post to active feeds |
| `post:deleted` | Server &rarr; Client | `{ postId }` | Broadcasts deleted post ID to remove it from feeds |
| `profile:updated` | Server &rarr; Client | `{ user }` | Broadcasts profile updates across sessions |

## Manual Verification Checklist (2-User Real-Time Test)

To verify real-time capabilities and core workflows:

1. Open two separate browser sessions:
   - Window 1 (Standard window): `http://localhost:5173`
   - Window 2 (Incognito / private window): `http://localhost:5173`
2. Register two test accounts:
   - Window 1: Register as User A (e.g. `alice`)
   - Window 2: Register as User B (e.g. `bob`)
3. Follow interaction:
   - In Window 2 (User B), navigate to User A's profile or find them in "Who to follow" and click **Follow**.
   - Observe in Window 1 (User A): A real-time toast notification appears (`@bob started following you`) and the notification bell count increments.
4. Post creation with media:
   - In Window 1 (User A), compose a post with text and select an image or video file.
   - Click **Post**. Notice the loader during Cloudinary upload and the post rendering at the top of the feed.
5. Like interaction:
   - In Window 2 (User B), click the like heart icon on User A's post.
   - Observe in Window 1 (User A): A real-time notification toast appears (`@bob liked your post`) and the like counter updates.
6. Comment interaction:
   - In Window 2 (User B), open comments on User A's post and submit a comment.
   - Observe in Window 1 (User A): A real-time notification toast appears (`@bob commented on your post`) and the comment appears in the list.
