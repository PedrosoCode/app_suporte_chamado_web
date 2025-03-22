<script setup lang="ts">
// import { useRouter } from 'vue-router'
// const router = useRouter()
</script>
<template>
  <div class="container my-4">
    <h4>O acesso do chamado é:</h4>
    <div class="row my-2 mt-5">
      <div class="col-md-12">
        <!-- Container do Chat -->
        <div class="border rounded overflow-auto" style="height: 60vh">
          <!-- Mensagem do Usuário (alinhada à direita) -->
          <div class="row">
            <div class="col-md-10 ms-auto m-2"> <!-- ms-auto empurra para direita -->
              <div class="card border-success mb-3">
                <div class="card-header">Você</div>
                <div class="card-body text-success">
                  <p class="card-text">
                    Olá estou precisando de suporte
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensagem do Suporte (alinhada à esquerda) -->
          <div class="row">
            <div class="col-md-10 m-2"> <!-- Sem ms-auto -->
              <div class="card border-primary mb-3">
                <div class="card-header">Suporte</div>
                <div class="card-body text-primary">
                  <p class="card-text">
                    Olá, como posso ajudar?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row my-5 align-items-center">
      <div class="col-md-10">
        <input type="text" class="form-control" placeholder="digite a mensagem...">
      </div>
      <div class="col-md-2 d-flex gap-2">
        <button class="btn btn-primary flex-fill">Enviar</button>
        <button class="btn btn-secondary flex-fill">Anexo</button>
      </div>
    </div>
  </div>
</template>
