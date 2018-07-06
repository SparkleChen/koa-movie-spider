const {controller,get} = require('../lib/decorator')
const {getAllMovies,getMovieDetail,getRelativeMovies}  = require('../services/movie')

@controller('api/v0/movies')
export class MovieController{
   @get('/')
   async getMovies (ctx,next ){      
       const { type, year } = ctx.query
       const movies = await getAllMovies(type,year)
       ctx.body = {
           data:movies,
           success:true
       }
   }
   @get('/:id')
   async getMovieDetail (ctx,next ){      
       const id = ctx.params.id
       const movie = await getMovieDetail(id)
       const relativeMovies = await getRelativeMovies(movie)

       ctx.body = {
           data:{
               movie,
               relativeMovies
           },
           success:true
       }
   }
}