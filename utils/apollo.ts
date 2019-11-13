const ApolloClient = require("apollo-boost").default;
const fetch = require("node-fetch");

const client = new ApolloClient({
  uri: "https://travelwise-hasura.herokuapp.com/v1/graphql",
  headers: {
    "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET
  },
  fetch
});

module.exports = client;
