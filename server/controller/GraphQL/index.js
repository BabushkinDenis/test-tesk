
const { GraphQLSchema } = require('graphql');
const QueryRoot = require('./query');
const MutationRoot = require('./mutation');

const AppSchema = new GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot,
});

module.exports = AppSchema;
