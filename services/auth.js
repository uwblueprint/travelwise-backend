const bcrypt = require("bcrypt");

const users = require("./users");
const companies = require("./companies");

// BIG SCARY CONSTANT.
const BCRYPT_ROUNDS = 10;

const AuthService = {
  signup: ({ password, token, ...otherFields }, { admin }) => {
    // Hash password.
    const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
    if (admin) return users.create({ passwordHash: hash, ...otherFields }, { admin });

    const comp = companies.findByToken(token);
    if (!comp) throw new Error("auth: Invalid company invite token.");
    return users.create({
      passwordHash: hash,
      companyId: comp.id,
      ...otherFields
    });
  },

  // Use passport to login (and handle session cookies, etc.)
  login: ({ email, password }) => {
    // Find user by their email in repo.
    const user = users.findByEmail(email);
    if (!user) throw new Error("No such user.");

    // Check if password is valid, and call done.
    const valid = bcrypt.compareSync(password, user.passwordHash);
    if (!valid) throw new Error("Invalid password.");

    // Password is valid, so return user.
    return user;
  }
};

module.exports = AuthService;
