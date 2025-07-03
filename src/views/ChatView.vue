<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { io, type Socket } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const route = useRoute()

const nRemetenteAtual : number = parseInt(route.params.remetente)
const sAcesso: string = String(route.params.acesso ?? '')

const token : any = localStorage.getItem('jwtToken')
const decodedToken : any = jwtDecode(token)

interface interMessage {
  nRemetente: number
  sTexto: string
  dDataEnvio: Date
  nCodigoChat: number
  nCodigoEmpresa: number
  sNomeUsuario : string
}

const arrMensagem = ref<interMessage[]>([])
const sNovaMensagem = ref('')
const socket = ref<Socket | null>(null)

const setupSocketIO = () => {
  socket.value = io(`${import.meta.env.VITE_DEFAULT_API_LINK}/chat`, {
    auth: {
      token: `Bearer ${token}`
    },
    query: {
      acesso: sAcesso
    }
  });

  // Ouvinte para mensagens do chat específico
  socket.value.on('chat:receber', (dadosBrutos: interMessage) => {
    arrMensagem.value.push({
      ...dadosBrutos,
      dDataEnvio: new Date(dadosBrutos.dDataEnvio)
    });
  });
}

const EnviarMensagem = () => {
  if (!sNovaMensagem.value.trim() || !socket.value) return

  const jsMensagem: interMessage = {
    nRemetente: parseInt(nRemetenteAtual),
    sTexto: sNovaMensagem.value,
    dDataEnvio: new Date(),
    nCodigoChat: parseInt(sAcesso),
    nCodigoEmpresa: decodedToken.jwt_nCodigoEmpresa
  }

  socket.value.emit('chat:enviar', jsMensagem)
  sNovaMensagem.value = ''
}

async function LoadMensagens() {

  try {

    const response = await axios.post(
      import.meta.env.VITE_DEFAULT_API_LINK + '/chat/carregar',
      { nCodigoChat: parseInt(sAcesso),
        nCodigoEmpresa: decodedToken.jwt_nCodigoEmpresa
       },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    arrMensagem.value = response.data
    console.log('Dados recebidos:', arrMensagem.value)

  } catch (error) {
    console.error('Erro ao carregar mensagens inicialmente:', error)
  }

}

onMounted(() => {
  setupSocketIO()
  LoadMensagens()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})

const chatContainer = ref<HTMLElement | null>(null)

// Watch para detectar mudanças nas mensagens
watch(
  () => arrMensagem.value.length,
  async () => {
    await nextTick() // Espera a atualização do DOM
    if (chatContainer.value) {
      // Scroll suave para o final
      chatContainer.value.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  },
  { flush: 'post' } // Executa após a atualização do DOM
)

</script>

<template>
  <div class="bg-slate-100 min-h-screen p-4">
    <h4 class="text-gray-700 mb-4">
      O acesso do chamado é:
      <span class="font-semibold text-emerald-600">{{ sAcesso }}</span>
    </h4>

    <div ref="chatContainer" class="bg-white rounded-2xl shadow-md p-4 overflow-auto h-[60vh]">
      <div
        v-for="(msg, idx) in arrMensagem"
        :key="idx"
        class="flex mb-4"
        :class="msg.nRemetente === nRemetenteAtual ? 'justify-end' : ''"
      >
        <div
          :class="[
            'max-w-[80%] rounded-2xl p-4',
            msg.nRemetente === nRemetenteAtual
              ? 'bg-emerald-100 text-emerald-900 self-end'
              : 'bg-gray-100 text-gray-800'
          ]"
        >
          <div class="font-semibold mb-1">{{ msg.sNomeUsuario }}</div>
          <p class="break-words">{{ msg.sTexto }}</p>
          <div class="text-xs text-gray-500 mt-1">
            {{ msg.dDataEnvio.toLocaleString() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Input e botões responsivos -->
    <div class="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
      <input
        v-model="sNovaMensagem"
        @keyup.enter="EnviarMensagem"
        type="text"
        placeholder="Digite a mensagem..."
        class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <button
        @click="EnviarMensagem"
        class="w-full sm:w-auto px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
      >
        Enviar
      </button>
      <button
        class="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
      >
        Anexo
      </button>
    </div>
  </div>
</template>
