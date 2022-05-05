const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const handleBlogRouter = (req, res) => {
  const method = req.method;
  const url = req.url;
  const path = url.split("?")[0];
  const { id } = req.query;

  if (method === "GET" && path === "/api/blog/list") {
    return getList(req.query)
      .then((listData) => {
        if (!listData.error) {
          return new SuccessModel(listData);
        }
        return new ErrorModel(listData);
      })
      .catch((error) => {
        return new ErrorModel({ error });
      });
  }

  if (method === "GET" && path === "/api/blog/detail") {
    return getDetail(req.query)
      .then((detailData) => {
        if (!detailData.error) {
          return new SuccessModel(detailData);
        }
        return new ErrorModel(detailData);
      })
      .catch((error) => {
        return new ErrorModel({ error });
      });
  }

  if (method === "POST" && path === "/api/blog/new") {
    return newBlog(req.body)
      .then((newBlogData) => {
        if (!newBlogData.error) {
          return new SuccessModel(newBlogData);
        }
        return new ErrorModel(newBlogData);
      })
      .catch((error) => {
        return new ErrorModel({ error });
      });
  }

  if (method === "POST" && path === "/api/blog/update") {
    return updateBlog({ ...req.body, ...req.query })
      .then((updateBlogData) => {
        if (!updateBlogData?.error) {
          return updateBlogData
            ? new SuccessModel(updateBlogData)
            : new ErrorModel(updateBlogData);
        }
        return new ErrorModel(updateBlogData);
      })
      .catch((error) => {
        return new ErrorModel({ error });
      });
  }

  if (method === "POST" && path === "/api/blog/del") {
    const author = "曾超";
    return delBlog(id, author)
      .then((delBlogData) => {
        if (!delBlogData?.error) {
          return delBlogData
            ? new SuccessModel(delBlogData)
            : new ErrorModel(delBlogData, "删除博客失败");
        }
        return new ErrorModel(delBlogData);
      })
      .catch((error) => {
        return new ErrorModel({ error });
      });
  }
};

module.exports = handleBlogRouter;