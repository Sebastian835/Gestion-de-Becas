<script setup>
import { ref, onMounted, computed } from 'vue';
import { getBecasOtorgadas, updateSincronizar, updateBeca, updateCaducidad, updatePorcentaje } from '../../services/becasOtorgadas';
import { getTiposBecas } from '../../services/tiposBecas';
import { getperiodosIstla } from '../../services/api_Istla';
import Swal from 'sweetalert2';

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

const verPDFDialog = ref(false);
const pdfUrl = ref('');

const mostrarPaginacion = ref(true);

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
    { label: 'Finalizado', value: 6 },
    { label: 'Activo', value: 7 },
    { label: 'Inactivo', value: 8 },
];

const fetchBecas = async () => {
    becas.value = await getBecasOtorgadas();
    console.log(becas.value)
    if (becas.value.noHay === true) {
        toast.add({ severity: 'info', summary: 'Informacion', detail: 'No hay becas', life: 2000 });
        mostrarPaginacion.value = false;
        return false;
    }
    filteredBecas.value = becas.value;
};

const fetchTiposBecas = async () => {
    tiposBecas.value = await getTiposBecas();
};

const fetchPeriodosIstla = async () => {
    periodosIstla.value = await getperiodosIstla();
};

const show = async () => {
    const refresh = await fetchBecas();
    if (refresh === false) {
        return;
    }

    Swal.fire({
        title: "Actualizando fechas de caducidad",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    const sincronizacion = await updateSincronizar();
    if (!sincronizacion) {
        toast.add({ severity: 'info', summary: 'Error', detail: 'No hay becas para actualizar o aun no hay un nuevo perido', life: 4000 });
        Swal.close();
        return;
    }
    Swal.close();
    fetchBecas();
    toast.add({ severity: 'success', summary: 'Mensaje', detail: 'Se sincronizaron las fechas de caducidad de las becas', life: 2500 });
};

const caducidad = async () => {
    const refresh = await fetchBecas();
    if (refresh === false) {
        return;
    }
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción finalizara las becas expiradas, por lo tanto no se mostraran en esta interfaz, ¿Desea continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
        try {
            Swal.fire({
                title: "Finalizando becas expiradas",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const caducar = await updateCaducidad();
            Swal.close();
            Swal.fire({
                title: 'Finalizado',
                text: 'Las becas expiradas han sido finalizadas exitosamente.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
            });
            fetchBecas();
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Ocurrio un error al finalizar las becas expiradas, intentelo de nuevo.',
                icon: 'error',
                confirmButtonColor: '#d33',
            });
        }
    }
};

const asignarPropuesta = async () => {
    const refresh = await fetchBecas();
    if (refresh === false) {
        return;
    }
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción asignará el porcentaje de beca establecido al aceptar la documentación del solicitante. ¿Desea continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
        try {
            Swal.fire({
                title: "Asignando porcentaje de becas",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const caducar = await updatePorcentaje();
            Swal.close();
            Swal.fire({
                title: 'Finalizado',
                text: 'El porcentaje de becas ha sido asignado exitosamente.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
            });
            fetchBecas();
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Ocurrio un error al asignar el porcentaje de becas, intentelo de nuevo.',
                icon: 'error',
                confirmButtonColor: '#d33',
            });
        }
    }
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
        const matchesQueryName =
            searchQuery.value === '' ||
            beca.NOMBRE_ESTUDIANTE.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesState = filterState.value === null || beca.ID_ESTADO === filterState.value.value;
        const matchesTipoBeca = filterTipoBeca.value === null || beca.TIPO_BECA === filterTipoBeca.value.TIPO_BECA;

        return matchesQueryName && matchesQuery && matchesState && matchesTipoBeca;
    });
    first.value = 0;
    currentPage.value = 0;
};

const openEditDialog = (beca) => {
    selectedBeca.value = { ...beca };
    showDialog.value = true;
};

const cancelar = () => {
    showDialog.value = false;
};

const actualizarBeca = async (beca) => {
    try {
        const data = {
            ID_BECA: beca.ID_BECA,
            PORCENTAJE: beca.PORCENTAJE,
            ID_ESTADO: beca.ID_ESTADO.value,
        };
        if (beca.PORCENTAJE <= 0 || beca.PORCENTAJE > 100) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'El porcentaje debe ser entre 0 y 100', life: 3000 });
            return;
        }

        const actualizar = await updateBeca(data);
        showDialog.value = false;
        fetchBecas();
        toast.add({ severity: 'success', summary: 'Mensaje', detail: 'Se actualizo la beca', life: 3000 });
        return;
    } catch (error) {
        showDialog.value = false;
        throw error
    }

};

const mostrarRenovacion = (beca) => {
    if (!beca.RENOVACION) {
        toast.add({
            severity: 'info',
            summary: 'Sin documento',
            detail: 'No hay documento de renovación enviado',
            life: 3000
        });
        return;
    }
    pdfUrl.value = `${import.meta.env.VITE_API_URL}/becasOtorgadas/verDocumento?ruta=${encodeURIComponent(beca.RENOVACION)}`;
    verPDFDialog.value = true;
};


onMounted(() => {
    fetchBecas();
    fetchTiposBecas();
    fetchPeriodosIstla();
});
</script>

