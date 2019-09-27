const uuid = require("uuid/v4");
const omit = require("lodash/omit");
const randomWords = require("random-words");

const FAKE_COMPANIES_REPO = {};

const companies = {
  create({ name }) {
    const id = uuid();
    const token = randomWords(4).join("-");
    const comp = { id, name, token };

    FAKE_COMPANIES_REPO[id] = comp;
    return comp;
  },

  list: () => Object.values(FAKE_COMPANIES_REPO),

  get: id => FAKE_COMPANIES_REPO[id],

  findByToken(token) {
    return this.list().find(c => (c.token = token));
  },

  obfuscate: c => omit(c, "token")
};

module.exports = companies;
