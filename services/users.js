const FAKE_USERS_REPO = [];

const users = {
  create: user => {
    FAKE_USERS_REPO.push(user);
    return user;
  },
  list: () => FAKE_USERS_REPO,
  findByEmail: email => FAKE_USERS_REPO.find(u => (u.email = email))
};

module.exports = users;
