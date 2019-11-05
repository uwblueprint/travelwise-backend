const auth = require("../services/auth");

router.post("/signup", (req, res) => {
  // Sign up with fields from request body.
  const user = auth.signup(req.body, {
    // TODO: Protect this parameter somehow.
    admin: req.query.debugCreateAdmin === "true"
  });

  req.session.user = user;
  res.send(users.obfuscate(user));
});

router.post("/login", (req, res) => {
  // Login with fields from request body.
  const user = auth.login(req.body);
  req.session.user = user;
  res.send(users.obfuscate(user));
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.send("Logout successful.");
});
