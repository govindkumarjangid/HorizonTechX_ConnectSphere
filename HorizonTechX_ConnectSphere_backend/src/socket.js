import { Server } from 'socket.io';
import { verifyAccessToken } from './utils/generateToken.js';
import env from './configs/env.config.js';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin || env.clientUrls.includes(origin)) return callback(null, true);
        callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // Handshake authentication using JWT
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token)
        return next(new Error('Authentication required for socket connection'));

      const decoded = verifyAccessToken(token);
      socket.userId = decoded._id;
      next();
    } catch (err) {
      next(new Error('Invalid or expired socket token'));
    }
  });

  io.on('connection', (socket) => {
    const userRoom = `user:${socket.userId}`;
    socket.join(userRoom);

    socket.on('disconnect', () => {
      socket.leave(userRoom);
    });
  });

  return io;
};

export const getIO = () => io;

export const emitNotification = (targetUserId, payload) => {
  if (!io) return;
  if (String(targetUserId) === String(payload.fromUser?.id)) return;

  const userRoom = `user:${targetUserId}`;
  io.to(userRoom).emit('notification:new', {
    ...payload,
    createdAt: payload.createdAt || new Date().toISOString(),
  });
};
