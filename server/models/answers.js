/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-underscore-dangle */

const BaseModel = require('./baseModel');
// const DB = require('../dbConnect');


module.exports = (() => {
  const _validate = function validate() {
    if (this.idCase === undefined) {
      return { error: true, msg: 'idCase is ubdefined' };
    }
    if (this.idQuestion === undefined) {
      return { error: true, msg: 'idQuestion is ubdefined' };
    }
    return this;
  };


  function Answer(_data) {
    const data = _data || {};
    Answer.schema.columns.forEach((el) => {
      this[el] = data[el] || Answer.schema.default[el];
    });

    // eslint-disable-next-line prefer-rest-params
    BaseModel.apply(this, arguments);

    return _validate.apply(this);
  }

  Answer.schema = {
    table: '_answers',
    columns: ['id', 'name', 'idCase', 'idQuestion', 'uid'],
    default: {},
  };

  // static method
  Answer.create = function create(data) {
    const instance = new Answer(data);
    if (instance instanceof Answer) {
      return instance.save();
    }
    return Promise.reject(instance);
  };

  Answer.update = function update(data) {
    const instance = new Answer(data);
    if (instance instanceof Answer && data.id) {
      return instance.save();
    } if (!data.id) {
      return Promise.reject({ error: true, msg: 'id is not set' });
    }
    return Promise.reject(instance);
  };

  Answer.BROKER = 'BROKER';
  Answer.ADMIN = 'SU';
  Answer.AGENT = 'AGENT';


  Answer.prototype = Object.create(BaseModel.prototype);
  // Желательно и constructor сохранить
  Answer.prototype.constructor = Answer;


  Answer.prototype.save = function save() {
    const self = this;
    if (this.id) {
      return new Promise(((resolve, reject) => {
        BaseModel.prototype.update.apply(self, [Answer.schema.table, resolve, reject]);
      }));
    }
    return new Promise(((resolve, reject) => {
      BaseModel.prototype.save.apply(self, [Answer.schema.table, resolve, reject]);
    }));
  };

  Answer.prototype.delete = function del() {
    const self = this;
    return new Promise(((resolve, reject) => {
      BaseModel.prototype.delete.apply(self, [Answer.schema.table, resolve, reject]);
    }));
  };

  Answer.prototype.serialize = function serialize() {
    const data = BaseModel.prototype.serialize.apply(this);
    delete data.password;
    return data;
  };

  return Answer;
})();
