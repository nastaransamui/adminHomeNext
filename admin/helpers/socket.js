import { Server } from 'socket.io';
const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
const socketHandler = (req, res) => {
  if (isVercel) {
    res.end();
  } else {
    if (res.socket.server.io) {
      console.log('Socket is already running');
      return res.socket.server.io;
    } else {
      console.log('Socket is initializing');
      const io = new Server(res.socket.server);
      res.socket.server.io = io;
      return io;
    }
  }
};

export default socketHandler;
