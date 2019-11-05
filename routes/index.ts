const express = require("express");
const router = express.Router();

// Import services.
const users = require("../services/users");
const companies = require("../services/companies");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
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
