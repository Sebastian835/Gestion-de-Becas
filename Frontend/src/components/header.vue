<script setup>
import { ref } from 'vue';
import { logout } from '../services/authService';
import { useRouter } from 'vue-router';
import 'primeicons/primeicons.css';

const router = useRouter();
const settingsVisible = ref(false);

const toggleSettings = () => {
  settingsVisible.value = !settingsVisible.value;
};

const handleLogout = () => {
  logout();
  router.push('/login');
};

</script>


<template>

  <div class="flex flex-col-reverse justify-between gap-2 md:flex-row md:items-center">
    <div class="capitalize">
      <ol class="flex flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
        <li
          class="flex items-center text-blue-gray-900 antialiased font-sans text-sm font-normal leading-normal ">
          <p
            class="block antialiased font-sans text-sm leading-normal text-gray-900 font-normal ">
            Gestión de Becas</p>
          <span
            class="text-gray-800 text-sm antialiased font-sans font-normal leading-normal mx-2 pointer-events-none select-none">/</span>
        </li>
        <li
          class="flex items-center text-gray-900 antialiased font-sans text-sm font-normal leading-normal ">
          <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">Instituto
            Superior Tecnológico Los Andes" ISTLA</p>
        </li>
      </ol>
    </div>

    <div class="flex items-center">
      <button
        class="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30"
        type="button" style="margin-right: 8px;">
        <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <div>
            <i class="pi pi-user text-gray-900" style="font-size: 1.5rem"></i>
          </div>
        </span>
      </button>

      <button
        class="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30"
        type="button" @click="toggleSettings">
        <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <div>
            <i :class="['pi', 'pi-cog', 'text-gray-900', { 'pi-spin': settingsVisible }]" style="font-size: 1.5rem"></i>
          </div>
        </span>
      </button>

      <div v-if="settingsVisible" class="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-2 z-50">
        <button class="flex items-center text-gray-900 text-sm" @click="handleLogout">
          <i class="pi pi-sign-out text-gray-900 text-lg mr-2"></i> Salir
        </button>
      </div>

    </div>
  </div>
</template>



<style scoped></style>