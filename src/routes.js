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
    },
    {
        name: '后台入口',
        icon: 'admin',
        path: '/admin',
        component: AC(() => import('./views/admin/login'))
      },
      {
        name: '后台列表页面',
        icon: 'admin',
        path: '/admin/list',
        component: AC(() => import('./views/admin/list'))
      }
]