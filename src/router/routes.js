import login from '@/page/login'
import signIn from '@/page/signIn'
import main from '@/page/main'
import home from '@/page/home'
import overTime from '@/page/overTime'
import record from '@/page/record'

const routes = [
  {
    path: '',
    redirect: '/main'
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      requireAuth: 'no'
    }
  },
  {
    path: '/signIn',
    name: 'signIn',
    component: signIn,
    meta: {
      requireAuth: 'no'
    }
  },
  {
    path: '/main',
    name: 'main',
    component: main,
    children: [
      {
        path: '',
        name: 'home',
        component: home
      },
      {
        path: 'overTime',
        name: 'overTime',
        component: overTime
      },
      {
        path: 'record',
        name: 'record',
        component: record
      }
    ]
  }
]

export default routes
