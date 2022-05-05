const { exec } = require("../db/mysql");

const login = (params) => {
  try {
    const { username, password } = params;

    const sql = `
        select username, realname from users where username = '${username}' and password = '${password}'
    `;

    return exec(sql).then((rows) => {
      return rows[0] || {};
    });
  } catch (error) {
    return Promise.resolve({ error: error.toString() });
  }
};

module.exports = {
  login,
};
