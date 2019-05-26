/* eslint-disable no-restricted-properties */
/* eslint-disable no-caller */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-promise-reject-errors */

const mysql = require('mysql');
const mysqlUtilities = require('mysql-utilities');
const dbConf = require('../config/dbConfig')[process.argv[2] || process.env.NODE_ENV || 'product'];

function DB() {
  if (arguments.callee._singletonInstance) {
    return arguments.callee._singletonInstance;
  }

  arguments.callee._singletonInstance = this;

  this.pool = {
    main: mysql.createPool({
      connectionLimit: 10,
      host: dbConf.host,
      user: dbConf.user,
      password: dbConf.password,
      database: dbConf.database,
    }),
  };
}


DB.prototype.getConnection = function getConnection(namePool) {
  const self = this;
  return new Promise((resolve, reject) => {
    if (self.pool[namePool || 'main'] === undefined) {
      reject({ error: true, msg: 'dont get connection' });
    } else {
      self.pool[namePool || 'main'].getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          mysqlUtilities.upgrade(connection);
          mysqlUtilities.introspection(connection);
          resolve(connection);
        }
      });
    }
  });
};

// eslint-disable-next-line no-unused-vars
DB.prototype.insert = function insert(namePool, table, row) {
  const self = this;
  const _arguments = arguments;
  return new Promise(((resolve, reject) => {
    const args = _arguments;
    self.getConnection(args.length === 3 ? Array.prototype.shift.call(args) : 'main')
      .then((connection) => {
        connection.insert(Array.prototype.shift.call(args), Array.prototype.shift.call(args), (err, res) => {
          err ? reject({ error: true, msg: err }) : resolve(res);
          connection.release();
        });
      })
      .catch((err) => {
        reject(err);
      });
  }));
};

// eslint-disable-next-line no-unused-vars
DB.prototype.query = function query(namePool, _query, params) {
  const self = this;
  const _arguments = arguments;
  return new Promise(((resolve, reject) => {
    const args = _arguments;
    self.getConnection(args.length === 3 ? Array.prototype.shift.call(args) : 'main')
      .then((connection) => {
        connection.query(Array.prototype.shift.call(args), Array.prototype.shift.call(args), (err, rows) => {
          err ? reject({ error: true, msg: err }) : resolve(rows);
          connection.release();
        });
      })
      .catch((err) => {
        reject(err);
      });
  }));
};

// eslint-disable-next-line no-unused-vars
DB.prototype.queryRow = function queryRow(namePool, query, params) {
  const self = this;
  const _arguments = arguments;
  return new Promise(((resolve, reject) => {
    const args = _arguments;
    self.getConnection(args.length === 3 ? Array.prototype.shift.call(args) : 'main')
      .then((connection) => {
        connection.queryRow(Array.prototype.shift.call(args), Array.prototype.shift.call(args), (err, row) => {
          connection.release();
          err ? reject({ error: true, msg: err }) : resolve(row);
        });
      })
      .catch((err) => {
        reject(err);
      });
  }));
};

// eslint-disable-next-line no-unused-vars
DB.prototype.upsert = function upsert(namePool, table, params) {
  const self = this;
  const _arguments = arguments;
  return new Promise(((resolve, reject) => {
    const args = _arguments;
    self.getConnection(args.length === 3 ? Array.prototype.shift.call(args) : 'main')
      .then((connection) => {
        connection.upsert(Array.prototype.shift.call(args), Array.prototype.shift.call(args), (err, affectedRows) => {
          err ? reject({ error: true, msg: err }) : resolve(affectedRows);
          connection.release();
        });
      })
      .catch((err) => {
        reject(err);
      });
  }));
};


module.exports = DB;
