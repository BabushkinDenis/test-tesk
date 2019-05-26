/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-unused-expressions */
class AnswerCollection {
  constructor(source) {
    this.source = source;
  }

  getByHash(hash) {
    return new Promise(((resolve, reject) => {
      this.source.getConnection()
        .then((connection) => {
          connection.query(`
            SELECT a.* 
            FROM _answers as a
            LEFT JOIN _questions as q ON a.idQuestion=q.id
            WHERE q.hash = ?
          `, [hash], (err, rows) => {
            err ? reject({ error: true, msg: err }) : resolve(rows);
            connection.release();
          });
        })
        .catch(reject);
    }));
  }
}

module.exports = AnswerCollection;
