const mongoose = require ('mongoose')
const { resolve } = require('path')
const db = 'mongodb://localhost/douban-trailer'
const glob = require('glob')

mongoose.Promise =  global.Promise

exports.initSchames = () => {
   glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require);
}

exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve,reject) => {
      
      if(process.env.NODE_ENV !== 'production'){
         mongoose.set('debug',true)
      }
      mongoose.connect(db)
      //链接中断
      mongoose.connection.on('disconnented', () => {
          maxConnectTimes ++
          if(maxConnectTimes < 5 ){
              mongoose.connect(db)
          }else{             
              throw new Error ('数据库挂了啊')
          }
      })
      //链接失败
      mongoose.connection.on('error', (err) => {
        reject(err)
        console.log(err)
      })
      //一旦链接成功
      mongoose.connection.once('open', () => {
        resolve()
        console.log('connect successfuly!!!')
      })
  })

}