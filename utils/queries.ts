const gql = require("graphql-tag");

const ADD_FILE = gql`
  mutation addFile(
    $companyId: Int!
    $location: String!
    $title: String!
    $key: String!
    $fileSize: String!
  ) {
    insert_files(
      objects: {
        company_id: $companyId
        location: $location
        title: $title
        key: $key
        file_size: $fileSize
      }
    ) {
      returning {
        id
        company_id
        location
        title
        key
      }
    }
  }
`;

const GET_FILE = gql`
  query($id: Int!) {
    files(where: { id: { _eq: $id } }) {
      key
      title
      location
	  date_created
	  file_size
    }
  }
`;

module.exports = { ADD_FILE, GET_FILE };
