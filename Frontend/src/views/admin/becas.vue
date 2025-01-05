<script setup>
import { ref, onMounted, computed } from 'vue';
import { getBecasOtorgadas, updateSincronizar } from '../../services/becasOtorgadas';
import { getTiposBecas } from '../../services/tiposBecas';
import { getperiodosIstla } from '../../services/api_Istla';

import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import Divider from 'primevue/divider';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const becas = ref([]);
const tiposBecas = ref([]);
const periodosIstla = ref([]);

const filteredBecas = ref([]);
const searchQuery = ref('');
const filterState = ref(null);
const filterTipoBeca = ref(null);
const filterBecaInicio = ref(null);

const selectedBeca = ref(null);
const showDialog = ref(false);

const currentPage = ref(0);
const rows = ref(8);
const first = ref(0);

const paginatedBecas = computed(() => {
    const start = first.value;
    const end = start + rows.value;
    return filteredBecas.value.slice(start, end);
});

const totalRecords = computed(() => {
    return filteredBecas.value.length;
});

const onPageChange = (event) => {
    first.value = event.first;
    rows.value = event.rows;
    currentPage.value = event.page;
};

const states = [
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 0 },
];

const show = async () => {
    const sincronizacion = await updateSincronizar();
    if (!sincronizacion) {
        toast.add({ severity: 'error', summary: 'error', detail: 'No hay un numero periodo vigente', life: 2500 });
        return;
    }
    fetchBecas();
    toast.add({ severity: 'info', summary: 'Mensaje', detail: 'Se sincronizaron las fechas de caducidad de las becas', life: 2500 });
};

const fetchBecas = async () => {
    becas.value = await getBecasOtorgadas();
    filteredBecas.value = becas.value;
};

const fetchTiposBecas = async () => {
    tiposBecas.value = await getTiposBecas();
};

const fetchPeriodosIstla = async () => {
    periodosIstla.value = await getperiodosIstla();
};

const clearFilters = () => {
    searchQuery.value = '';
    filterState.value = null;
    filterTipoBeca.value = null;
    filterBecaInicio.value = null;
    filterBecas();
};

const filterBecas = () => {
    filteredBecas.value = becas.value.filter(beca => {
        const matchesQuery =
            searchQuery.value === '' ||
            beca.CEDULA_ESTUDIANTE.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesState = filterState.value === null || beca.ESTADO === filterState.value.value;
        const matchesTipoBeca = filterTipoBeca.value === null || beca.TIPO_BECA === filterTipoBeca.value.TIPO_BECA;
        const matchesBecaInicio = filterBecaInicio.value === null || beca.NOMBRE_PERIODO === filterBecaInicio.value.NOMBRE_PERIODO;

        return matchesQuery && matchesState && matchesTipoBeca && matchesBecaInicio;
    });
    first.value = 0;
    currentPage.value = 0;
};

const openEditDialog = (beca) => {
    selectedBeca.value = { ...beca };
    showDialog.value = true;
};

const saveChanges = () => {
    showDialog.value = false;
};

onMounted(() => {
    fetchBecas();
    fetchTiposBecas();
    fetchPeriodosIstla();
});
</script>

<template>
    <h2 class="text-xl font-semibold mb-4" style="margin-bottom: 25px; font-size:25px;">
        Becas Otorgadas
    </h2>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-4 mb-6">
        <InputText v-model="searchQuery" @input="filterBecas" placeholder="Buscar por cédula"
            class="p-2 border border-gray-300 rounded flex-1 min-w-[220px]" />

        <Select v-model="filterTipoBeca" :options="tiposBecas" @change="filterBecas" optionLabel="TIPO_BECA"
            placeholder="Tipo de Beca" class="flex-1 min-w-[200px]" />

        <Select v-model="filterBecaInicio" :options="periodosIstla" @change="filterBecas" optionLabel="NOMBRE_PERIODO"
            placeholder="Inicio de la Beca" class="flex-1 min-w-[200px]" />

        <Select v-model="filterState" :options="states" @change="filterBecas" optionLabel="label" placeholder="Estado"
            class="flex-1 min-w-[180px]" />

        <Button icon="pi pi-eraser" label="Limpiar Filtros" @click="clearFilters" severity="secondary" raised
            class="flex-1 min-w-[150px]" />
        <Toast />
        <Button icon="pi pi-sync" label="" severity="secondary" @click="show" raised class="min-w-[50px]"
            v-tooltip.left="'Sincroniza el periodo de caducida de la beca'" />
    </div>

    <!-- Card Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        <Card v-for="beca in paginatedBecas" :key="beca.ID_BECA"
            class="transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <template #header>
                <div class="relative">
                    <div class="absolute top-0 right-0 m-2">
                        <Tag v-if="beca.ESTADO == 1" icon="pi pi-check" value="Activa" severity="success" rounded />
                        <Tag v-else="beca.ESTADO == 0" icon="pi pi-times" value="Inactiva" severity="danger" rounded />
                    </div>
                </div>
            </template>

            <template #title>
                <div class="flex items-center gap-2 mb-2">
                    <i class="pi pi-user text-primary"></i>
                    <span class="text-xl font-semibold">{{ beca.CEDULA_ESTUDIANTE }}</span>
                </div>
            </template>

            <template #content>
                <div class="flex flex-col gap-3">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-bookmark text-blue-500"></i>
                        <span class="font-medium">{{ beca.TIPO_BECA }}</span>
                    </div>

                    <div class="flex items-center gap-2">
                        <i class="pi pi-percentage text-green-500"></i>
                        <ProgressBar :value="beca.PORCENTAJE" :showValue="true" class="w-full" />
                    </div>

                    <Divider />

                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-calendar text-purple-500"></i>
                            <div>
                                <p class="text-sm text-gray-600">Inicio:</p>
                                <p class="font-medium">{{ beca.NOMBRE_PERIODO }}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <i class="pi pi-calendar-times text-orange-500"></i>
                            <div>
                                <p class="text-sm text-gray-600">Fin:</p>
                                <p class="font-medium">{{ beca.PERIODO_CADUCIDAD }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template #footer>
                <Button icon="pi pi-pencil" label="Editar" @click="openEditDialog(beca)" text class="w-full" />
            </template>
        </Card>
    </div>

    <!-- Paginador -->
    <Paginator v-model:first="first" v-model:rows="rows" :totalRecords="totalRecords" :rowsPerPageOptions="[8, 16, 24]"
        @page="onPageChange" class="mt-4" />

    <!-- Modal -->
    <Dialog v-model:visible="showDialog" :header="'Editar Beca'" pt:mask:class="backdrop-blur-sm"
        :style="{ width: '25rem' }">
        <template #default>
            <div class="mt-4">
                <label class="block mb-2">Porcentaje de Beca</label>
                <InputText v-model="selectedBeca.PORCENTAJE" type="number" class="w-full" />
            </div>
            <div class="mt-4">
                <Select v-model="selectedBeca.ESTADO" :options="states" optionLabel="label" placeholder="Estado" />
            </div>
        </template>
        <template #footer>
            <Button label="Guardar" @click="saveChanges" severity="success" style="height: 45px;" />
            <Button label="Cancelar" @click="saveChanges" severity="danger" style="height: 45px;" />
        </template>
    </Dialog>
</template>

<style scoped>
@media (min-width: 768px) and (max-width: 1279px) {
    .grid {
        @apply grid-cols-3 !important;
    }
}
</style>