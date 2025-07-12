<script setup lang="ts">
import { useRouter } from "vue-router";
import router from "@/router";
import { ref } from "vue";
import axios from "axios";
import { onMounted } from "vue";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  jwt_nCodigoEmpresa: number
  jwt_nCodigoUsuario: number
  jwt_bPrestaSuporte: boolean
}

const token = localStorage.getItem('jwtToken')
const decodedToken = ref<DecodedToken | null>(null)

if (token) {
  try {
    decodedToken.value = jwtDecode<DecodedToken>(token)
  } catch (error) {
    console.error('Erro ao decodificar token:', error)
  }
} else {
  console.warn('Token JWT não encontrado no localStorage')
}

interface interChamado {
  nCodigoEmpresa: number;
  sNomeEmpresa: string;
  sUsuarioAbertura: string;
  sAssuntoChamado: string;
  nCodigoAcesso: number;
}

const dadoChamados = ref<interChamado[]>([]);

async function getListaParceiros() {
  try {
    const response = await axios.post(
      import.meta.env.VITE_DEFAULT_API_LINK + "/hub/listagem",
      {}, // Body vazio
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dadoChamados.value = response.data;
    console.log("Dados recebidos:", dadoChamados.value);
  } catch (error) {
    console.error("Erro ao carregar dos chamados:", error);
  }
}

function acessarSessao(nAcesso : number, nEmpresa : number) {

  router.push({
    name: 'nova_sessao',
    params: {
      acesso: nAcesso,
      remetente: decodedToken.value?.jwt_nCodigoUsuario,
      empresa: nEmpresa
    }
  })
}

onMounted(() => {
  getListaParceiros();
});
</script>
<template>
  <div class="bg-slate-100 min-h-screen py-10 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-emerald-700 mb-8">HUB DE SUPORTE</h1>

      <!-- Lista de suportes -->
      <div class="space-y-6">
        <div v-for="suportes in dadoChamados" :key="suportes.nCodigoAcesso"
          class="flex flex-col md:flex-row bg-white rounded-2xl shadow-md overflow-hidden hover:outline-emerald-400 hover:outline-6 transition-transform duration-200 hover:translate-3 hover:rotate-z-1 hover:skew-x-1 ">
          <!-- Card principal -->
          <div @click="acessarSessao(suportes.nCodigoAcesso, suportes.nCodigoEmpresa)" class="md:w-10/12 border-r cursor-pointer">
            <div class="border-b px-6 py-4 bg-emerald-100 text-emerald-800 font-semibold">
              {{ suportes.sNomeEmpresa }}
            </div>
            <div class="px-6 py-2 space-y-2">
              <p class="text-gray-800 font-medium">
                {{ suportes.sUsuarioAbertura }} - {{ suportes.sAssuntoChamado }} - {{ suportes.nCodigoAcesso }}
              </p>
              <footer class="text-sm text-gray-500 space-y-1">
                <div>
                  Breve descrição do que está acontecendo no sistema
                </div>
                <div>
                  Data Abertura xx/xx/xxxx - x dias atrás
                </div>
              </footer>
            </div>
            <div class="flex gap-2 p-2">
              <div
                class="rounded-md bg-blue-600 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                Pedroso
              </div>
              <div
                class="rounded-md bg-red-600 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                Alguém
              </div>
              <div
                class="rounded-md bg-green-600 py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                Usuário
              </div>

            </div>
            <div class="bg-red-300 p-2 text-center text-yellow-900">
              <p>Δ Este suporte ainda não foi atendido</p>
            </div>
          </div>

          <!-- Prioridade -->
          <div class="md:w-2/12 flex items-center justify-center bg-gray-50 p-4">
            <div class="text-center">
              <div class="text-4xl font-bold text-emerald-600">Baixa</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