<template>
    <h2 class="text-2xl font-bold text-gray-800 mb-8" style="color: #161E2D;">
        Becas Otorgadas
    </h2>

    <!-- Filtros -->
    <div class="flex flex-col gap-4 mb-6">
        <!-- Grid de 4 columnas para filtros -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputText v-model="searchQuery" @input="filterBecas" placeholder="Buscar por cédula o nombre"
                class="p-2 border border-gray-300 rounded w-full" />

            <Select v-model="filterTipoBeca" :options="tiposBecas" @change="filterBecas" optionLabel="TIPO_BECA"
                placeholder="Tipo de Beca" class="w-full" />

            <div class="flex gap-2 items-center">
                <Select v-model="filterState" :options="states" @change="filterBecas" optionLabel="label"
                    placeholder="Estado" class="w-full" />
            </div>

            <!-- Segunda fila con botones -->
            <div class="flex gap-2 items-center">
                <Button icon="pi pi-eraser" label="Limpiar filtros" @click="clearFilters" severity="secondary"
                    class="w-1/2" raised />
                <Button icon="pi pi-sync" @click="show" severity="secondary" raised class="h-12 w-12"
                    v-tooltip.left="'Sincroniza el periodo de caducidad de la beca'" />
                <Button icon="pi pi-stop-circle" @click="caducidad" severity="secondary" raised class="h-12 w-12"
                    v-tooltip.right="'Se finalizaron las becas expiradas'" />
                <Button icon="pi pi-check-circle" @click="asignarPropuesta" severity="secondary" raised
                    class="h-12 w-12" v-tooltip.right="'Asignar propuesta de porcentaje de becas'" />
            </div>
        </div>

        <Toast />
    </div>

    <!-- Card Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        <Card v-for="beca in paginatedBecas" :key="beca.ID_BECA"
            class="transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <template #header>
                <div class="relative">
                    <div class="absolute top-0 right-0 m-0.5">
                        <Tag v-if="beca.ID_ESTADO == 7" icon="pi pi-check" value="Activa" severity="success" rounded
                            class="p-tag-sm py-0.5 text-xs" />
                        <Tag v-else-if="beca.ID_ESTADO == 8" icon="pi pi-ban" value="Inactiva" severity="warn" rounded
                            class="p-tag-sm py-0.5 text-xs" />
                        <Tag v-else="beca.ID_ESTADO == 6" icon="pi pi-times" value="Finalizada" severity="info" rounded
                            class="p-tag-sm py-0.5 text-xs" />
                    </div>
                </div>
            </template>

            <template #title>
                <div class="flex items-center gap-2 mb-2">
                    <i class="pi pi-user text-primary"></i>
                    <span class="text-xl font-semibold">{{ beca.NOMBRE_ESTUDIANTE }}</span>
                </div>
                <div class="flex items-center gap-2 mb-2">
                    <i class="pi pi-id-card text-primary"></i>
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

                    <div class="flex items-center gap-2" v-if="beca.PROMEDIO_2 != null">
                        <i class="pi pi-star text-yellow-500"></i>
                        <span class="font-medium">{{ beca.PROMEDIO_2 }}</span>
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
                <div class="flex justify-center gap-x-2">
                    <Button v-if="beca.ID_ESTADO != 6" icon="pi pi-pencil" label="Editar" @click="openEditDialog(beca)"
                        text />
                    <Button v-if="beca.ID_ESTADO != 6" icon="pi pi-sync" label="Renovacion" text severity="info"
                        @click="mostrarRenovacion(beca)" />
                </div>
            </template>


        </Card>
    </div>

    <!-- Paginador -->
    <Paginator v-if="mostrarPaginacion" v-model:first="first" v-model:rows="rows" :totalRecords="totalRecords"
        :rowsPerPageOptions="[8, 16, 24]" @page="onPageChange" class="mt-4" />

    <!-- Modal Actualizar Beca -->
    <Dialog v-model:visible="showDialog" :header="'Editar Beca'" pt:mask:class="backdrop-blur-sm"
        :style="{ width: '25rem' }">
        <template #default>
            <div class="mt-4">
                <label class="block mb-2">Porcentaje de Beca</label>
                <InputText v-model="selectedBeca.PORCENTAJE" type="number" class="w-full" />
            </div>
            <div class="mt-4">
                <Select v-model="selectedBeca.ID_ESTADO" :options="states" optionLabel="label" placeholder="Estado" />
            </div>
        </template>
        <template #footer>
            <Button label="Guardar" @click="actualizarBeca(selectedBeca)" severity="success" style="height: 45px;" />
            <Button label="Cancelar" @click="cancelar" severity="danger" style="height: 45px;" />
        </template>
    </Dialog>

    <!-- Modal Renovacion Beca -->
    <Dialog v-model:visible="verPDFDialog" modal header="Documento de Renovación" :style="{ width: '70vw' }"
        :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
        <iframe v-if="pdfUrl" :src="pdfUrl" style="width: 100%; height: 80vh;" frameborder="0"></iframe>
    </Dialog>

</template>

<style scoped>
@media (min-width: 768px) {
    .grid {
        @apply grid-cols-3 !important;
    }
}
</style>