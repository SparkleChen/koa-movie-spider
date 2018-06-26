import AC from './components/async_load'

export default [
    {
        name:'首页',
        icon:'home',
        path:'/',
        component:AC( () => import('./views/home/index') )
    },
    {
        name:'详情页',
        icon:'home',
        path:'/detail/:id',
        component:AC( () => import('./views/movie/detail') )
    }
]