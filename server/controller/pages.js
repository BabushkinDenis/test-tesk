/* eslint-disable prefer-promise-reject-errors */

const path = require('path');
const QuestionCollection = require('../collections/questionCollection');
const Question = require('../models/question');
const DB = require('../dbConnect');

module.exports = {
  main(req, res) {
    res.sendFile(path.join(__dirname, '..', '/build', 'index.html'));
  },
  answer(req, res, next) {
    const questionCollection = new QuestionCollection(new DB());
    questionCollection.getByHash(req.params.hash)
      .then((question) => {
        if (!(question instanceof Question)) next();
        res.sendFile(path.join(__dirname, '..', '/build', 'index.html'));
      });
  },
};
