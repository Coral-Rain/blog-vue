import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import PersonHome from '../components/person/PersonHome'
import Newest from '../components/person/Newest'
import Activity from '../components/person/Activity'
import Tweet from '../components/person/Tweet'
import Popular from '../components/person/Popular'
import Followers from '../components/person/Followers'
import Following from '../components/person/Following'
import WriteBlog from '../components/blog/WriteBlog'
import BlogDetail from '../components/blog/BlogDetail'
import Admin from '../components/admin/Admin'
import Profile from '../components/admin/Profile'
import Chpwd from '../components/admin/Chpwd'
import ChangeEmail from '../components/admin/ChangeEmail'
import UserSettings from '../components/admin/UserSettings'
import MailSettings from '../components/admin/MailSettings'
import Privacy from '../components/admin/Privacy'
import OpenId from '../components/admin/OpenId'
import Mobile from '../components/admin/Mobile'
import Drafts from '../components/admin/Drafts'
import Favorites from '../components/admin/Favorites'
import BlogCatalogs from '../components/admin/BlogCatalogs'
import BlogComments from '../components/admin/BlogComments'

Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'HomeDefault',
      component: Home,
      meta: {
        skipAuth: true,
        title: '博客专区'
      }
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
          component: Newest,
          meta: {
            skipAuth: true
          }
        },
        {
          path: 'popular',
          name: 'Popular',
          component: Popular,
          meta: {
            skipAuth: true
          }
        },
        {
          path: 'newest',
          name: 'Newest',
          component: Newest,
          meta: {
            skipAuth: true
          }
        },
        {
          path: 'activity',
          name: 'Activity',
          component: Activity,
          meta: {
            skipAuth: true
          }
        },
        {
          path: 'tweet',
          name: 'Tweet',
          component: Tweet,
          meta: {
            skipAuth: true
          }
        },
        {
          path: 'followers',
          name: 'Followers',
          component: Followers,
          meta: {
            skipAuth: true
          }
        },
        {
          path: 'following',
          name: 'Following',
          component: Following,
          meta: {
            skipAuth: true
          }
        }
      ],
      meta: {
        skipAuth: true
      }
    },
    {
      path: '/u/:userId/admin',
      name: 'PersonAdmin',
      component: Admin,
      children: [
        {
          path: '',
          name: 'AdminDefault',
          redirect: 'profile',
          component: Admin
        },
        {
          path: 'inbox',
          name: 'AdminInbox',
          component: Admin,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'profile',
          name: 'AdminProfile',
          component: Profile,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'chpwd',
          name: 'AdminChpwd',
          component: Chpwd,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'change-email',
          name: 'AdminChangeEmail',
          component: ChangeEmail,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'user-settings',
          name: 'AdminUserSetting',
          component: UserSettings,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'privacy',
          name: 'AdminPrivacy',
          component: Privacy,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'mail-settings',
          name: 'AdminMailSetting',
          component: MailSettings,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'openid',
          name: 'AdminOpenId',
          component: OpenId,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'mobile',
          name: 'AdminMobile',
          component: Mobile,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'drafts',
          name: 'Drafts',
          component: Drafts,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'blog-settings',
          name: 'BlogSetting',
          component: Admin,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'blog-catalogs',
          name: 'BlogCatalog',
          component: BlogCatalogs,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'blog-comments',
          name: 'BlogComment',
          component: BlogComments,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'blog-exports',
          name: 'BlogExport',
          component: Admin,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'translation',
          name: 'Translation',
          component: Admin,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'translation-delivered',
          name: 'TranslationDelivered',
          component: Admin,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'releases',
          name: 'Release',
          component: Admin,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'projects',
          name: 'Project',
          component: Admin,
          children: [{path: '*', redirect: ''}]
        },
        {
          path: 'favorites',
          name: 'Favorites',
          component: Favorites,
          children: [{path: '*', redirect: ''}]
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
      path: '/u/:userId/blog/write/draft/:blogId',
      name: 'EditDraft',
      component: WriteBlog
    },
    {
      path: '/u/:userId/blog/:blogId',
      name: 'BlogDetail',
      component: BlogDetail,
      meta: {
        skipAuth: true
      }
    },
    {
      path: '/u/:userId/blog/:blogId#comments',
      name: 'BlogDetailComment',
      component: BlogDetail,
      meta: {
        skipAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  $('.ui.modals').empty()
  if(to.meta.title){
    document.title = to.meta.title
  }
  if(!to.matched.some(res => res.meta.skipAuth)){
    if(localStorage.getItem("user")){
      next()
    }else{
      //登录页
      router.replace("/")
    }
  }
  else{
    next()
  }
})

export default router
