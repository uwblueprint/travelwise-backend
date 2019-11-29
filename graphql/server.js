const { gql, ApolloServer } = require("apollo-server-express");

const typeDefs = gql`
  type viewer {
    admin: Boolean!
    company_id: Int
    email: String!
    first_name: String!
    id: Int!
    last_name: String!
  }

  type Query {
    viewer: viewer
  }
`;

const resolvers = {
  Query: {
    viewer: (parent, args, context) => context.user || null
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ user: req.session.user })
});

module.exports = server;
