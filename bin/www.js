const http = require("http");

const PORT = 8888;

const serverHanlder = require("../app");

const server = http.createServer(serverHanlder);

server.listen(PORT, () => {
  console.log("server start!");
});
