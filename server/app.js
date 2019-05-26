const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const graphqlHTTP = require('express-graphql');
const HandlerSocket = require('./socket');
const schema = require('./controller/GraphQL');
const pageRouter = require('./routes/index');

const app = express();
const handlerSocket = new HandlerSocket();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/build', express.static(path.join(`${__dirname}/build`)));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.use('*', (req, res, next) => {
  res.set({
    __UID: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  });
  next();
});

app.use('/', pageRouter);

app.use('/api', graphqlHTTP({
  schema,
  graphiql: true,
  context: { handlerSocket },
  pretty: true,
}));


app.use((req, res, next) => {
  next(createError(404));
});


app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
