
const http = require('http');
const debug = require('debug')('recobot:server');
const app = require('../server/app');


const server = http.createServer(app);

function normalizePort(val) {
  const p = parseInt(val, 10);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(p)) {
    return val;
  }

  if (p >= 0) {
    return p;
  }
  return false;
}

const port = normalizePort(process.env.PORT || '3001');

console.log(`server will start on port: ${port}`);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}


app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
