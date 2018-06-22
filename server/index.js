const Koa = require('koa')
const app = new Koa()
const mongoose = require ('mongoose')
const { connect,initSchames } = require ('./database/init')

//链接数据库
;(async () => {
   await connect()
   initSchames()
   //require('./task/movie')
   //require('./task/api')
})()


app.use(async (ctx,next) => {
    ctx.body = '电影首页'
})
app.listen(3003)








// ------------------------------第一章------------------------------------
// let 和 const 不存在变量提升 不允许重复声明，只能在声明之后使用 在于块级作用域中生效
// const 赋值后不允许在赋其他值
// var a = []
// for(var i=0;i<5;i++) {
//   a[i] = function () {
//       console.log(i)
//   }
// }

// var b = []
// for(let j=0;j<5;j++) {
//   a[j] = function () {
//       console.log(j)
//   }
// }
//------------------------------第二章------------------------------------
//数组的解构 let [a,b,c] = [1,2,3]
//数组解构默认值 let [a = 1 ,b ] = [undefined,3] 
//若右侧对应之为 undefined就取默认值，否则默认值不会生效及取对应的解构值
//
//对象的解构是按属性名称来决定的
//let { bar, foo } = { foo: "aaa", bar: "bbb" }
//默认值与数组相似
//
//函数参数的解构
// function move({x = 0, y = 0} = {}) {
//     return [x, y];
// }

// move({x: 3, y: 8}); // [3, 8]
// move({x: 3}); // [3, 0]
// move({}); // [0, 0]
// move(); // [0, 0]
// ------------------------------第三章------------------------------------
// rest参数 (...变量名)  
// function (...val){  
//    val现在为传入参数组成的数组
// }
// 箭头函数 =>
//
//
//
//




