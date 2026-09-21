# HorizonTechX ConnectSphere

ConnectSphere is a modern, responsive mini social networking web application built on the MERN stack (MongoDB, Express.js, React 19, Node.js) with real-time notifications powered by Socket.IO, media uploads via Cloudinary, and state management powered by Zustand.

---

## 🚀 Features

Strictly tailored to core social networking features with zero bloat:

1. **User Profiles & Authentication**
   - Registration with Full Name, Username, Email, and Password.
   - Login with either Email or Username + Password.
   - JWT-based authorization stored securely and transmitted via Bearer tokens.
   - User profile viewing by username (shows full name, bio, avatar, post count, follower/following counts, and dynamic follow status).
   - Real file upload for profile avatars directly to Cloudinary (no URL typing!).
   - Profile editing (full name, username, bio, and avatar upload) with validation and optimistic UI.

2. **Posts & Comments (Images & Videos)**
   - Create posts with text and media (photos and videos uploaded via Cloudinary).
   - Support for both image formats (JPG, PNG, WEBP) and video formats (MP4, WEBM, MOV).
   - Chronological community feed with infinite scroll / pagination.
   - Delete own posts (cleans up Cloudinary assets and cascades comments/likes).
   - Add comments to posts.
   - Delete own comments.

3. **Like & Follow System**
   - Like and unlike posts with instant optimistic UI toggle and accurate like counters.
   - Follow and unfollow users directly from profiles or suggested users widget.
   - Accurate follower, following, and post counters synchronized in MongoDB.

4. **Real-Time Notifications (Socket.IO)**
   - Authenticated WebSocket handshake using JWT token.
   - Live real-time notification toast (bottom-right corner with sender avatar, action badge, and auto-dismiss).
   - Real-time unread counter badge on the navbar bell icon.
   - Triggers instantly on:
     - **Follow** (User B follows User A &rarr; User A gets live notification)
     - **Like** (User B likes User A's post &rarr; User A gets live notification)
     - **Comment** (User B comments on User A's post &rarr; User A gets live notification)
   - Self-actions (e.g. liking your own post) never trigger redundant notifications.

5. **Zustand Architecture & UI Standards**
   - 100% of API calls are managed within Zustand stores (`useAuthStore`, `usePostStore`, `useCommentStore`, `useUserStore`, `useToastStore`, `useSocketStore`). No direct API calls in components.
   - Minimal, smooth popup animations using Framer Motion (GSAP removed).
   - Unified `<Loader />` component across all loading buttons and states.
   - `cursor-pointer` globally enforced across all buttons, file inputs, and clickable elements.
   - Toast-driven feedback for all creates, deletes, updates, and errors.
   - Clean placeholders (`Enter your name`, `Enter your email`, `Enter your username`, `Enter your password`) with no HTML `required` attributes.
   - Brand logo using `/logo.svg` in public.

---

## 🛠️ Prerequisites

- **Node.js**: `v18.x` or higher (tested on `v22.x`)
- **npm**: `v9.x` or higher
- **MongoDB**: MongoDB Atlas cluster URI or local MongoDB instance
- **Cloudinary**: Cloudinary account credentials for media uploads

---

## ⚙️ Environment Variables

### Backend Configuration

Inside `HorizonTechX_ConnectSphere_backend/.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/connectsphere?retryWrites=true&w=majority
MONGO_DNS_SERVERS=1.1.1.1,8.8.8.8

# JWT Secrets & Expiry
ACCESS_TOKEN_SECRET=HorizonTechX_ConnectSphere_Access_Token_Secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=HorizonTechX_ConnectSphere_Refresh_Token_Secret
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS Allowed Origin
CLIENT_URL=http://localhost:5173

# Cloudinary Credentials (Preconfigured)
CLOUDINARY_CLOUD_NAME=dlv1enrt0
CLOUDINARY_API_KEY=293698997721257
CLOUDINARY_API_SECRET=jzFbxVjvM0MEYzfIlp5uX9B4-F4
```

### Frontend Configuration

Inside `HorizonTechX_ConnectSphere_frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📦 Installation & Setup

Open two separate terminal windows for backend and frontend.

### 1. Backend Setup

```bash
cd HorizonTechX_ConnectSphere_backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The server will start on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd HorizonTechX_ConnectSphere_frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## 🧪 Manual Verification Checklist (2 Users Real-Time Test)

### Step 1: Open Two Separate Browser Sessions
- **Window 1 (Normal Window)**: Open `http://localhost:5173`
- **Window 2 (Incognito Window)**: Open `http://localhost:5173`

### Step 2: Register User A & User B
- In **Window 1**, click **"Create account"**:
  - Name: `Alice Johnson`
  - Username: `alice`
  - Email: `alice@connectsphere.dev`
  - Password: `Password123!`
  - Click **"Create Account"** &rarr; Success toast appears; redirects to Feed.
- In **Window 2**, click **"Create account"**:
  - Name: `Bob Smith`
  - Username: `bob`
  - Email: `bob@connectsphere.dev`
  - Password: `Password123!`
  - Click **"Create Account"** &rarr; Success toast appears; redirects to Feed.

### Step 3: Test Real-Time Follow Notification
1. In **Window 2 (Bob)**, find `Alice Johnson` in the **"Who to follow"** sidebar or visit `http://localhost:5173/profile/alice`.
2. Click **"Follow"**.
3. **Verify in Window 1 (Alice)**:
   - A live toast notification pops up: `🌸 @bob started following you`.
   - The navbar bell icon updates with a red badge `(1)`.

### Step 4: Test Post Creation with Media (Image / Video)
1. In **Window 1 (Alice)**, type a post and click **"Photo"** or **"Video"** to pick a media file.
2. An instant preview appears with an `X` cancel button.
3. Click **"Post"** &rarr; The `<Loader />` displays while uploading to Cloudinary, followed by a `"Post published successfully!"` toast.
4. Alice's post with media renders immediately at the top of the feed.

### Step 5: Test Real-Time Like Notification
1. In **Window 2 (Bob)**, click the **Heart (Like)** icon on Alice's post.
2. The heart turns red with spring animation, and the count increments.
3. **Verify in Window 1 (Alice)**:
   - A live toast notification pops up: `❤️ @bob liked your post`.
   - The navbar bell badge increments.

### Step 6: Test Real-Time Comment Notification
1. In **Window 2 (Bob)**, click the **Comment** bubble on Alice's post.
2. Type `"Incredible post, Alice!"` and click send.
3. Comment appears with a success toast.
4. **Verify in Window 1 (Alice)**:
   - A live toast notification pops up: `💬 @bob commented on your post`.

### Step 7: Test Profile Avatar Upload via Cloudinary
1. In **Window 1 (Alice)**, go to **Profile** &rarr; **Edit Profile**.
2. Notice the minimal Framer Motion popup animation.
3. Click **"Upload new photo"** &rarr; select an image file &rarr; preview updates immediately.
4. Click **"Save Changes"** &rarr; `<Loader />` displays while uploading to Cloudinary &rarr; `"Profile updated successfully"` toast pops up.
