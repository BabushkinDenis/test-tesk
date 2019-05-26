/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-unused-expressions */
const Question = require('../models/question');
const Cases = require('../models/cases');
const prefix = require('./helper');

class QuestionCollection {
  constructor(source) {
    this.source = source;
  }

  // eslint-disable-next-line class-methods-use-this
  mapWithAnswers(rows) {
    const result = {};
    rows.forEach((row) => {
      const questionCase = {};
      const question = {};

      Cases.schema.columns.forEach((key) => {
        questionCase[key] = row[`${Cases.schema.table}_${key}`];
      });
      Question.schema.columns.forEach((key) => {
        question[key] = row[`${Question.schema.table}_${key}`];
      });
      if (!result[question.id]) {
        result[question.id] = {
          ...question,
          cases: questionCase.id ? [questionCase] : [],
        };
      } else {
        questionCase.id && result[question.id].cases.push(questionCase);
      }
    });
    return Object.keys(result).map(key => result[key]);
  }

  getByHash(hash) {
    return new Promise(((resolve, reject) => {
      this.source.getConnection()
        .then((connection) => {
          connection.query(`
            SELECT ${[...prefix(Question), ...prefix(Cases)]}
            FROM _questions
            LEFT JOIN _cases ON _questions.id=_cases.idQuestion
            WHERE _questions.hash = ?
          `, [hash], (err, rows) => {
            err ? reject({ error: true, msg: err }) : resolve(this.mapWithAnswers(rows)[0]);
            connection.release();
          });
        })
        .catch(reject);
    }));
  }

  getAll() {
    return new Promise(((resolve, reject) => {
      this.source.getConnection()
        .then((connection) => {
          connection.query(`
            SELECT ${[...prefix(Question), ...prefix(Cases)]}
            FROM _questions
            LEFT JOIN _cases ON _questions.id = _cases.idQuestion
          `, [], (err, rows) => {
            err ? reject({ error: true, msg: err }) : resolve(this.mapWithAnswers(rows));
            connection.release();
          });
        })
        .catch(reject);
    }));
  }
}

module.exports = QuestionCollection;
