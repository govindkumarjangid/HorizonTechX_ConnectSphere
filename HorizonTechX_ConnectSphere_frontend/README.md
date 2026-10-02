# HorizonTechX ConnectSphere — Frontend Client

React 19 single-page application built with Vite and Tailwind CSS for the ConnectSphere (Connectly) social networking platform.

## Features

- Modern UI styled with Tailwind CSS v4 and Lucide React icons
- Dark mode and light mode theme toggle with automatic system theme detection and localStorage persistence
- Global state management with Zustand stores and dedicated React Contexts (`AuthContext`, `SocketContext`)
- Authenticated Axios client with automatic Bearer token headers and 401 response handling
- Real-time notification toasts and navbar badge updates powered by Socket.IO client
- Infinite scroll feed pagination and in-place media previews for image/video posting
- Skeleton loading screens for feeds, profiles, and suggested user lists
- Mentions (`@username`) linked directly to profiles and `#hashtag` parsing
- Responsive design with desktop sidebar navigation and a mobile bottom navigation bar

## Tech Stack & Dependencies

- React (`^19.2.8`) & React DOM (`^19.2.8`)
- Vite (`^8.3.0`)
- React Router DOM (`^7.18.4`)
- Tailwind CSS (`^4.3.3`) & `@tailwindcss/vite`
- Zustand (`^5.0.15`)
- Axios (`^1.20.0`)
- Socket.IO Client (`^4.8.3`)
- Framer Motion (`^13.4.0`)
- Lucide React (`^1.47.0`)
- Date-fns (`^4.4.0`)

## Environment Configuration

Create a `.env` file in this directory based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

The frontend client runs on `http://localhost:5173`.
