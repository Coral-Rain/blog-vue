import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import PersonHome from '../components/person/PersonHome'
import Newest from '../components/person/Newest'
import Activity from '../components/person/Activity'
import Tweet from '../components/person/Tweet'
import Popular from '../components/person/Popular'
import WriteBlog from '../components/blog/WriteBlog'
import BlogDetail from '../components/blog/BlogDetail'

Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'HomeDefault',
      component: Home
    },
    {
      path: '/blog',
      name: 'Home',
      component: Home,
      meta: {
        skipAuth: true,
        title: '博客专区'
      }
    },
    {
      path: '/u/:userId',
      name: 'PersonHome',
      component: PersonHome,
      children: [
        {
          path: '',
          name: 'PersonDefault',
          component: Newest
        },
        {
          path: 'popular',
          name: 'Popular',
          component: Popular
        },
        {
          path: 'newest',
          name: 'Newest',
          component: Newest
        },
        {
          path: 'activity',
          name: 'Activity',
          component: Activity
        },
        {
          path: 'tweet',
          name: 'Tweet',
          component: Tweet
        }
      ]
    },
    {
      path: '/u/:userId/admin/profile',
      name: 'PersonProfile',
      component: PersonHome
    },
    {
      path: '/u/:userId/blog/write',
      name: 'WriteBlog',
      component: WriteBlog
    },
    {
      path: '/u/:userId/blog/:blogId',
      name: 'BlogDetail',
      component: BlogDetail
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.meta.title){
    document.title = to.meta.title
  }
  if(!to.matched.some(res => res.meta.skipAuth)){
    if(localStorage.getItem("user")){
      next()
    }else{
      //登录页
      router.replace("/index/login")
    }
  }
  else{
    next()
  }
})

export default router
