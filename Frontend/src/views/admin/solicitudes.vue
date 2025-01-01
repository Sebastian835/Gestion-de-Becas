<script setup>
import { ref, onMounted, watch } from 'vue';
import { initFlowbite } from 'flowbite';
import { getperiodosIstla } from '../../services/api_Istla';
import {
  getSolicitudes,
  postSolicitud,
  putAprobarSolicitud,
  deleteRechazarSolicitud
} from '../../services/solicitudBeca';
import { getUsuariosIstla } from '../../services/api_Istla';
import { getTiposBecas } from '../../services/tiposBecas';
import { getPlazoBecasActivas } from '../../services/vigenciaBecas';

import dayjs from 'dayjs';
import Swal from 'sweetalert2';

import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Select from 'primevue/select';
import AutoComplete from 'primevue/autocomplete';
import Skeleton from 'primevue/skeleton';

const loading = ref(true)
const globalFilter = ref('');
const pdfDialogVisible = ref(false);
const pdfUrl = ref('');
const solicitudesBecaFormatead = ref([]);
const periodo = ref('');
const periodos = ref([]);
const errorMessages = ref([]);

const tiposBecas = ref([]);
const usuariosIstla = ref([]);
const filteredUsuarios = ref([]);
const selectedAlumno = ref(null);
const visibleCrear = ref(false);
const fileInput = ref(null);
const selectedBeca = ref('');
const selectedPeriodoCrear = ref('');
const vigenciaBecas = ref();

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  NOMBRES_USUARIOS: { value: null, matchMode: 'contains' },
  CEDULA_ESTUDIANTE: { value: null, matchMode: 'contains' },
  TIPO_BECA: { value: null, matchMode: 'contains' },
  FECHA: { value: null, matchMode: 'contains' },
  ESTADO: { value: null, matchMode: 'contains' },
  ID_PERIODO: { value: null, matchMode: 'equals' },
});

const fetchSolicitudesBeca = async () => {
  const solicitudesBecas = await getSolicitudes();
  loading.value = false;
  solicitudesBecaFormatead.value = solicitudesBecas.map((solicitud) => ({
    ...solicitud,
    FECHA: dayjs(solicitud.FECHA).format('YYYY-MM-DD'),
  }));

};

const fetchPeriodosIstla = async () => {
  const response = await getperiodosIstla();
  periodos.value = response.map((periodo) => ({
    label: periodo.NOMBRE_PERIODO,
    value: periodo.ID_PERIODO,
  }));
};

const refreshData = async () => {
  await fetchSolicitudesBeca();
};

const clearFilters = () => {
  globalFilter.value = '';
  periodo.value = '';
};

const openPdfDialog = (buffer) => {
  const blob = new Blob([new Uint8Array(buffer.data)], { type: 'application/pdf' });
  pdfUrl.value = URL.createObjectURL(blob);
  pdfDialogVisible.value = true;
};

const openCrearDialog = async () => {
  visibleCrear.value = true;
  usuariosIstla.value = await getUsuariosIstla();
  filteredUsuarios.value = usuariosIstla.value;
  tiposBecas.value = await getTiposBecas();
};

const validateForm = () => {
  let isValid = true;

  errorMessages.value = [];

  if (selectedAlumno.value === null) {
    errorMessages.value.push('Por favor selecciona un alumno.');
    isValid = false;
  }

  if (selectedBeca.value === '') {
    errorMessages.value.push('Por favor selecciona un tipo de beca.');
    isValid = false;
  }

  if (fileInput.value && fileInput.value.files.length === 0) {
    errorMessages.value.push('Por favor sube el formulario escaneado.');
    isValid = false;
  }

  return isValid;
};

const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const searchAlumnos = (event) => {
  filteredUsuarios.value = usuariosIstla.value.filter((usuario) =>
    usuario.label.toLowerCase().includes(event.query.toLowerCase())
  );
};

const fecthPeriodoBecas = async () => {
  vigenciaBecas.value = await getPlazoBecasActivas();
};

