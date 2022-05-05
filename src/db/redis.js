const redis = require("redis");
const { REDIS_CONF } = require("../conf/db");

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

redisClient.on("error", (err) => {
  console.error(err);
});

const set = (key, val) => {
  let temp = val;
  if (typeof val === "object") {
    temp = JSON.stringify(temp);
  }
  redisClient.set(key, temp, redis.print);
};

const get = (key) => {
  return new Promise((res, rej) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        rej(err);
        return;
      }

      if (val === null) {
        res(null);
        return;
      }
      try {
        res(JSON.parse(val));
      } catch (error) {
        res(val);
      }
    });
  });
};

module.exports = {
  get,
  set,
};
