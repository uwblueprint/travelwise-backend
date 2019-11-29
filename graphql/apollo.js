const { default: ApolloClient } = require("apollo-boost");
const fetch = require("node-fetch");

const client = new ApolloClient({
  uri: process.env.HASURA_GRAPHQL_URL,
  headers: {
    "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET
  },
  fetch
});

module.exports = client;
