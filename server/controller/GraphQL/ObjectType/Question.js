const {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');

const CaseType = require('./Case');

const QuestionType = new GraphQLObjectType({
  name: 'Question',
  description: 'This represent a question',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    body: { type: new GraphQLNonNull(GraphQLString) },
    cases: { type: new GraphQLList(CaseType) },
    hash: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = QuestionType;
