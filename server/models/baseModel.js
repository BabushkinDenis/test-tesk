/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
const _ = require('underscore');
const DB = require('../dbConnect');

module.exports = (() => {
  const BaseModel = function (data) {
    Object.defineProperty(this, 'id', {
      value: data.id ? +data.id : undefined,
      writable: false,
      enumerable: false,
      configurable: true,
    });
  };

  BaseModel.prototype.getId = function () {
    return this.id;
  };

  BaseModel.prototype.serialize = function () {
    const data = {};
    Object.keys(this).forEach((key) => {
      data[key] = this[key];
    });
    return { ...data, id: this.id };
  };

  BaseModel.prototype.save = function (table, resolve, reject) {
    new DB().getConnection()
      .then((connection) => {
        connection.insert(
          table,
          this,
          (err, res) => {
            if (err) {
              typeof resolve === 'function' ? reject({ error: true, msg: err }) : undefined;
            } else {
              Object.defineProperty(this, 'id', {
                value: res,
                writable: false,
                enumerable: false,
                configurable: false,
              });
              typeof reject === 'function' ? resolve(this) : undefined;
            }
            connection.release();
          },
        );
      })
      .catch((err) => {
        reject({ error: true, msg: err });
      });
  };

  BaseModel.prototype.update = function (table, resolve, reject, without = []) {
    const self = this;
    const data = {};
    Object.keys(this).forEach((key) => {
      // eslint-disable-next-line no-prototype-builtins
      if (self.hasOwnProperty(key)) {
        data[`\`${key}\``] = this[key];
      }
    });

    new DB().getConnection()
      .then((connection) => {
        connection.update(
          table,
          _.omit(data, without),
          { id: this.id },
          (err) => {
            if (err) {
              typeof resolve === 'function' ? reject({ error: true, msg: err }) : undefined;
            } else {
              typeof reject === 'function' ? resolve(this) : undefined;
            }
            connection.release();
          },
        );
      })
      .catch((err) => {
        reject({ error: true, msg: err });
      });
  };

  BaseModel.prototype.delete = function (table, resolve, reject) {
    return (new DB()).getConnection()
      .then((connection) => {
        connection.delete(
          table,
          { id: this.getId() },
          (err) => {
            if (err) {
              typeof resolve === 'function' ? reject({ error: true, msg: err }) : undefined;
            } else {
              typeof reject === 'function' ? resolve({ error: false }) : undefined;
            }
            connection.release();
          },
        );
      })
      .catch((err) => {
        reject({ error: true, msg: err });
      });
  };
  BaseModel.prototype.set = function (data, strict) {
    const self = this;
    Object.keys(data).forEach((key) => {
      // eslint-disable-next-line no-prototype-builtins
      if (self.hasOwnProperty(key) && (!!strict || data[key] !== null)) {
        this[key] = data[key];
      }
    });
  };

  BaseModel.prototype.getNowTime = () => Math.round((new Date()).getTime() / 1000);

  BaseModel.getNowTime = () => Math.round((new Date()).getTime() / 1000);

  return BaseModel;
})();
