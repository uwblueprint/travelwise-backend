const express = require("express");
const router = express.Router();

// Import services.
const auth = require("../services/auth");
const users = require("../services/users");

// Initialize passport.
const passport = require("passport");
router.use(passport.initialize());

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signup", (req, res) => {
  // Sign up with fields from request body.
  const user = auth.signup(req.body);
  res.send(user);
});

router.post("/login", auth.login, (req, res) => res.send(req.user));

router.get("/users", (req, res) => res.send(users.list()));

module.exports = router;