const crearSolicitud = async () => {
  if (!validateForm()) return;

  const fechaActual = new Date();
  let fileBase64 = '';

  if (fileInput.value && fileInput.value.files.length > 0) {
    const file = fileInput.value.files[0];

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Error',
        text: 'El archivo es demasiado grande. El tamaño máximo permitido es de 5 MB.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    fileBase64 = await readFileAsBase64(file);
  }

  

  const jsonData = {
    fecha: fechaActual,
    becaSeleccionada: selectedBeca.value,
    cedula_estudiante: selectedAlumno.value.value,
    documento: fileBase64,
    periodoBeca: vigenciaBecas.value[0].ID_VIGENCIA

  };

  try {
    await postSolicitud(jsonData);
    visibleCrear.value = false;
    Swal.fire({
      title: '¡Éxito!',
      text: 'Se a creado la solicitud correctamente. El alumno sera notificado por  correo electrónico.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      fetchSolicitudesBeca();
      selectedBeca.value = '';
      selectedAlumno.value = null;
      selectedPeriodoCrear.value = '';
    });
  } catch (error) {
    visibleCrear.value = false;
    Swal.fire({
      title: 'Error',
      text: 'Hubo un problema al enviar la solicitud.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

};

const aceptarSolicitud = async (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Se aprobará la solicitud del estudiante.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await putAprobarSolicitud(id);
        Swal.fire({
          title: 'Solicitud aprobada',
          text: 'Se emitirá el correo al estudiante.',
          icon: 'success',
        }).then(() => {
          refreshData();
        });
      } catch (error) {
        console.error('Error aprobando la solicitud:', error);
      }
    }
  });

};

const rechazoSolicitud = async (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Se rechazará la solicitud del estudiante.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteRechazarSolicitud(id);
        Swal.fire({
          title: 'Solicitud rechazada',
          text: 'Se emitirá el correo al estudiante.',
          icon: 'success',
        }).then(() => {
          refreshData();
        });
      } catch (error) {
        console.error('Error rechazando la solicitud:', error);
      }
    }
  });
};

watch(globalFilter, (newValue) => {
  filters.value.global.value = newValue;
});

watch(periodo, (newValue) => {
  filters.value.ID_PERIODO.value = newValue.value;
});

onMounted(() => {
  fecthPeriodoBecas();
  fetchSolicitudesBeca();
  fetchPeriodosIstla();
  initFlowbite();
});

</script>


