<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import axios from "axios";
import { onMounted } from "vue";

// const router = useRouter()

const token = localStorage.getItem("jwtToken");

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
        <div
          v-for="suportes in dadoChamados"
          :key="suportes.nCodigoAcesso"
          class="flex flex-col md:flex-row bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <!-- Card principal -->
          <div class="md:w-10/12 border-r">
            <div class="border-b px-6 py-4 bg-emerald-100 text-emerald-800 font-semibold">
              {{ suportes.sNomeEmpresa }}
            </div>
            <div class="px-6 py-4 space-y-2">
              <p class="text-gray-800 font-medium">
                {{ suportes.sUsuarioAbertura }} - {{ suportes.sAssuntoChamado }} - {{ suportes.nCodigoAcesso }}
              </p>
              <footer class="text-sm text-gray-500">
                Breve descrição do que está acontecendo no sistema
              </footer>
            </div>
          </div>

          <!-- Prioridade -->
          <div class="md:w-2/12 flex items-center justify-center bg-gray-50 p-4">
            <div class="text-center">
              <div class="text-sm text-gray-600 mb-1">N° Prioridade</div>
              <div class="text-4xl font-bold text-emerald-600">15</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
