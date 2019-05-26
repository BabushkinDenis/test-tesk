/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-underscore-dangle */

const BaseModel = require('./baseModel');

module.exports = (() => {
  const _validate = function validate() {
    if (this.body === undefined) {
      return { error: true, msg: 'body in question must not be undefined' };
    }
    if (this.hash === undefined) {
      return { error: true, msg: 'hash in question must not be undefined' };
    }
    return this;
  };


  function Question(_data) {
    const data = _data || {};

    Question.schema.columns.forEach((el) => {
      this[el] = data[el] || Question.schema.default[el];
    });
    // eslint-disable-next-line prefer-rest-params
    BaseModel.apply(this, arguments);
    return _validate.apply(this);
  }

  Question.schema = {
    table: '_questions',
    columns: ['id', 'body', 'hash'],
    default: { },
  };

  Question.generateHash = function generateShortUrl() {
    const alphabet = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'.split('');
    const buf = [];
    const b = alphabet.length;
    let a = new Date().getTime();
    let hash = '';

    while (a >= 1) {
      const c = Math.floor(a / b);
      const d = a - b * c;
      buf.push(d);
      a = c;
    }

    for (let i = 0; i < buf.length; i += 1) {
      hash += `${alphabet[buf[buf.length - 1 - i]]}`;
    }
    return hash;
  };

  // static method
  Question.create = function create(data) {
    const instance = new Question(data);
    if (instance instanceof Question) {
      return instance.save();
    }
    return Promise.reject(instance);
  };

  Question.update = function update(data) {
    const instance = new Question(data);
    if (instance instanceof Question && data.id) {
      return instance.save();
    } if (!data.id) {
      return Promise.reject({ error: true, msg: 'id is not set' });
    }
    return Promise.reject(instance);
  };


  Question.prototype = Object.create(BaseModel.prototype);
  // Желательно и constructor сохранить
  Question.prototype.constructor = Question;


  Question.prototype.save = function save() {
    const self = this;
    if (this.id) {
      return new Promise(((resolve, reject) => {
        BaseModel.prototype.update.apply(self, [Question.schema.table, resolve, reject]);
      }));
    }
    return new Promise(((resolve, reject) => {
      BaseModel.prototype.save.apply(self, [Question.schema.table, resolve, reject]);
    }));
  };

  Question.prototype.delete = function del() {
    const self = this;
    return new Promise(((resolve, reject) => {
      BaseModel.prototype.delete.apply(self, [Question.schema.table, resolve, reject]);
    }));
  };

  return Question;
})();
