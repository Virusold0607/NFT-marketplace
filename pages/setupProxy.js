const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://gateway.pinata.cloud",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};