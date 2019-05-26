const server = require('http').createServer();
const io = require('socket.io')(server);

console.log(`io will start on port ${process.env.PORT_IO || '3002'}`);
server.listen(process.env.PORT_IO || '3002');

class HandlerSocket {
  constructor() {
    this.sockets = [];
    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        const i = this.sockets.indexOf(socket);
        this.sockets.splice(i, 1);
      });
      this.sockets.push(socket);
    });
  }

  sendNoty(id) {
    this.sockets.map(socket => socket.emit('newAnswer', { id }));
  }
}

module.exports = HandlerSocket;
