const getPostData = (req) => {
  return new Promise((res, rej) => {
    if (req.method !== "POST") {
      res({});
      return;
    }

    if (req.headers["content-type"] !== "application/json") {
      res({});
      return;
    }

    let postData = "";

    req.on("data", (chunk) => {
      postData += chunk.toString();
    });

    req.on("end", () => {
      if (!postData) {
        res({});
        return;
      }
      res(JSON.parse(postData));
    });
  });
};

const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  return d.toGMTString();
};

module.exports = {
  getPostData,
  getCookieExpires,
};
