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
  <div class="container my-4">
    <h4>O acesso do chamado é: {{ sAcesso }}</h4>
    <div class="row my-2 mt-5">
      <div class="col-md-12">
        <div ref="chatContainer" class="border rounded overflow-auto" style="height: 60vh">
          <!-- Mensagens dinâmicas -->
          <div v-for="(chatMensagem, index) in arrMensagem" :key="index" class="row">
            <div :class="['col-md-10 m-2', chatMensagem.nRemetente !== nRemetenteAtual ? '' : 'ms-auto']">
              <div :class="['card mb-3', chatMensagem.nRemetente === nRemetenteAtual ? 'border-primary' : 'border-success']">
                <div class="card-header">{{ chatMensagem.nRemetente }}</div>
                <div class="card-body" :class="chatMensagem.nRemetente === nRemetenteAtual ? 'text-primary' : 'text-success'">
                  <p class="card-text">{{ chatMensagem.sTexto }}</p>

                   <!-- <small class="text-muted"> {{ chatMensagem.dDataEnvio?.toLocaleTimeString() ?? 'Horário inválido' }}</small> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row my-5 align-items-center">
      <div class="col-md-10">
        <input
          v-model="sNovaMensagem"
          type="text"
          class="form-control"
          placeholder="digite a mensagem..."
          @keyup.enter="EnviarMensagem"
        >
      </div>
      <div class="col-md-2 d-flex gap-2">
        <button
          class="btn btn-primary flex-fill"
          @click="EnviarMensagem"
        >
          Enviar
        </button>
        <button class="btn btn-secondary flex-fill">Anexo</button>
      </div>
    </div>
  </div>
</template>