<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Solicitudes de Beca</h2>
    <div class="flex items-center gap-4 mb-4">
      <InputText v-model="globalFilter" placeholder="Buscar..." class="w-1/4" />
      <Select v-model="periodo" :options="periodos" optionLabel="label" placeholder="Selecciona un período"
        class="w-full md:w-56" />

      <Button icon="pi pi-eraser" label="Limpiar Filtros" @click="clearFilters" severity="secondary" />
      <Button icon="pi pi-file-plus" label="Crear Solicitud" @click="openCrearDialog" severity="secondary" />
      <Button icon="pi pi-refresh" label="Refrescar" @click="refreshData" severity="secondary" />

    </div>

    <DataTable :value="solicitudesBecaFormatead" :loading="loading" :filters="filters" :paginator="true" :rows="5"
      :globalFilterFields="['NOMBRES_USUARIOS', 'CEDULA_ESTUDIANTE', 'TIPO_BECA', 'FECHA', 'ESTADO']"
      :rowsPerPageOptions="[5, 10, 20]" :emptyMessage="'No hay datos disponibles'">

      <Column field="NOMBRES_USUARIOS" header="Nombre" sortable>
        <template #body="slotProps">
          <Skeleton v-if="loading">
            <div class="h-8 w-full"></div>
          </Skeleton>
          <span v-else>{{ slotProps.data.NOMBRES_USUARIOS }}</span>
        </template>
      </Column>

      <Column field="CEDULA_ESTUDIANTE" header="Cédula" sortable>
        <template #body="slotProps">
          <Skeleton v-if="loading">
            <div class="h-8 w-full"></div>
          </Skeleton>
          <span v-else>{{ slotProps.data.CEDULA_ESTUDIANTE }}</span>
        </template>
      </Column>

      <Column field="TIPO_BECA" header="Tipo de Beca" sortable>
        <template #body="slotProps">
          <Skeleton v-if="loading">
            <div class="h-8 w-full"></div>
          </Skeleton>
          <span v-else>{{ slotProps.data.TIPO_BECA }}</span>
        </template>
      </Column>

      <Column field="FECHA" header="Fecha de Solicitud" sortable>
        <template #body="slotProps">
          <Skeleton v-if="loading">
            <div class="h-8 w-full"></div>
          </Skeleton>
          <span v-else>{{ slotProps.data.FECHA }}</span>
        </template>
      </Column>

      <Column header="ESTADO">
        <template #body="slotProps">
          <Skeleton v-if="loading">
            <div class="h-8 w-full"></div>
          </Skeleton>
          <Tag v-else-if="slotProps.data.ESTADO === 'Pendiente'" icon="pi pi-spin pi-spinner"
            :value="slotProps.data.ESTADO" severity="warn" />
          <Tag v-else-if="slotProps.data.ESTADO === 'Aprobada'" icon="pi pi-verified" :value="slotProps.data.ESTADO"
            severity="success" />
        </template>
      </Column>

      <Column header="Solicitud" sortable>
        <template #body="slotProps">
          <Skeleton v-if="loading">
            <div class="h-8 w-full"></div>
          </Skeleton>
          <span v-else><Button severity="contrast" rounded icon="pi pi-file-pdf"
              @click="openPdfDialog(slotProps.data.DOCUMENTO_SOLICITUD)" /></span>
        </template>
      </Column>

      <!-- Columnas de Acciones -->
      <Column header="Acciones">
        <template #body="slotProps">
          <Skeleton v-if="loading" class="mb-2">
            <div class="h-8 w-full"></div>
          </Skeleton>
          <div v-else>
            <Button @click="aceptarSolicitud(slotProps.data.ID_SOLICITUD)" unstyled class="zoom-button"
              :class="{ 'opacity-50 cursor-not-allowed': slotProps.data.ESTADO === 'Aprobada' }"
              :disabled="slotProps.data.ESTADO === 'Aprobada'" style="margin-bottom: 0.5rem;">
              <Tag icon="pi pi-check" severity="success" value="Aprobar"></Tag>
            </Button>
            <Button @click="rechazoSolicitud(slotProps.data.ID_SOLICITUD)" unstyled class="zoom-button"
              :class="{ 'opacity-50 cursor-not-allowed': slotProps.data.ESTADO === 'Aprobada' }"
              :disabled="slotProps.data.ESTADO === 'Aprobada'" style="margin-bottom: 0.5rem;">
              <Tag icon="pi pi-times" severity="danger" value="Rechazar"></Tag>
            </Button>
          </div>
        </template>
      </Column>

    </DataTable>
  </div>

  <Dialog header="Solicitud" v-model:visible="pdfDialogVisible" style="width: 80vw" pt:mask:class="backdrop-blur-sm">
    <embed v-if="pdfUrl" :src="pdfUrl" type="application/pdf" width="100%" height="500px" />
  </Dialog>


  <Dialog v-model:visible="visibleCrear" header="Solicitud de Beca" pt:mask:class="backdrop-blur-sm"
    style="background-color: #f8f8f8">
    <div style="background-color: #f8f8f8; padding: 1rem; border-radius: 0.5rem;">

      <!-- Alumno -->
      <div style="margin-bottom: 1.5rem;">
        <label for="autocomplete" class="block mb-3 text-base font-semibold text-gray-900">Alumno</label>
        <AutoComplete inputId="alumnos" placeholder="Buscar Alumno" v-model="selectedAlumno" optionLabel="label"
          :suggestions="filteredUsuarios" @complete="searchAlumnos"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2" />
        <p v-if="errorMessages.includes('Por favor selecciona un alumno.')" class="text-red-500 text-sm mt-1">Por favor
          selecciona un alumno.</p>
      </div>

      <!-- Tipo de Beca -->
      <div style="margin-bottom: 1.5rem;">
        <label for="tipoBeca" class="block mb-3 text-base font-semibold text-gray-900">Tipo de Beca</label>
        <select id="tipoBeca" v-model="selectedBeca"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2">
          <option disabled value="">Selecciona una opción</option>
          <option v-for="beca in tiposBecas" :key="beca.id" :value="beca.ID_TIPO_BECA">{{ beca.TIPO_BECA }}</option>
        </select>
        <p v-if="errorMessages.includes('Por favor selecciona un tipo de beca.')" class="text-red-500 text-sm mt-1">Por
          favor selecciona un tipo de beca.</p>
      </div>

      <!-- Subir Formulario -->
      <div style="margin-bottom: 2rem;">
        <label for="file-upload" class="block mb-3 text-base font-semibold text-gray-900">Subir Formulario
          Escaneado</label>
        <input id="file-upload" type="file" accept="application/pdf" ref="fileInput"
          class="block w-full text-base text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none p-2" />
        <p v-if="errorMessages.includes('Por favor sube el formulario escaneado.')" class="text-red-500 text-sm mt-1">
          Por
          favor sube el formulario escaneado.</p>
      </div>

      <!-- Botón -->
      <div class="flex justify-center">
        <Button @click="crearSolicitud" type="button"
          class="w-72 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600">
          Crear Solicitud
        </Button>
      </div>

    </div>
  </Dialog>


</template>

<style scoped>
.zoom-button {
  display: inline-block;
  transition: transform 0.2s ease-in-out;
}

.zoom-button:hover {
  transform: scale(1.1);
}
</style>
