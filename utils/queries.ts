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

const ADD_COMPANY_FILE = gql`
  mutation addCompanyFile(
    $fromCompanyId: Int!
    $toCompanyId: Int!
    $fileId: Int!
  ) {
    insert_companies_files(
      objects: {
        from_company_id: $fromCompanyId
        to_company_id: $toCompanyId
        file_id: $fileId
      }
    ) {
      affected_rows
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

module.exports = { ADD_FILE, GET_FILE, ADD_COMPANY_FILE };
