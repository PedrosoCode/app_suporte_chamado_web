<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref, reactive } from 'vue'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { io } from "socket.io-client";

const router = useRouter()

const socket = io(import.meta.env.VITE_DEFAULT_API_LINK);

const bModalNovaSessao = ref<boolean>(false)

interface cboEmpresaState {
  nome_fantasia: string
  razao_social: string
  codigo: number
}

interface DecodedToken {
  jwt_nCodigoEmpresa: number
  jwt_nCodigoUsuario: number
  jwt_bPrestaSuporte: boolean
}

const initAcesso: sAcessoChamado = {
  descricao: ''
}

interface sAcessoChamado {
  descricao: string
}

const inputAcesso = ref<string>('')

const sAcessoValues = reactive<sAcessoChamado>({ ...initAcesso })
const cboEmpresaValues = ref<cboEmpresaState[]>([])
const empresaSelecionada = ref<number>(0)

const decodedToken = ref<DecodedToken | null>(null)
const token = localStorage.getItem('jwtToken')

if (token) {
  try {
    decodedToken.value = jwtDecode<DecodedToken>(token)
  } catch (error) {
    console.error('Erro ao decodificar token:', error)
  }
} else {
  console.warn('Token JWT não encontrado no localStorage')
}

async function NovaSessao() {
  if (!decodedToken.value || !token) {
    console.error('Token não foi decodificado corretamente ou está ausente')
    return
  }

  try {
    const response = await axios.post(
      import.meta.env.VITE_DEFAULT_API_LINK + '/chat/acesso',
      {
        nCodigoParceiro: decodedToken.value.jwt_nCodigoUsuario,
        sDescricao: sAcessoValues.descricao
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    sAcessoValues.descricao = response.data.descricao
  } catch (error) {
    console.error('Erro ao iniciar nova sessão:', error)
  }

  router.push({
    name: 'nova_sessao',
    params: {
      empresa: decodedToken.value.jwt_nCodigoEmpresa.toString(),
      remetente: decodedToken.value.jwt_nCodigoUsuario.toString(),
      acesso: sAcessoValues.descricao
    }
  })
}


function acessarSessao() {

  router.push({
    name: 'nova_sessao',
    params: {
      acesso: inputAcesso.value,
      remetente: decodedToken.value?.jwt_nCodigoUsuario.toString(),
      empresa: empresaSelecionada.value
    }
  })
}

async function HubSuporte() {
  router.push({
    name: 'suporte_hub'
  })
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


onMounted(() => {
  loadComboEmpresa()
  socket.on("connection", () => {
    console.log(socket.id);
  });
})

</script>
<template>
  <div class="bg-slate-100 min-h-screen py-10 px-4">
    <main class="max-w-2xl mx-auto space-y-8">

      <!-- Card: Nova Sessão -->
      <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 class="text-xl font-semibold text-emerald-600">Solicitar nova sessão</h2>
        <button @click="bModalNovaSessao = true"
          class="w-full py-2 px-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition"
          data-bs-toggle="modal" data-bs-target="#modalNovaSessao">
          Solicitar Suporte
        </button>
      </div>

      <!-- Modal: Nova Sessão -->
      <div v-if="bModalNovaSessao === true" id="modalNovaSessao" aria-hidden="true"
        class="fixed inset-0 flex items-center justify-center z-50 bg-slate-100">
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-800">Nova Sessão de Suporte</h3>
            <button @click="bModalNovaSessao = false" class="text-gray-500 p-1 hover:bg-red-500"
              data-bs-dismiss="modal">&times;</button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título do chamado</label>
            <input v-model="sAcessoValues.descricao" type="text"
              class="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Necessito de ajuda com..." />
          </div>

          <div class="flex justify-end space-x-2">
            <button @click="bModalNovaSessao = false" type="button"
              class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              data-bs-dismiss="modal">
              Fechar
            </button>
            <button @click="NovaSessao()" type="button"
              class="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition"
              data-bs-dismiss="modal">
              Iniciar
            </button>
          </div>
        </div>
      </div>

      <!-- Card: Código existente -->
      <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 class="text-xl font-semibold text-emerald-600">Código existente</h2>
        <form @submit.prevent class="space-y-4">
          <input v-model="inputAcesso" type="text"
            class="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Insira um código de sessão" />
          <div class="space-y-2">
            <label for="loginEmpresa" class="block text-sm font-medium text-gray-700">Empresa</label>
            <select v-model="empresaSelecionada"
              class="w-full rounded-md border border-slate-300 px-4 py-2 bg-white focus:ring-emerald-300 focus:border-emerald-300 transition">
              <option value="0">Selecione uma empresa</option>
              <option v-for="empresa in cboEmpresaValues" :key="empresa.codigo" :value="empresa.codigo">
                {{ empresa.nome_fantasia }}
              </option>
            </select>
          </div>

          <button @click="acessarSessao()"
            class="w-full py-2 px-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition">
            Acessar Sessão
          </button>
        </form>
      </div>

      <!-- Card: Ir para Hub de Suporte -->
      <div class="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 class="text-xl font-semibold text-emerald-600">Acompanhar suporte</h2>
        <button @click="HubSuporte"
          class="w-full py-2 px-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition">
          Suportes em andamento
        </button>
      </div>

    </main>
  </div>
</template>
