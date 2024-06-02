//경로

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',   // 서버 URL or localhost:설정한포트번호
            // target: 'http://13.209.41.67:8080',
            changeOrigin: true,
        })
    );
};

// setupProxy.js

/*const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://localhost:8080',
            changeOrigin: true,
        })
    );
};*/
