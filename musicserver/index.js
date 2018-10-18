const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const cors = require('koa2-cors')
const koaStatic = require('koa-static')

const PORT = 8020
let app = new Koa()
app.listen(PORT, () => {
  console.log(`server is listen in port ${PORT}`)
})
// 跨域
app.use(cors())
// 解析消息体
app.use(bodyparser())
// 引入中间件
app.use(require('./middleware/response'))

// 分发路由
const router = require('./routes')
app.use(router.routes())
app.use(koaStatic('../dist'))