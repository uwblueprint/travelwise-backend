const express = require("express");
const router = express.Router();

const auth = require("../services/auth");
const filesRouter = require("./files");

router.get("/", function(req, res, next) {
  res.send({ name: "travelwise-backend" });
});

router.use("/files", filesRouter);

router.post("/signup", async ({ body, session }, res, next) => {
  try {
    const user = await auth.signup(body);
    session.user = user;
    res.send(user);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async ({ body, session }, res, next) => {
  try {
    const user = await auth.login(body);
    session.user = user;
    res.send(user);
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.send("Logout successful.");
});

router.get("/webhook", ({ session }, res) => {
  const { user } = session;
  const headers = { "X-Hasura-Role": "anonymous" };
  if (user) {
    headers["X-Hasura-Role"] = user.admin ? "admin" : "user";
    headers["X-Hasura-ID"] = user.id.toString();
  }
  res.send(headers);
});

module.exports = router;
