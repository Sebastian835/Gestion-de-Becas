<script setup>
import { ref, onMounted, watch } from 'vue';
import { initFlowbite } from 'flowbite';
import { solicitudes } from '../../services/solicitudBeca';
import dayjs from 'dayjs';

import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const solicitudesBecaFormatead = ref([]);
const globalFilter = ref('');
const pdfDialogVisible = ref(false);
const pdfUrl = ref('');

const fetchSolicitudesBeca = async () => {
    const solicitudesBecas = await solicitudes();
    solicitudesBecaFormatead.value = solicitudesBecas.map(solicitud => ({
        ...solicitud,
        fecha: dayjs(solicitud.fecha).format('YYYY-MM-DD')
    }));
};

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    nombre_estudiante: { value: null, matchMode: 'contains' },
    cedula_estudiante: { value: null, matchMode: 'contains' },
    tipo_beca: { value: null, matchMode: 'contains' },
    fecha: { value: null, matchMode: 'contains' },
    estado: { value: null, matchMode: 'contains' },
});

const openPdfDialog = (buffer) => {
    const blob = new Blob([new Uint8Array(buffer.data)], { type: 'application/pdf' });
    pdfUrl.value = URL.createObjectURL(blob);  // Crear la URL del Blob
    pdfDialogVisible.value = true;  // Abrir el Dialog
};

watch(globalFilter, (newValue) => {
    filters.value.global.value = newValue;
});

onMounted(() => {
    fetchSolicitudesBeca();
    initFlowbite();
});
</script>

<template>
    <div>
        <h2 class="text-xl font-semibold mb-4">Solicitudes de Beca</h2>
        <InputText v-model="globalFilter" placeholder="Buscar..." class="mb-4 w-full" />
        <DataTable :value="solicitudesBecaFormatead" :filters="filters" :paginator="true" :rows="5"
            :globalFilterFields="['nombre_estudiante', 'cedula_estudiante', 'tipo_beca', 'fecha', 'estado', 'Solicitud']"
            :rowsPerPageOptions="[5, 10, 20]">
            <Column field="nombre_estudiante" header="Nombre" sortable :filter="true" />
            <Column field="cedula_estudiante" header="Cédula" sortable :filter="true" />
            <Column field="tipo_beca" header="Tipo de Beca" sortable :filter="true" />
            <Column field="fecha" header="Fecha de Solicitud" sortable :filter="true" />
            <Column header="Estado" sortable :filter="true">
                <template #body="slotProps">
                    <Tag icon="pi pi-spin pi-spinner" :value="slotProps.data.estado" severity="warn" />
                </template>
            </Column>
            <Column header="Solicitud" :filter="false">
                <template #body="slotProps">
                    <Button severity="contrast" rounded icon="pi pi-file-pdf"
                        @click="openPdfDialog(slotProps.data.documento_solicitud)" />
                </template>
            </Column>
            <Column header="Acciones" />
        </DataTable>
    </div>
    <Dialog header="Solicitud" v-model:visible="pdfDialogVisible" style="width: 80vw">
        <embed v-if="pdfUrl" :src="pdfUrl" type="application/pdf" width="100%" height="500px" />
    </Dialog>
</template>

<style scoped></style>