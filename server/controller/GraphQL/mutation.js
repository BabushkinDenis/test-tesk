const {
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
} = require('graphql');

const QuestionType = require('./ObjectType/Question');
const AnswerType = require('./ObjectType/Answer');

const Question = require('../../models/question');
const Case = require('../../models/cases');
const Answer = require('../../models/answers');

const MutationRoot = new GraphQLObjectType({
  name: 'AppMutationSchema',
  description: 'Application Schema Query Root',
  fields: () => ({
    SaveQuestion: {
      type: QuestionType,
      description: 'Create Question',
      args: {
        body: { type: GraphQLString },
        cases: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parentValue, args) {
        let question;
        return Question.create({
          body: args.body,
          hash: Question.generateHash(),
        }).then((res) => {
          question = res;
          return Promise.all(args.cases.map(item => Case.create({
            idQuestion: question.getId(), val: item,
          })));
        }).then(res => ({ ...(question.serialize()), cases: res }));
      },
    },
    SaveAnswer: {
      type: AnswerType,
      description: 'Create Answer',
      args: {
        name: { type: GraphQLString },
        idQuestion: { type: GraphQLInt },
        idCase: { type: GraphQLInt },
        uid: { type: GraphQLString },
      },
      resolve(parentValue, args, context) {
        return Answer.create(args).then((answer) => {
          if (answer instanceof Answer) context.handlerSocket.sendNoty(args.idQuestion);
          return answer;
        });
      },
    },
  }),
});


module.exports = MutationRoot;
