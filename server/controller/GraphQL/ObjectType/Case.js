const {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');


const CaseType = new GraphQLObjectType({
  name: 'Case',
  description: 'This represent a case',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    val: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = CaseType;
