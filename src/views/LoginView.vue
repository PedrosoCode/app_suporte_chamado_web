<script setup lang="ts">
import { reactive, ref } from 'vue'
// import MainNavbar from '@/components/MainNavbar.vue'
import axios from 'axios'
import { onMounted } from 'vue'
import router from '@/router'

const initCadastro: CadastroState = {
  sNomeUsuario: '',
  sEmail: '',
  sSenha: '',
  nCodigoEmpresa: 0,
}

const initLogin: LoginState = {
  sNomeUsuario: '',
  sSenha: '',
  nCodigoEmpresa: 0,
}

export interface CadastroState {
  sNomeUsuario: string
  sEmail: string
  sSenha: string
  nCodigoEmpresa: number
}

export interface LoginState {
  sNomeUsuario: string
  sSenha: string
  nCodigoEmpresa: number
}

interface cboEmpresaState {
  nome_fantasia: string
  razao_social: string
  codigo: number
}

const tabAtual = ref<'login' | 'cadastro'>('login')

const cboEmpresaValues = ref<cboEmpresaState[]>([])

const loginForm = reactive<LoginState>({ ...initLogin })
const registerForm = reactive<CadastroState>({ ...initCadastro })

function btnLogarClick() {
  axios
    .post(import.meta.env.VITE_DEFAULT_API_LINK + '/loginsignup/login', {
      sNomeUsuario: loginForm.sNomeUsuario,
      sSenha: loginForm.sSenha,
      nCodigoEmpresa: loginForm.nCodigoEmpresa,
    })
    .then((response) => {
      localStorage.setItem('jwtToken', response.data.token)

      // window.location.href = '/'
      router.push("home")
    })
    .catch((error) => {
      console.log(error)
      alert('Login falhou: ' + (error.response?.data?.message || 'Erro desconhecido'))
    })
}

function btnCadastroClick() {
  console.log(registerForm)

  axios
    .post(import.meta.env.VITE_DEFAULT_API_LINK + '/loginsignup/cadastrar', {
      sNomeUsuario: registerForm.sNomeUsuario,
      sEmail: registerForm.sEmail,
      sSenha: registerForm.sSenha,
      nCodigoEmpresa: registerForm.nCodigoEmpresa,
    })
    .then((response) => console.log(response))
    .catch((error) => console.log(error))
}

async function loadComboEmpresa() {
  try {
    const response = await axios.get(
      import.meta.env.VITE_DEFAULT_API_LINK + '/loginsignup/combo/empresas',
    )
    cboEmpresaValues.value = response.data
    console.log('Dados carregados:', cboEmpresaValues.value)
  } catch (error) {
    console.error('Erro ao carregar empresas:', error)
  }
}

function trocarTab() {
  tabAtual.value = tabAtual.value === 'login' ? 'cadastro' : 'login'
}

onMounted(() => {
  loadComboEmpresa()
})
</script>

<template>
  <div class="bg-slate-100 min-h-screen">
  <main class="flex flex-col mx-5">
    <!-- <MainNavbar /> -->

    <!-- Container centralizado -->
    <div class="max-w-md w-full mx-auto mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
      <!-- Abas de Login / Cadastro -->
      <div class="flex border-b">
        <button @click="trocarTab()" type="button" class="flex-1 py-3 text-center font-medium transition-colors
                 bg-emerald-300 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200
                 rounded-tl-2xl">
          Login
        </button>
        <button @click="trocarTab()" type="button" class="flex-1 py-3 text-center font-medium transition-colors
                 bg-emerald-300 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200
                 rounded-tr-2xl">
          Cadastro
        </button>
      </div>

      <!-- Formulários -->
      <div class="p-6 space-y-6">
        <!-- Login -->
        <section v-if="tabAtual == 'login'" id="home" role="tabpanel" aria-labelledby="login-tab" class="space-y-4">
          <div class="space-y-2">
            <label for="loginUserName" class="block text-sm font-medium text-gray-700">Usuário</label>
            <input v-model="loginForm.sNomeUsuario" id="loginUserName" type="text" placeholder="Seu usuário"
              class="w-full rounded-md border border-slate-300 px-4 py-2 focus:ring-emerald-300 focus:border-emerald-300 transition" />
          </div>

          <div class="space-y-2">
            <label for="loginEmpresa" class="block text-sm font-medium text-gray-700">Empresa</label>
            <select v-model="loginForm.nCodigoEmpresa" id="loginEmpresa" required
              class="w-full rounded-md border border-slate-300 px-4 py-2 bg-white focus:ring-emerald-300 focus:border-emerald-300 transition">
              <option value="0">Selecione uma empresa</option>
              <option v-for="empresa in cboEmpresaValues" :key="empresa.codigo" :value="empresa.codigo">
                {{ empresa.nome_fantasia }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="loginPassword" class="block text-sm font-medium text-gray-700">Senha</label>
            <input v-model="loginForm.sSenha" id="loginPassword" type="password"
              class="w-full rounded-md border border-slate-300 px-4 py-2 focus:ring-emerald-300 focus:border-emerald-300 transition" />
          </div>

          <button @click="btnLogarClick()"
            class="w-full py-2 mt-4 text-white font-semibold rounded-md bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition">
            Entrar
          </button>
        </section>

        <!-- Cadastro -->
        <section v-if="tabAtual == 'cadastro'" id="profile" role="tabpanel" aria-labelledby="cadastro-tab" class="space-y-4">
          <div class="space-y-2">
            <label for="registerNomeUsuario" class="block text-sm font-medium text-gray-700">Nome de usuário</label>
            <input v-model="registerForm.sNomeUsuario" id="registerNomeUsuario" type="text" placeholder="Seu usuário"
              class="w-full rounded-md border border-slate-300 px-4 py-2 focus:ring-emerald-300 focus:border-emerald-300 transition" />
          </div>

          <div class="space-y-2">
            <label for="registerEmail" class="block text-sm font-medium text-gray-700">E-mail</label>
            <input v-model="registerForm.sEmail" id="registerEmail" type="email" placeholder="email@exemplo.com"
              class="w-full rounded-md border border-slate-300 px-4 py-2 focus:ring-emerald-300 focus:border-emerald-300 transition" />
            <p class="text-xs text-gray-500">Suas informações estão seguras conosco.</p>
          </div>

          <div class="space-y-2">
            <label for="registerEmpresa" class="block text-sm font-medium text-gray-700">Empresa</label>
            <select v-model="registerForm.nCodigoEmpresa" id="registerEmpresa" required
              class="w-full rounded-md border border-slate-300 px-4 py-2 bg-white focus:ring-emerald-300 focus:border-emerald-300 transition">
              <option value="0">Selecione uma empresa</option>
              <option v-for="empresa in cboEmpresaValues" :key="empresa.codigo" :value="empresa.codigo">
                {{ empresa.nome_fantasia }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="registerPassword" class="block text-sm font-medium text-gray-700">Senha</label>
            <input v-model="registerForm.sSenha" id="registerPassword" type="password"
              class="w-full rounded-md border border-slate-300 px-4 py-2 focus:ring-emerald-300 focus:border-emerald-300 transition" />
          </div>

          <button @click="btnCadastroClick()"
            class="w-full py-2 mt-4 text-white font-semibold rounded-md bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition">
            Cadastrar
          </button>
        </section>
      </div>
    </div>
  </main>
  </div>
</template>
