import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'
import SuporteHub from '../views/suporteHub.vue'
import LoginView from '../views/LoginView.vue'
import AnexoView from '@/views/AnexoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/nova_sessao/acesso/:acesso/remetente/:remetente/empresa/:empresa',
      name: 'nova_sessao',
      component: ChatView,
      meta: { requiresAuth: true },
    },
    {
      path: '/suporte_hub',
      name: 'suporte_hub',
      component: SuporteHub,
      meta: { requiresAuth: true },
    },
    {
      path: '/anexo',
      name: 'anexo',
      component: AnexoView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwtToken')

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: 'login' })
    } else {
      const isExpired = checkTokenExpiration(token)
      if (isExpired) {
        localStorage.removeItem('jwtToken')
        next({ name: 'login' })
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

function checkTokenExpiration(token : any) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000
    return Date.now() > exp
  } catch (error) {
    return true
  }
}




export default router
