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
        FECHA: dayjs(solicitud.FECHA).format('YYYY-MM-DD')
    }));
};

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    // nombre_estudiante: { value: null, matchMode: 'contains' },
    CEDULA_ESTUDIANTE: { value: null, matchMode: 'contains' },
    TIPO_BECA: { value: null, matchMode: 'contains' },
    FECHA: { value: null, matchMode: 'contains' },
    ESTADO: { value: null, matchMode: 'contains' },
});

const openPdfDialog = (buffer) => {
    const blob = new Blob([new Uint8Array(buffer.data)], { type: 'application/pdf' });
    pdfUrl.value = URL.createObjectURL(blob);  
    pdfDialogVisible.value = true;  
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
            :globalFilterFields="['nombre_estudiante', 'CEDULA_ESTUDIANTE', 'TIPO_BECA', 'FECHA', 'ESTADO', 'Solicitud']"
            :rowsPerPageOptions="[5, 10, 20]">
            <!-- <Column field="nombre_estudiante" header="Nombre" sortable :filter="true" /> -->
            <Column field="CEDULA_ESTUDIANTE" header="Cédula" sortable :filter="true" />
            <Column field="TIPO_BECA" header="Tipo de Beca" sortable :filter="true" />
            <Column field="FECHA" header="Fecha de Solicitud" sortable :filter="true" />
            <Column header="ESTADO" sortable :filter="true">
                <template #body="slotProps">
                    <Tag icon="pi pi-spin pi-spinner" :value="slotProps.data.ESTADO" severity="warn" />
                </template>
            </Column>
            <Column header="Solicitud" :filter="false">
                <template #body="slotProps">
                    <Button severity="contrast" rounded icon="pi pi-file-pdf"
                        @click="openPdfDialog(slotProps.data.DOCUMENTO_SOLICITUD)" />
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