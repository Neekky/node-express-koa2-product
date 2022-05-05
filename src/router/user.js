const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const handleUserRouter = (req, res) => {
  const method = req.method;
  const url = req.url;
  const path = url.split("?")[0];

  if (method === "GET" && path === "/api/user/login") {
    return login(req.query)
      .then((loginCheckData) => {
        if (!loginCheckData?.error && loginCheckData.username) {
          req.session.username = loginCheckData.username;
          req.session.realname = loginCheckData.realname;
          console.log(req.session, "req.session");
          return new SuccessModel(loginCheckData);
        }
        return new ErrorModel(loginCheckData, "登录失败");
      })
      .catch((error) => {
        return new ErrorModel({ error }, "登录失败");
      });
  }

  // 登录验证
  if (method === "GET" && path === "/api/user/logintest") {
    if (req.session.username) {
      return Promise.resolve(
        new SuccessModel({ username: req.session }, "登录成功")
      );
    }
    return Promise.resolve(new ErrorModel(false, "尚未登录"));
  }
};

module.exports = handleUserRouter;
