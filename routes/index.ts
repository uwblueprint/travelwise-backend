const express = require("express");
const router = express.Router();

// Import services.
const auth = require("../services/auth");
const users = require("../services/users");
const companies = require("../services/companies");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signup", (req, res) => {
  // Sign up with fields from request body.
  const user = auth.signup(req.body, {
    // TODO: Protect this parameter somehow.
    admin: req.query.debugCreateAdmin === "true",
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

router.get("/me", (req, res) => {
  const { user } = req.session;
  if (!user) {
    res.statusCode = 401;
    return res.end();
  }
  res.send(users.obfuscate(user));
});

router.get("/users", (_, res) => {
  const users = users.list();
  res.send(users.map(users.obfuscate));
});

router.post("/companies", (req, res) => {
  const { user } = req.session;
  if (!user) {
    res.statusCode = 401;
    return res.send({ error: "not logged in" });
  }
  if (!user.admin) {
    res.statusCode = 401;
    return res.send({ error: "user not admin" });
  }

  let comp = companies.create(req.body);
  if (!user.admin) comp = companies.obfuscate(comp);
  res.send(comp);
});

router.get("/companies", (req, res) => {
  let comps = companies.list();
  const { user } = req.session;
  if (!user || !user.admin) comps = comps.map(companies.obfuscate);
  res.send(comps);
});

router.get("/companies/:id", (req, res) => {
  let comp = companies.get(req.params.id);
  if (!comp) {
    res.statusCode = 404;
    return res.send({ error: "company not found" });
  }

  const { user } = req.session;
  if (!user || !user.admin) comp = companies.obfuscate(comp);
  res.send(comp);
});

module.exports = router;
