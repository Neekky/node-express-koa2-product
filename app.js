const serverHanlder = (req, res) => {
  // 设置返回格式
  res.setHeader("Content-type", "application/json");

  const resData = {
    name: "曾超",
    age: 26,
    env: process.env.NODE_ENV
  };

  res.end(JSON.stringify(resData));
};

module.exports = serverHanlder;
