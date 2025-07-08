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
      meta: { requerLogin: true },
    },
    {
      path: '/nova_sessao/acesso/:acesso/remetente/:remetente/empresa/:empresa',
      name: 'nova_sessao',
      component: ChatView,
      meta: { requerLogin: true },
    },
    {
      path: '/suporte_hub',
      name: 'suporte_hub',
      component: SuporteHub,
      // meta: { requerLogin: true, requerUsuarioSuporte : true },
      meta: { requerLogin: true },
    },
    {
      path: '/anexo',
      name: 'anexo',
      component: AnexoView,
      meta: { requerLogin: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token: string | null = localStorage.getItem('jwtToken')
  let tokenPayload: any = null

  if (token) {
    try {
      tokenPayload = JSON.parse(atob(token.split('.')[1]))
    } catch (error) {
      // Token inválido
      localStorage.removeItem('jwtToken')
      return next({ name: 'login' }) 
    }

    const isExpired = Date.now() > tokenPayload.exp * 1000
    if (isExpired) {
      localStorage.removeItem('jwtToken')
      return next({ name: 'login' }) 
    }
  }

  // Caso a rota exija login
  if (to.matched.some(record => record.meta.requerLogin)) {
    if (!token) {
      return next({ name: 'login' }) 
    }
  }

  // Caso exija perfil de suporte
  if (to.matched.some(record => record.meta.requerUsuarioSuporte)) {
    if (tokenPayload.jwt_bPrestaSuporte == true) {
      return next() 
    } else {
      return next({ name: 'home' }) 
    }
  }

  next() 
})


export default router
