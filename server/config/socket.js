import { Server } from 'socket.io';

let io;

export const init = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["*", 'http://localhost:5173', 'http://localhost:3000', "https://client-ruddy-iota-11.vercel.app"],
      methods: ["GET", "POST"]
    }
  });
  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export default {
  init,
  getIo
};
