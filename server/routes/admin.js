const { controller,get,post,del,Auth,admin,Required } = require('../lib/decorator')
const { checkPassword }  = require('../services/user')
const { getAllMovies,findAndRemove }  = require('../services/movie')
@controller('api/v0/user')
export class AdminController{
    @get('/movie/list')
    @Auth
    @admin('admin')
    async getMovieList (ctx,next ){             
        const movies = await getAllMovies()
        ctx.body = {
            data:movies,
            success:true
        }
    } 
   @post('/login')
   @Required({
    body: ['email', 'password']
    })
   async adminLogin (ctx,next ){      
       const { email, password } = ctx.request.body
       const matchData = await checkPassword(email,password)
       if(!matchData.user){
          return (ctx.body={
              success : false,
              err:'用户不存在'
          })
       }

       if(matchData.match){
           ctx.session.user = {
               _id : matchData.user._id,
               email : matchData.user.email,
               role : matchData.user.role,
               username : matchData.user.username
           }
          return (ctx.body={
              success:true
          })
       }

       return (ctx.body={
        success:false,
        err:'密码不正确'
    })
   }
   @del('/movies')
   @Required({
       query:['id']
   })
   async remove (ctx,next ){           
       const id = ctx.query.id
       const movie = await findAndRemove(id)
       const movies = await getAllMovies()
       ctx.body = {
           data:movies,
           success:true
       }
   } 
}