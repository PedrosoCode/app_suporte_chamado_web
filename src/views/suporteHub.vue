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
  <div>
    <div class="container-fluid my-5">
      <h1 class="ms-3">HUB DE SUPORTE</h1>
      <div class="row">
        <div class="col-md-12">
          <div class="my-5">
            <!-- Card de suportes -->
            <div class="mx-2 my-5" v-for="suportes in dadoChamados" :key="suportes.nCodigoAcesso">
              <div class="col-md-12">
                <div class="row g-0">
                  <!-- Remover espaçamento entre colunas -->
                  <!-- Coluna principal -->
                  <div class="col-md-10 h-100">
                    <!-- Altura total -->
                    <div class="card h-100 border-top-0 border-end-0 rounded-start">
                      <!-- Altura total e bordas ajustadas -->
                      <div class="card-header text-start border-end border-top rounded-top">
                        {{ suportes.sNomeEmpresa }}
                      </div>
                      <div class="card-body border-top border-end">
                        <blockquote class="blockquote mb-0">
                          <p>
                            {{ suportes.sUsuarioAbertura }} - {{ suportes.sAssuntoChamado }} -
                            {{ suportes.nCodigoAcesso }}
                          </p>
                          <footer class="blockquote-footer">
                            Breve descrição do que está acontecendo no sistema
                          </footer>
                        </blockquote>
                      </div>
                    </div>
                  </div>

                  <!-- Coluna de prioridade -->
                  <div class="col-md-2 h-100 d-flex align-items-center">
                    <!-- Centralizar verticalmente -->
                    <div class="w-100 text-center">
                      <!-- Largura total e alinhamento central -->
                      <div class="row mb-2">
                        <div class="col-12">N° prioridade</div>
                      </div>
                      <div class="row">
                        <div class="col-12 display-4">15</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
