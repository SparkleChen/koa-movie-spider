const Koa = require('koa')
const {resolve} = require ('path')
const { connect,initSchames,initAdmin} = require ('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['common','router','parcel']

const useMiddlewares = app =>{
    R.map(
        R.compose(
            R.forEachObjIndexed(
                initWith => initWith(app)
            ),
            require,
            name => resolve(__dirname,`./middlewares/${name}`)
        )
    )(MIDDLEWARES)
}
//链接数据库
;(async () => {
   await connect()
   initSchames()
   //initAdmin()
   //require('./task/movie')
   //require('./task/api')
   //require('./task/trailer')
   //require('./task/qiniu')

   const app = new Koa()
   await useMiddlewares(app) 
   app.listen(3003)
})()











