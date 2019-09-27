const uuid = require("uuid/v4");
const omit = require("lodash/omit");

const FAKE_USERS_REPO = {};

const users = {
  create({ email, passwordHash, companyId }, options = {}) {
    const { admin = false } = options;
    const id = uuid();
    const user = { id, email, passwordHash, companyId, admin };

    // TODO: Use real datasource.
    FAKE_USERS_REPO[id] = user;

    return user;
  },

  list() {
    return Object.values(FAKE_USERS_REPO);
  },

  findByEmail(email) {
    return this.list().find(u => u.email == email);
  },

  obfuscate: user => omit(user, "passwordHash")
};

module.exports = users;
