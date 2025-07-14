<script setup lang="ts">
// Placeholder array for uploaded files (visual only, no logic)
interface FileItem {
  name: string;
  size: string;
  type: string;
}

const uploadedFiles = [
  { name: 'document.pdf', size: '1.2 MB', type: 'pdf' },
  { name: 'photo.jpg', size: '2.4 MB', type: 'image' },
  { name: 'spreadsheet.xlsx', size: '800 KB', type: 'excel' },
  { name: 'presentation.pptx', size: '3.1 MB', type: 'powerpoint' }
] as FileItem[]
</script>

<template>
  <div class="bg-slate-100 min-h-screen p-4">
    <h4 class="text-gray-700 mb-4 text-xl font-semibold">Arquivos Enviados</h4>
    <div class="bg-white rounded-2xl shadow-md p-4 h-[60vh]">
      <ul class="space-y-4">
        <li
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition"
        >
          <div class="flex items-center space-x-4 w-full sm:w-auto">
            <div class="w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-full">
              <template v-if="file.type === 'image'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 001 1h3m-17 4h18" />
                </svg>
              </template>
              <template v-else-if="file.type === 'pdf'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 2H8a2 2 0 00-2 2v16a2 2 0 002 2h8l6-6V4a2 2 0 00-2-2z" />
                </svg>
              </template>
              <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4h10v12M7 20h10" />
                </svg>
              </template>
            </div>
            <div class="mt-2 sm:mt-0">
              <div class="font-semibold text-gray-800 truncate" style="max-width: 150px;">{{ file.name }}</div>
              <div class="text-sm text-gray-500">{{ file.size }}</div>
            </div>
          </div>
          <button
            class="mt-3 sm:mt-0 flex items-center justify-center space-x-1 px-2 sm:px-4 py-1 sm:py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="hidden sm:inline-block">Baixar</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
