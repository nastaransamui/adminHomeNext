import { Server } from 'socket.io';
const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;
const SocketHandler = (req, res) => {
  if (!isVercel) {
    if (res.socket.server.io) {
      console.log('Socket is already running');
      res.end();
      return;
    } else {
      const io = new Server(res.socket.server);
      res.socket.server.io = io;
      console.log('Setting up socket');
      io.on('disconnecting', async () => {
        console.log('disconnecting');
      });
      io.on('disconnect', async (socket) => {
        console.log('client disconnect');
      });
      res.end();
    }
  } else {
    res.end();
    return;
  }
};

export default SocketHandler;
