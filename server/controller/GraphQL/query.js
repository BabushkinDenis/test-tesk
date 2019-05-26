const {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
} = require('graphql');

const DB = require('../../dbConnect');
const QuestionCollections = require('../../collections/questionCollection');
const AnswerCollections = require('../../collections/answerCollection');

const QuestionType = require('./ObjectType/Question');
const AnswerType = require('./ObjectType/Answer');

const QueryRoot = new GraphQLObjectType({
  name: 'AppQuerySchema',
  description: 'Application Schema Query Root',
  fields: () => ({
    Questions: {
      type: new GraphQLList(QuestionType),
      description: 'List of all Questions',
      // eslint-disable-next-line no-unused-vars
      resolve() {
        return new QuestionCollections(new DB())
          .getAll();
      },
    },
    Question: {
      type: QuestionType,
      description: 'Question by hash',
      args: {
        hash: { type: GraphQLString },
      },
      // eslint-disable-next-line no-unused-vars
      resolve(parentValue, args) {
        return new QuestionCollections(new DB())
          .getByHash(args.hash);
      },
    },
    Answers: {
      type: new GraphQLList(AnswerType),
      description: 'Question by hash',
      args: {
        hash: { type: GraphQLString },
      },
      // eslint-disable-next-line no-unused-vars
      resolve(parentValue, args) {
        return new AnswerCollections(new DB())
          .getByHash(args.hash);
      },
    },
  }),
});

module.exports = QueryRoot;
