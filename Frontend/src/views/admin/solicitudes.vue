<script setup>
import { ref, onMounted, watch } from 'vue';
import { initFlowbite } from 'flowbite';
import { getperiodosIstla } from '../../services/periodosIstla';
import { solicitudes } from '../../services/solicitudBeca';
import dayjs from 'dayjs';

import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Select from 'primevue/select';

const globalFilter = ref('');
const pdfDialogVisible = ref(false);
const pdfUrl = ref('');
const solicitudesBecaFormatead = ref([]);
const periodo = ref('');
const periodos = ref([]);

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
  const solicitudesBecas = await solicitudes();
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

const aceptarSolicitud = async () => {
  console.log('Aceptar solicitud');
};

const rechazarSolicitud = async () => {
  console.log('Rechazar solicitud');
};

watch(globalFilter, (newValue) => {
  filters.value.global.value = newValue;
});

watch(periodo, (newValue) => {
  filters.value.ID_PERIODO.value = newValue.value;
});

onMounted(() => {
  fetchSolicitudesBeca();
  fetchPeriodosIstla();
  initFlowbite();
});

</script>


<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Solicitudes de Beca</h2>

    <div class="flex items-center gap-4 mb-4">
      <InputText v-model="globalFilter" placeholder="Buscar..." class="w-1/3" />

      <Select v-model="periodo" :options="periodos" optionLabel="label" placeholder="Selecciona un período"
        class="w-full md:w-56" />

      <Button icon="pi pi-times" label="Limpiar Filtros" @click="clearFilters" severity="secondary" />

      <Button icon="pi pi-refresh" label="Refrescar" @click="refreshData" severity="secondary" />

    </div>

    <DataTable :value="solicitudesBecaFormatead" :filters="filters" :paginator="true" :rows="5"
      :globalFilterFields="['NOMBRES_USUARIOS', 'CEDULA_ESTUDIANTE', 'TIPO_BECA', 'FECHA', 'ESTADO']"
      :rowsPerPageOptions="[5, 10, 20]" :emptyMessage="'No hay datos disponibles'">
      <Column field="NOMBRES_USUARIOS" header="Nombre" sortable />
      <Column field="CEDULA_ESTUDIANTE" header="Cédula" sortable />
      <Column field="TIPO_BECA" header="Tipo de Beca" sortable />
      <Column field="FECHA" header="Fecha de Solicitud" sortable />
      <Column header="ESTADO">
        <template #body="slotProps">
          <Tag icon="pi pi-spin pi-spinner" :value="slotProps.data.ESTADO" severity="warn" />
        </template>
      </Column>
      <Column header="Solicitud">
        <template #body="slotProps">
          <Button severity="contrast" rounded icon="pi pi-file-pdf"
            @click="openPdfDialog(slotProps.data.DOCUMENTO_SOLICITUD)" />
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button @click="aceptarSolicitud" unstyled class="zoom-button" style="margin-bottom: 0.5rem;">
            <Tag icon="pi pi-check" severity="success" value="Aceptar"></Tag>
          </Button>
          <Button @click="rechazarSolicitud" unstyled class="zoom-button">
            <Tag icon="pi pi-times" severity="danger" value="Rechazar"></Tag>
          </Button>
        </template>

      </Column>
    </DataTable>
  </div>

  <Dialog header="Solicitud" v-model:visible="pdfDialogVisible" style="width: 80vw">
    <embed v-if="pdfUrl" :src="pdfUrl" type="application/pdf" width="100%" height="500px" />
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
