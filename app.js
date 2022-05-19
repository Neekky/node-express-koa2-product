const env = process.env.NODE_ENV;
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");
const querystring = require("querystring");
const { getPostData } = require("./src/util");
const { getCookieExpires } = require("./src/util");
const { get, set } = require("./src/db/redis");

// const SESSION_DATA = {};

const serverHanlder = (req, res) => {
  // 设置返回格式
  res.setHeader("Content-type", "application/json");

  // 获取query
  const url = req.url;
  const query = url.split("?")[1];

  // 解析path
  req.path = url.split("?")[0];

  // 解析query
  req.query = querystring.parse(query);

  // 解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").forEach((item) => {
    if (!item) return;
    const [k, v] = item.split("=");
    req.cookie[k.trim()] = v.trim();
  });

  // 解析session
  // let userId = req.cookie.userid;
  // let needSetCookie = false;

  // // 设置SESSION_DATA
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {};
  //   }
  // } else {
  //   needSetCookie = true;
  //   userId = `${Date.now()}_${Math.random()}`;
  //   SESSION_DATA[userId] = {};
  // }

  // req.session = SESSION_DATA[userId];
  // console.log(SESSION_DATA)

  // 解析session 使用redis
  let needSetCookie = false;
  let userId = req.cookie.userid;

  // 无userId，则进行设置，cookie埋入
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    set(userId, {});
  }

  req.sessionId = userId;

  get(req.sessionId)
    .then((sessionData) => {
      if (sessionData === null) {
        // 无值，初始化redis中的session
        set(req.sessionId, {});
        req.session = {};
      } else {
        // 将结果设置给session
        req.session = sessionData;
      }

      // 处理getPostData，此时，所有接口都要经过这个登录校验
      return getPostData(req);
    })
    .then((postData) => {
      req.body = postData;

      const blogResult = handleBlogRouter(req, res);
      if (blogResult) {
        // 是否要设置登录cookie
        if (needSetCookie) {
          res.setHeader(
            "Set-Cookie",
            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }

        blogResult.then((blogData) => {
          res.end(JSON.stringify(blogData));
        });

        return;
      }

      const userResult = handleUserRouter(req, res);

      if (userResult) {
        // 是否要设置登录cookie
        if (needSetCookie) {
          res.setHeader(
            "Set-Cookie",
            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }

        userResult.then((userData) => {
          res.end(JSON.stringify(userData));
        });
        return;
      }

      res.writeHead(404, { "Content-type": "rext/plain" });
      res.write("404 nor found\n");
      res.end("404 nor found\n");
    });
};

module.exports = serverHanlder;
