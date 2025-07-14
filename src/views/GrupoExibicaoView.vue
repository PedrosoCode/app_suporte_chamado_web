<script setup lang="ts">



</script>
<template>
    <main class="min-h-screen bg-slate-100 py-8">


        <div class="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
            <!-- Cabeçalho -->
            <h1 class="text-2xl font-bold text-gray-800 text-center">Grupos de exibição</h1>

            <!-- Grid de Inputs -->
            <div class="grid grid-cols-1 gap-6 mt-6">

                <div>
                    <label class="block text-sm font-medium text-gray-700">Descrição</label>
                    <input type="text"
                        class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50" />
                </div>

            </div>

            <!-- Botões de Ação -->
            <div class="flex justify-end space-x-4 mt-8">
                <button class="bg-indigo-600 text-white rounded-lg px-6 py-3 hover:bg-indigo-700 transition">
                    Filtrar
                </button>
            </div>
        </div>

        <div class="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg my-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 text-center">Editar</h1>
                <div class="grid grid-cols-1 gap-6 mt-6">

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Descrição</label>
                        <input type="text"
                            class="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50" />
                    </div>

                </div>

                <!-- Botões de Ação -->
                <div class="flex justify-end space-x-4 mt-8">
                    <button class="bg-red-600 text-white rounded-lg px-6 py-3 hover:bg-red-700 transition">
                        Cancelar
                    </button>
                    <button class="bg-indigo-600 text-white rounded-lg px-6 py-3 hover:bg-indigo-700 transition">
                        Inserir
                    </button>
                </div>

            </div>
            <div class="overflow-x-auto">
                <table class="table-fixed w-full">
                    <thead>
                        <tr>
                            <th class="p-2 text-left">Descrição</th>
                            <th class="p-2 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="p-2 truncate">{{ }}</td>
                            <td class="p-2">
                                <div class="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                                    <!-- <button @click="fnEditarFabricante(fabricante.rIcodigo)" -->
                                    <button
                                        class="bg-amber-300 text-white rounded-lg px-4 py-2 hover:bg-amber-400 transition w-full sm:w-auto">
                                        Editar
                                    </button>
                                    <button
                                        class="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition w-full sm:w-auto">
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg my-4">

            <h1 class="text-2xl font-bold text-gray-800 text-center p-2">Alterar permissões do grupo: TEMPLATE</h1>

            <div class="flex flex-col p-2 space-y-2">

                <div
                    class="flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700 hover:outline-2 hover:outline-amber-300">
                    <input id="bordered-checkbox-1" type="checkbox" value="" name="bordered-checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="bordered-checkbox-1"
                        class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default
                        radio</label>
                </div>
                <div
                    class="flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700 hover:outline-2 hover:outline-amber-300">
                    <input checked id="bordered-checkbox-2" type="checkbox" value="" name="bordered-checkbox"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="bordered-checkbox-2"
                        class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Checked
                        state</label>
                </div>

            </div>
        </div>

    </main>
</template>