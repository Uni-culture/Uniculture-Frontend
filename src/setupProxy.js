//경로

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',   // 서버 URL or localhost:설정한포트번호
            //target: 'http://54.180.29.40:8080',
            changeOrigin: true,
        })
    );
};
