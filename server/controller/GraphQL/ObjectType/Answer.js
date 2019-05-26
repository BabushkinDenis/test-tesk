const {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');


const AnswerType = new GraphQLObjectType({
  name: 'Answer',
  description: 'This represent a answer',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    idQuestion: { type: GraphQLInt },
    idCase: { type: GraphQLInt },
    uid: { type: GraphQLString },
  }),
});

module.exports = AnswerType;
