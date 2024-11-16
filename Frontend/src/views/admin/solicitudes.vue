<script setup>
import { ref, onMounted, watch } from 'vue';
import { initFlowbite } from 'flowbite';
import { solicitudes } from '../../services/solicitudBeca';

import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const solicitudBeca = ref([]);


const fetchSolicitudesBeca = async () => {
    solicitudBeca.value = await solicitudes();
    console.log(solicitudBeca.value);
};

const data = ref([
    { Nombre: 'Juan Pérez', Cedula: '1234567890', Beca: 'Académica', Fecha: '2024-11-01', Estado: 'Pendiente', Solicitud: 'Solicitud 1' },
    { Nombre: 'María López', Cedula: '0987654321', Beca: 'Deportiva', Fecha: '2024-11-10', Estado: 'Aceptada', Solicitud: 'Solicitud 2' }
]);

const globalFilter = ref('');
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    Nombre: { value: null, matchMode: 'contains' },
    Cedula: { value: null, matchMode: 'contains' },
    Beca: { value: null, matchMode: 'contains' },
    Fecha: { value: null, matchMode: 'contains' },
    Estado: { value: null, matchMode: 'contains' },
});

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
        <DataTable :value="data" :filters="filters" :paginator="true" :rows="5"
            :globalFilterFields="['Nombre', 'Cedula', 'Beca', 'Fecha', 'Estado', 'Solicitud']"
            :rowsPerPageOptions="[5, 10, 20]">
            <Column field="Nombre" header="Nombre" sortable :filter="true" />
            <Column field="Cedula" header="Cédula" sortable :filter="true" />
            <Column field="Beca" header="Tipo de Beca" sortable :filter="true" />
            <Column field="Fecha" header="Fecha de Solicitud" sortable :filter="true"/>
            <Column field="Estado" header="Estado" sortable :filter="true" />
            <Column field="Solicitud" header="Solicitud" :filter="false" />
        </DataTable>
    </div>
</template>

<style scoped></style>