<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import { jwtDecode } from "jwt-decode";
const router = useRouter()

interface DecodedToken {
  jwt_nCodigoEmpresa: number
  jwt_nCodigoUsuario: number
}

onMounted(() => {
  try {
    const token = localStorage.getItem('jwtToken')

    if (!token) {
      throw new Error('Token não encontrado no localStorage')
    }

    decodedToken.value = jwtDecode<DecodedToken>(token)
  } catch (error) {
    console.error('Erro ao decodificar token:', error)
    router.push({ name: 'login' })
  }
})

const decodedToken = ref<DecodedToken | null>(null)

async function NovaSessao() {
  if (!decodedToken.value) {
    console.error('Token não foi decodificado corretamente')
    return
  }

  router.push({
    name: 'nova_sessao',
    params: {
      empresa: decodedToken.value.jwt_nCodigoEmpresa,
      remetente: decodedToken.value.jwt_nCodigoUsuario,
      acesso: 'suporte_tipo1',
    }
  })
}

async function HubSuporte() {
  router.push({
    name: 'suporte_hub',
  })
}

</script>

<!-- <template>
  <div class="container border border-secondary">
    <div class="row px-3 py-1">
      <div class="col-md-2">a</div>
      <div class="col-md-4">a</div>
    </div>
  </div>
</template> -->
<template>
  <div class="min-vh-100 bg-dark text-white p-4">
    <div class="container">
      <div class="row justify-content-center g-4">
        <!-- Primeiro Card -->
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card bg-dark border-secondary h-100"> <!-- Added h-100 -->
            <div class="card-body p-4 d-flex flex-column">
              <h5 class="card-title mb-4 text-primary">Solicitar nova sessão</h5>
              <div class="mt-auto"> <!-- Push button to bottom -->
                <button class="btn btn-primary w-100 py-2" type="submit" data-bs-toggle="modal"
                  data-bs-target="#meuModal">
                  Solicitar Suporte
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL -->

        <div class="modal fade" id="meuModal" tabindex="-1" aria-labelledby="tituloModal" aria-hidden="true">
          <div class="modal-dialog modal-xl ">
            <div class="modal-content">
              <div class="modal-header bg-info">
                <h5 class="modal-title" id="tituloModal"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div class="modal-body text-warning">
                <div>
                  <div class="mb-3">
                    <label class="form-label text-primary fw-bold">Insira o título do chamado</label>
                    <input type="text" class="form-control"  placeholder="Necessito de ajuda com...">
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Fechar</button>
                <button  type="submit" class="btn btn-success"  data-bs-dismiss="modal" @click="NovaSessao()">Iniciar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Segundo Card -->
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card bg-dark border-secondary h-100"> <!-- Added h-100 -->
            <div class="card-body p-4 d-flex flex-column">
              <h5 class="card-title mb-4 text-primary">Código existente</h5>
              <form class="d-flex flex-column gap-3 flex-grow-1">
                <div class="form-group">
                  <input type="text" class="form-control bg-dark text-white border-secondary"
                    placeholder="Insira um código de sessão" />
                </div>
                <div class="mt-auto"> <!-- Push button to bottom -->
                  <button class="btn btn-outline-light w-100 py-2" type="submit">
                    Acessar Sessão
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- card do hub -->
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card bg-dark border-secondary h-100"> <!-- Added h-100 -->
            <div class="card-body p-4 d-flex flex-column">
              <form class="d-flex flex-column gap-3 flex-grow-1">

                <div class="mt-auto"> <!-- Push button to bottom -->
                  <button class="btn btn-primary w-100 py-2" type="submit" @click="HubSuporte()">
                    suportes em andamento
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
