<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute();

const sRemetenteAtual: string = String(route.params.remetente ?? '');
const sAcesso: string = String(route.params.acesso ?? '');

interface interMessage {
  sRemetente: string
  sTexto: string
  dDataEnvio: Date
}

const arrMensagem = ref<interMessage[]>([])
const sNovaMensagem = ref('')
const ws = ref<WebSocket | null>(null)

const setupWebSocket = () => {
  ws.value = new WebSocket(`ws://localhost:3000/chat/${sAcesso}`)

  ws.value.onmessage = async (event) => {
  try {
    const rawData = event.data instanceof Blob
      ? await event.data.text()
      : event.data;

    const dadosBrutos = JSON.parse(rawData);

    // Converter a string para Date
    const jsMensagem: interMessage = {
      ...dadosBrutos,
      dDataEnvio: new Date(dadosBrutos.dDataEnvio)
    };

    arrMensagem.value.push(jsMensagem);
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
  }
}

  ws.value.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

const EnviarMensagem = () => {
  if (!sNovaMensagem.value.trim() || !ws.value) return

  const jsMensagem: interMessage = {
    sRemetente: sRemetenteAtual,
    sTexto: sNovaMensagem.value,
    dDataEnvio: new Date(),
  }

  ws.value.send(JSON.stringify(jsMensagem))
  sNovaMensagem.value = ''
}

onMounted(() => {
  setupWebSocket()
})

onUnmounted(() => {
  if (ws.value) {
    ws.value.close()
  }
})
</script>

<template>
  <div class="container my-4">
    <h4>O acesso do chamado é: {{ sAcesso }}</h4>
    <div class="row my-2 mt-5">
      <div class="col-md-12">
        <div class="border rounded overflow-auto" style="height: 60vh">
          <!-- Mensagens dinâmicas -->
          <div v-for="(chatMensagem, index) in arrMensagem" :key="index" class="row">
            <div :class="['col-md-10 m-2', chatMensagem.sRemetente === sRemetenteAtual ? '' : 'ms-auto']">
              <div :class="['card mb-3', chatMensagem.sRemetente === sRemetenteAtual ? 'border-primary' : 'border-success']">
                <div class="card-header">{{ chatMensagem.sRemetente }}</div>
                <div class="card-body" :class="chatMensagem.sRemetente === sRemetenteAtual ? 'text-primary' : 'text-success'">
                  <p class="card-text">{{ chatMensagem.sTexto }}</p>

                  <small class="text-muted"> {{ chatMensagem.dDataEnvio?.toLocaleTimeString() ?? 'Horário inválido' }}</small>
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
