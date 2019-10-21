const gql = require("graphql-tag");

const ADD_FILE = gql`
  mutation addFile(
    $companyId: Int!
    $location: String!
    $title: String!
    $key: String!
  ) {
    insert_files(
      objects: {
        company_id: $companyId
        location: $location
        title: $title
        key: $key
      }
    ) {
      returning {
        id
        company_id
        location
        title
      }
    }
  }
`;

module.exports = { ADD_FILE };
