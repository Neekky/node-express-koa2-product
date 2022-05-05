const env = process.env.NODE_ENV;

let MYSQL_CONF;

if (env === "dev") {
  MYSQL_CONF = {
    host: "localhost",
    user: "root",
    password: "24681012",
    port: "3306",
    database: "myblog",
  };
}

if (env === "production") {
  MYSQL_CONF = {
    host: "106.75.26.51",
    user: "root",
    password: "MYSQLmissyou...12",
    port: "3306",
    database: "myBlog",
  };
}

module.exports = {
  MYSQL_CONF,
};
