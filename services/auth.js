const users = require("./users");
const bcrypt = require("bcrypt");

const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");

// Configure Passport to use bcrypt to determine if user password is valid.
passport.use(
  new LocalStrategy(function(email, password, done) {
    // Find user by their email in repo.
    const user = users.findByEmail(email);
    if (!user) done(null, false, { message: "No such user." });

    // Check if password is valid, and call done.
    bcrypt.compare(password, user.passwordHash, (err, valid) => {
      if (err) return done(err); // something happened during Bcrypt algorithm
      if (!valid) return done(null, false, { message: "Invalid password." });
      return done(null, user);
    });
  })
);

// Configure user serialization.
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// BIG SCARY CONSTANT.
const BCRYPT_ROUNDS = 10;

const auth = {
  signup: ({ password, ...otherFields }) => {
    // Hash password.
    const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);

    // Create user in repository.
    const user = users.create({ passwordHash: hash, ...otherFields });
    return user;
  },

  // Use passport to login (and handle session cookies, etc.)
  login: passport.authenticate("local")
};

module.exports = auth;
