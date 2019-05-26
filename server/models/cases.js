/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-underscore-dangle */

const BaseModel = require('./baseModel');


module.exports = (() => {
  const _validate = function validate() {
    if (this.idQuestion === undefined) {
      return { error: true, msg: 'idQuestion is undefined' };
    }
    return this;
  };


  function Case(_data) {
    const data = _data || {};
    Case.schema.columns.forEach((el) => {
      this[el] = data[el] || Case.schema.default[el];
    });
    // eslint-disable-next-line prefer-rest-params
    BaseModel.apply(this, arguments);

    return _validate.apply(this);
  }

  Case.schema = {
    table: '_cases',
    columns: ['id', 'idQuestion', 'val'],
    default: { case: '' },
  };

  // static method
  Case.create = function create(data) {
    const instance = new Case(data);
    if (instance instanceof Case) {
      return instance.save();
    }
    return Promise.reject(instance);
  };

  Case.update = function update(data) {
    const instance = new Case(data);
    if (instance instanceof Case && data.id) {
      return instance.save();
    } if (!data.id) {
      return Promise.reject({ error: true, msg: 'id is not set' });
    }
    return Promise.reject(instance);
  };


  Case.prototype = Object.create(BaseModel.prototype);
  // Желательно и constructor сохранить
  Case.prototype.constructor = Case;


  Case.prototype.save = function save() {
    const self = this;
    if (this.id) {
      return new Promise(((resolve, reject) => {
        BaseModel.prototype.update.apply(self, [Case.schema.table, resolve, reject]);
      }));
    }
    return new Promise(((resolve, reject) => {
      BaseModel.prototype.save.apply(self, [Case.schema.table, resolve, reject]);
    }));
  };

  Case.prototype.delete = function del() {
    const self = this;
    return new Promise(((resolve, reject) => {
      BaseModel.prototype.delete.apply(self, [Case.schema.table, resolve, reject]);
    }));
  };

  Case.prototype.setPayed = function setPayed() {
    this.pay = 1;
    return this.save();
  };

  Case.prototype.setFilesExist = function setFilesExist() {
    this.filesExist = 1;
    return this.save();
  };

  Case.prototype.serialize = function serialize() {
    const data = BaseModel.prototype.serialize.apply(this);
    return data;
  };

  return Case;
})();
