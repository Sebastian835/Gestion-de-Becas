<script setup>
import { ref, computed, onMounted } from 'vue';

import { getUser } from '../services/user';
import { getBecaVigente } from '../services/becasOtorgadas';
import { useSidebarStore } from '../stores/sidebarStore';

const sidebarStore = useSidebarStore();

const currentUser = ref(null);
const becaVigente = ref(true);

const fetchCurrentUser = async () => {
  try {
    const user = await getUser();
    currentUser.value = user;
    await fetchBeca(currentUser.value.DOCUMENTO_USUARIOS);
  } catch (error) {
    throw error;
  }
};

const fetchBeca = async (cedula) => {
  try {
    const beca = await getBecaVigente(cedula);
    if (!beca) {
      becaVigente.value = false;
    }
  } catch (error) {
    throw error;
  }
};

onMounted(() => {
  fetchCurrentUser();
});
const isSuperAdmin = computed(() => currentUser.value?.role === 'SuperAdmin');
const isCoordinador = computed(() => currentUser.value?.role === 'Coordinador');
const isReporte = computed(() => currentUser.value?.role === 'Reporteria');
const isEstudiante = computed(() => currentUser.value?.role === 'estudiante');

</script>


<template>
  <aside :class="[
    'bg-gradient-to-br from-gray-800 to-gray-900 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 flex flex-col',
    sidebarStore.isOpen ? 'translate-x-0' : '-translate-x-80'
  ]">
    <!-- Encabezado fijo -->
    <div class="relative border-b border-white/20 flex-shrink-0">
      <a class="flex items-center gap-4 py-6 px-8" href="/gestionBecas/main/home">
        <h6 class="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
          Gestión de Becas ISTLA</h6>
      </a>
    </div>
    <div class="flex-1 overflow-y-auto sidebar-scroll">
      <div class="m-4">
        <ul class="mb-4 flex flex-col gap-1">

          <!-- Admin -->
          <li v-if="isCoordinador || isSuperAdmin || isReporte"
            class="hover:bg-gradient-to-tr hover:from-blue-600/40 hover:to-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 rounded-lg transition-all duration-300">
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
          <li v-if="isCoordinador || isSuperAdmin"
            class="hover:bg-gradient-to-tr hover:from-blue-600/40 hover:to-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 rounded-lg transition-all duration-300">
            <RouterLink to="/main/periodos"
              activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
              <button
                class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
                type="button">
                <i class="pi pi-calendar-clock" style="font-size: 1rem"></i>
                <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                  Periodos</p>
              </button>
            </RouterLink>
          </li>
          <li v-if="isCoordinador || isSuperAdmin"
            class="hover:bg-gradient-to-tr hover:from-blue-600/40 hover:to-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 rounded-lg transition-all duration-300">
            <RouterLink to="/main/solicitudesBeca"
              activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
              <button
                class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
                type="button">
                <i class="pi pi-file-plus" style="font-size: 1rem"></i>
                <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                  Solicitudes</p>
              </button>
            </RouterLink>
          </li>
          <li v-if="isCoordinador || isSuperAdmin"
            class="hover:bg-gradient-to-tr hover:from-blue-600/40 hover:to-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 rounded-lg transition-all duration-300">
            <RouterLink to="/main/documentosBeca"
              activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
              <button
                class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
                type="button">
                <i class="pi pi-file-check" style="font-size: 1rem"></i>
                <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                  Documentacion</p>
              </button>
            </RouterLink>
          </li>
          <li v-if="isCoordinador || isSuperAdmin"
            class="hover:bg-gradient-to-tr hover:from-blue-600/40 hover:to-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 rounded-lg transition-all duration-300">
            <RouterLink to="/main/becas"
              activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
              <button
                class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
                type="button">
                <i class="pi pi-graduation-cap" style="font-size: 1rem"></i>
                <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                  Becas</p>
              </button>
            </RouterLink>
          </li>
          <li v-if="isCoordinador || isSuperAdmin || isReporte"
            class="hover:bg-gradient-to-tr hover:from-blue-600/40 hover:to-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 rounded-lg transition-all duration-300">
            <RouterLink to="/main/reportes"
              activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
              <button
                class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
                type="button">
                <i class="pi pi-file-pdf" style="font-size: 1rem"></i>
                <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                  Reportes</p>
              </button>
            </RouterLink>
          </li>

          <!-- SuperAdmin -->
          <li v-if="isSuperAdmin"
            class="hover:bg-gradient-to-tr hover:from-blue-600/40 hover:to-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 rounded-lg transition-all duration-300">
            <RouterLink to="/main/gestionUsuarios"
              activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
              <button
                class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
                type="button">
                <i class="pi pi-users" style="font-size: 1rem"></i>
                <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                  Gestion Usuarios</p>
              </button>
            </RouterLink>
          </li>

          <!-- Estudiante -->
          <li v-if="isEstudiante"
            class="hover:bg-gradient-to-tr hover:from-blue-600/40 hover:to-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 rounded-lg transition-all duration-300">
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
          <li v-if="isEstudiante" class="hover:bg-gradient-to-tr hover:from-blue-600/40 hover:to-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 rounded-lg transition-all duration-300">
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
          <li v-if="isEstudiante" class="hover:bg-gradient-to-tr hover:from-blue-600/40 hover:to-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 rounded-lg transition-all duration-300">
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
          <li v-if="isEstudiante && becaVigente" class="hover:bg-gradient-to-tr hover:from-blue-600/40 hover:to-blue-400/40 hover:shadow-md hover:shadow-blue-500/10 rounded-lg transition-all duration-300">
            <RouterLink to="/main/beca"
              activeClass="bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize rounded-lg">
              <button
                class="middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white w-full flex items-center gap-4 px-4 capitalize"
                type="button">
                <i class="pi pi-graduation-cap" style="font-size: 1rem"></i>
                <p class="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                  Beca</p>
              </button>
            </RouterLink>
          </li>

          <!-- LOGO -->
          <div v-if="isEstudiante" class="mt-auto mb-4 text-center">
            <div class="w-32 h-32 mx-auto mb-2 flex items-center justify-center">
              <img class="w-32 h-32 object-contain" src="../assets/logo_istla.png" alt="ISTLA Logo">
            </div>
            <h1 class="text-lg font-bold text-white mt-2">Instituto Superior Tecnológico</h1>
            <h1 class="text-lg font-bold text-white mt-1">"Los Andes" ISTLA</h1>
          </div>

        </ul>
      </div>
    </div>
  </aside>

</template>

<style scoped>
.overflow-y-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-y-auto::-webkit-scrollbar {
  display: none;
}
</style>