const bcrypt = require("bcrypt");
const gql = require("graphql-tag");
const createError = require("http-errors");
const isEmpty = require("lodash/isEmpty");

const apollo = require("../graphql/apollo");

// BIG SCARY CONSTANT.
const BCRYPT_ROUNDS = 10;

const AuthService = {
  async signup({ email, password, invite_code, first_name, last_name }) {
    // Validate invite code.
    let id;
    let { data, errors } = await apollo.query({
      query: gql`
        query($code: String!) {
          companies(where: { invite_code: { _eq: $code } }) {
            id
          }
        }
      `,
      variables: { code: invite_code },
      fetchPolicy: "no-cache"
    });
    if (errors) throw errors;

    const { companies } = data;
    if (isEmpty(companies)) throw createError(401, "Invalid invite code.");

    [{ id }] = data.companies;

    // Hash password with bcrypt.
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user, and insert into Hasura.
    let user = {
      email,
      pass_hash: hash,
      company_id: id,
      first_name,
      last_name
    };
    ({ data } = await apollo.mutate({
      mutation: gql`
        mutation($user: users_insert_input!) {
          insert_users(objects: [$user]) {
            returning {
              id
              email
              company_id
              admin
              first_name
              last_name
            }
          }
        }
      `,
      variables: { user }
    }));

    // Return created user.
    ({
      returning: [user]
    } = data.insert_users);
    delete user.__typename;
    return user;
  },

  async login({ email, password }) {
    const { data, errors } = await apollo.query({
      query: gql`
        query($email: String!) {
          users(where: { email: { _eq: $email } }) {
            id
            email
            pass_hash
            company_id
            admin
            first_name
            last_name
          }
        }
      `,
      variables: { email },
      fetchPolicy: "no-cache"
    });
    if (errors) throw errors;

    const { users } = data;
    if (isEmpty(users)) {
      throw createError(404, `No such user with the email '${email}'.`);
    }

    const [{ pass_hash, ...user }] = users;
    const valid = await bcrypt.compare(password, pass_hash);
    if (!valid) throw createError(403, "Incorrect password.");

    // Password is valid, so return user object.
    delete user.__typename;
    return user;
  }
};

module.exports = AuthService;
