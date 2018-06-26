//const Router = require('koa-router')
//const mongoose = require ('mongoose')

//const router = new Router()
const {controller,get,post,put } = require('../lib/decorator')
const {getAllMovies,getMovieDetail,getRelativeMovies}  = require('../services/movie')

@controller('api/v0/movies')
export class movieController{
   @get('/')
   async getMovies (ctx,next ){      
       const { type, year } = ctx.query
       const movies = await getAllMovies(type,year)
       ctx.body = {
           movies
       }
   }

   @get('/:id')
   async getMovieDetail (ctx,next ){      
       const id = ctx.params.id
       console.log(id)
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