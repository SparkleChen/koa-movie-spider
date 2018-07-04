const Router = require ('Koa-Router')
const glob = require('glob')
const { resolve } = require('path')
const _ = require('lodash')
import R from 'ramda'

const symbolPrefix = Symbol('prefix')
const routerMap = new Map()
const isArray = c => _.isArray(c) ? c : [c]


export class Route {
    constructor(app,apiPath){
        this.app = app
        this.apiPath = apiPath
        this.router = new Router()
    }
    init(){ 
        glob.sync(resolve(this.apiPath,'./**/*.js')).forEach(require);
        for(let [conf,controller] of routerMap){
           const controllers = isArray(controller)
           const prefixPath = conf.target[symbolPrefix]
           if(prefixPath) prefixPath = normalizePath(prefixPath)
           const routerPath = prefixPath + conf.path
           this.router[conf.method](routerPath,...controllers)
        }
        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())
    }
}
const normalizePath = path => path.startsWith('/') ? path :`/${path}`

const router = conf => (target,key,descriptor) => {
    conf.path = normalizePath(conf.path)
    routerMap.set({
        target:target,
        ...conf
    },target[key])    
}

export const controller = path => target =>(target.prototype[symbolPrefix] = path)

export const get = path => router({
    method:'get',
    path:path
})

export const post = path => router({
    method:'post',
    path:path
})

export const put = path => router({
    method:'put',
    path:path
})

export const del = path => router({
    method:'delete',
    path:path
})

export const use = path => router({
    method:'use',
    path:path
})

export const all = path => router({
    method:'all',
    path:path
})

// const decorate = (args,middleware) => {
//     let [ target, key, descriptor ] = args
//     target[key] = isArray(target[key])
//     target[key].unshift(middleware)
//     return descriptor   
// }

// export const convert = middleware => (...args) => decorate(args,middleware)

const changeToArr = R.unless(
    R.is(Array),
    R.of
  )

export const convert = middleware => (target, key, descriptor) => {
    target[key] = R.compose(
      R.concat(
        changeToArr(middleware)
      ),
      changeToArr
    )(target[key])
    return descriptor
  }

/**
 * @Required({
 *   body: ['name', 'password']
 * })
 */
export const Required = rules => convert(async (ctx, next) => {
    let errs = []  
    R.forEachObjIndexed(
      (val, key) => {
        errs = errs.concat(
          R.filter(
            name => !R.has(name, ctx.request[key])
          )(val)
        )
      }
    )(rules)
    if (!R.isEmpty(errs)) {
      return (
        ctx.body = {
          success: false,
          code: 412,
          err: `${R.join(', ', errs)} is required`
        }
      )
    }
    await next()
  })

export const Auth = convert(async (ctx, next) => {
    if (!ctx.session.user) {
      return (
        ctx.body = {
          success: false,
          code: 401,
          err: '登陆信息已失效, 请重新登陆'
        }
      )
    }
    await next()
  })

  export const admin = roleExpected => convert(async (ctx, next) => {
   const { role } = ctx.session.user
    if (!role || role !== roleExpected) {
      return (
        ctx.body = {
          success: false,
          code: 403,
          err: '你没有权限，来错地方了'
        }
      )
    }
    await next()
  })