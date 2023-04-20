import { createProxyMiddleware } from 'http-proxy-middleware'

export default createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/': '/proxy',
  },
})