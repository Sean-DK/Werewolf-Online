import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../views/Create.vue')
  },
  {
    path: '/join',
    name: 'Join',
    component: () => import('../views/Join.vue')
  },
  {
    path: '/lobby',
    name: 'Lobby',
    component: () => import('../views/Lobby.vue')
  },
  {
    path: '/roles',
    name: 'Roles',
    component: () => import('../views/Roles.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('../views/Game.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
