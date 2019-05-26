const prefix = model => model.schema.columns.reduce((previous, column) => {
  previous.push(`${model.schema.table}.${column} AS ${model.schema.table}_${column}`);
  return previous;
}, []);

module.exports = prefix;
