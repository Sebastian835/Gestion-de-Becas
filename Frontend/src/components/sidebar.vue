<script setup>
import { ref, computed, onMounted } from 'vue';
import { getUser } from '../services/user';

const currentUser = ref(null);

const fetchCurrentUser = async () => {
  try {
    const user = await getUser();
    currentUser.value = user;
  } catch (error) {
    console.error('Error fetching current user:', error);
  }
};

onMounted(() => {
  fetchCurrentUser();
});

const isAdmin = computed(() => currentUser.value?.role === 'admin');
const isEstudiante = computed(() => currentUser.value?.role === 'estudiante');
</script>


<template>
  <aside
    class="bg-gradient-to-br from-gray-800 to-gray-900 -translate-x-80 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0">
    <div class="relative border-b border-white/20">
      <a class="flex items-center gap-4 py-6 px-8" href="#/">
        <h6 class="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
          Gestión de Becas ISTLA</h6>
      </a>
      <button
        class="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
        type="button">
        <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
            stroke="currentColor" aria-hidden="true" class="h-5 w-5 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </span>
      </button>
    </div>
    <div class="m-4">
      <ul class="mb-4 flex flex-col gap-1">
        <!-- Admin -->
        <li v-if="isAdmin">
          <RouterLink to="/main/home"
            activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
            <button
              class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
              type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                class="w-5 h-5 text-inherit">
                <path
                  d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z">
                </path>
                <path
                  d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z">
                </path>
              </svg>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                Home</p>
            </button>
          </RouterLink>
        </li>

        <li v-if="isAdmin">
          <RouterLink to="/main/solicitudesBeca"
            activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
            <button
              class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
              type="button">
              <i class="pi pi-file-pdf" style="font-size: 1rem"></i>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                Solicitudes</p>
            </button>
          </RouterLink>
        </li>

        <li v-if="isAdmin">
          <RouterLink to="/main/documentosBeca"
            activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
            <button
              class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
              type="button">
              <i class="pi pi-file-pdf" style="font-size: 1rem"></i>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                Documentacion</p>
            </button>
          </RouterLink>
        </li>

        <div v-if="isAdmin" class="mt-auto mb-4 text-center">
          <div class="w-32 h-32 mx-auto mb-2 flex items-center justify-center">
            <img class="w-32 h-32 object-contain" src="../assets/logo_istla.png" alt="ISTLA Logo">
          </div>
          <h1 class="text-lg font-bold text-white mt-2">Instituto Superior Tecnológico</h1>
          <h1 class="text-lg font-bold text-white mt-1">"Los Andes" ISTLA</h1>
          <p class="mt-2 text-white text-xs">Gestión de Becas</p>
        </div>



        <!-- Estudiante -->
        <li v-if="isEstudiante">
          <RouterLink to="/main/requisitos"
            activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
            <button
              class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
              type="button">
              <i class="pi pi-list-check" style="font-size: 1rem"></i>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                Requisitos</p>
            </button>
          </RouterLink>
        </li>
        <li v-if="isEstudiante">
          <RouterLink to="/main/solicitud"
            activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
            <button
              class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
              type="button">
              <i class="pi pi-file-arrow-up" style="font-size: 1rem"></i>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                Solicitar Beca</p>
            </button>
          </RouterLink>
        </li>
        <li v-if="isEstudiante">
          <RouterLink to="/main/documentos"
            activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
            <button
              class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
              type="button">
              <i class="pi pi-file-pdf" style="font-size: 1rem"></i>
              <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                Enviar Documentos</p>
            </button>
          </RouterLink>
        </li>

        <div v-if="isEstudiante">
          <div class="text-center mt-auto mb-4" style="padding-top: 11rem;">
            <div class="w-32 h-32 mx-auto mb-2 flex items-center justify-center">
              <img class="w-32 h-32 object-contain" src="../assets/logo_istla.png" alt="ISTLA Logo">
            </div>
            <h1 class="text-lg font-bold text-white mt-2">Instituto Superior Tecnológico</h1>
            <h1 class="text-lg font-bold text-white mt-1">"Los Andes" ISTLA</h1>
            <p class="mt-2 text-white text-xs">Gestión de Becas</p>
          </div>
        </div>

        <!-- Vicerrect@r -->
      </ul>
    </div>





  </aside>
</template>

<style scoped></style>