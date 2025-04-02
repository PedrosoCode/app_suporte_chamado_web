import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'
import SuporteHub from '../views/suporteHub.vue'
import LoginView from '../views/LoginView.vue'

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
    },
    {
      path: '/nova_sessao/acesso/:acesso/remetente/:remetente',
      name: 'nova_sessao',
      component: ChatView,
    },
    {
      path: '/suporte_hub',
      name: 'suporte_hub',
      component: SuporteHub,
    },
  ],
})



export default router
