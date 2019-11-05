/**
 * TODO:
 * BALLISTIC MISSILE THREAT INBOUND TO HAWAII.
 * SEEK IMMEDIATE SHELTER.
 * THIS IS NOT A DRILL.
 */

const auth = require("./auth");
const users = require("./users");

// Step 1: Sign up fake user.
auth.signup({
  email: "steven.xie@outlook.com",
  password: "poTATO",
  company: "Tugolo"
});

// Step 2: Find the newly-signed-up fake user.
const user = users.findByEmail("steven.xie@outlook.com");
console.log(user);
