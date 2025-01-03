<script setup>
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import {
    postCrearPlazoBecas, getPlazoBecas, getPlazoBecasActivas,
    deletePlazoBecas, putActualizarPlazoBecas
} from '../../services/vigenciaBecas';
import { getperiodosIstla } from '../../services/api_Istla';

import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const fechaInicio = ref(null)
const fechaFin = ref(null)
const periodo = ref();
const plazos = ref([]);
const editingRows = ref([]);
const vigenciaBecas = ref();

const fetchPlazoBecas = async () => {
    plazos.value = await getPlazoBecas();
    plazos.value.forEach(plazo => {
        plazo.FECHA_INICIO = new Date(plazo.FECHA_INICIO).toLocaleDateString("es-ES");
        plazo.FECHA_FIN = new Date(plazo.FECHA_FIN).toLocaleDateString("es-ES");
    });
};

const fetchPeriodosIstla = async () => {
    const periodosArray = await getperiodosIstla();
    periodo.value = periodosArray.sort((a, b) => b.ID_PERIODO - a.ID_PERIODO)[0];
}

const refreshData = async () => {
    await fetchPlazoBecas();
};

const parseFecha = (fecha) => {
    if (fecha instanceof Date) {
        return fecha;
    }

    if (typeof fecha === 'string') {
        const partes = fecha.split('/');
        if (partes.length === 3) {
            const [dia, mes, año] = partes.map(Number);
            return new Date(año, mes - 1, dia);
        }
    }
    return null;
};

const crearPlazo = async () => {
    vigenciaBecas.value = await getPlazoBecasActivas();
    if (vigenciaBecas.value.length > 0) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Ya existe un plazo de becas activo. Por favor, finalice el plazo actual para crear uno nuevo.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        fechaInicio.value = null;
        fechaFin.value = null;
        return;
    }

    if (!fechaInicio.value || !fechaFin.value) {
        Swal.fire({
            title: 'Error',
            text: 'Debe completar tanto la fecha de inicio como la fecha de fin.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const fechaInicioObj = new Date(fechaInicio.value);
    const fechaFinObj = new Date(fechaFin.value);

    if (fechaInicioObj.getTime() === fechaFinObj.getTime()) {
        Swal.fire({
            title: 'Error',
            text: 'Las fechas no puedes ser las mismas',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    if (fechaFinObj < fechaInicioObj) {
        Swal.fire({
            title: 'Error',
            text: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const data = {
        fechaInicio: fechaInicio.value,
        fechaFin: fechaFin.value,
        periodo: periodo.value.ID_PERIODO,
    };

    try {
        await postCrearPlazoBecas(data);
        Swal.fire({
            title: '¡Éxito!',
            text: 'El plazo para solicitar becas se ha creado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            fechaInicio.value = null;
            fechaFin.value = null;
            refreshData();
        });
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al crear el plazo. Inténtelo nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            fechaInicio.value = null;
            fechaFin.value = null;
        });
    }
};

const eliminarPlazo = async (id) => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminará el plazo de becas y no se podrá recuperar.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const elimiarPlazo = await deletePlazoBecas(id);
                if (!elimiarPlazo) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Ya hay solicitudes en curso para este plazo. No se puede eliminar. Pero se procederá a finalizarlo.',
                        icon: 'warning',
                        confirmButtonText: 'Aceptar'
                    });
                    await refreshData();
                    return;
                }
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'El plazo se ha eliminado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                await refreshData();
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al eliminar el plazo. Inténtelo nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    });
};

const editRow = (rowData) => {
    editingRows.value = [{ ...rowData }];
};

const saveRowEdit = async (rowData) => {
    const fechaInicio = parseFecha(rowData.FECHA_INICIO);
    const fechaFin = parseFecha(rowData.FECHA_FIN);

    try {
        if (fechaInicio.getTime() === fechaFin.getTime()) {
            Swal.fire({
                title: 'Error',
                text: 'Las fechas no pueden ser las mismas',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }


        if (fechaFin.getTime() < fechaInicio.getTime()) {
            Swal.fire({
                title: 'Error',
                text: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        await putActualizarPlazoBecas(rowData);

        Swal.fire({
            title: '¡Éxito!',
            text: 'El plazo se ha actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

        editingRows.value = [];
        await refreshData();
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al actualizar el plazo. Inténtelo nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
};

const cancelRowEdit = () => {
    editingRows.value = [];
};

onMounted(() => {
    fetchPeriodosIstla();
    fetchPlazoBecas();
})

</script>

<template>
    <h2 class="text-xl font-semibold mb-4" style="margin-bottom: 25px; font-size:25px;">Periodos de Becas</h2>
    <div class="flex flex-wrap items-center justify-between" style="margin-bottom: 25px;">
        <div class="w-full">
            <div class="card">
                <form @submit.prevent="onSubmit" class="flex items-center w-full gap-4">
                    <!-- Fecha de Inicio -->
                    <div class="flex-1">
                        <label for="fechaInicio" class="font-semibold">Fecha de Inicio</label>
                        <DatePicker id="fechaInicio" v-model="fechaInicio" dateFormat="dd/mm/yy" :showIcon="true"
                            class="w-full" />
                    </div>
                    <!-- Fecha de Fin -->
                    <div class="flex-1">
                        <label for="fechaFin" class="font-semibold">Fecha de Fin</label>
                        <DatePicker id="fechaFin" v-model="fechaFin" dateFormat="dd/mm/yy" :showIcon="true"
                            class="w-full" />
                    </div>
                    <!-- Botón Iniciar -->
                    <div class="flex-none">
                        <Button type="button" @click="crearPlazo()" label="Iniciar" severity="secondary" raised
                            class="h-[40px] px-4" style="margin-top: 25px;" />
                    </div>
                    <!-- Botón Refrescar -->
                    <div class="flex-none">
                        <Button type="button" @click="refreshData()" label="Refrescar" severity="secondary" raised
                            class="h-[40px] px-4" style="margin-top: 25px;" />
                    </div>
                </form>
            </div>
        </div>
    </div>


    <div class="rounded-lg overflow-hidden shadow-lg">
        <DataTable :value="plazos" responsiveLayout="stack" :paginator="true" :rows="5" :editingRows="editingRows"
            editMode="row">
            <Column field="FECHA_INICIO" header="Fecha Inicio" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.FECHA_INICIO }}
                </template>
                <template #editor="{ data, field }">
                    <DatePicker v-model="data[field]" dateFormat="dd/mm/yy" :showIcon="true" />
                </template>
            </Column>

            <Column field="FECHA_FIN" header="Fecha Fin" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.FECHA_FIN }}
                </template>
                <template #editor="{ data, field }">
                    <DatePicker v-model="data[field]" dateFormat="dd/mm/yy" :showIcon="true" />
                </template>
            </Column>

            <Column header="Estado" :sortable="true">
                <template #body="slotProps">
                    <Tag v-if="slotProps.data.istla_estado_solicitud.ESTADO === 'En curso'" icon="pi pi-spin pi-refresh"
                        :value="slotProps.data.istla_estado_solicitud.ESTADO" severity="secondary" />
                    <Tag v-else icon="pi pi-clock" :value="slotProps.data.istla_estado_solicitud.ESTADO"
                        severity="warn" />
                </template>
            </Column>

            <Column header="Acciones">
                <template #body="slotProps">
                    <div class="flex items-center gap-2">
                        <!-- Botones de edición -->
                        <Button v-if="!editingRows.some(row => row.ID_VIGENCIA === slotProps.data.ID_VIGENCIA)" unstyled
                            class="zoom-button" @click="editRow(slotProps.data)"
                            :class="{ 'opacity-50 cursor-not-allowed': slotProps.data.istla_estado_solicitud.ESTADO === 'Finalizado' }"
                            :disabled="slotProps.data.istla_estado_solicitud.ESTADO === 'Finalizado'"
                            style="margin-bottom: 0.5rem;">
                            <Tag icon="pi pi-pencil" severity="success" value="Actualizar"></Tag>
                        </Button>

                        <!-- Botones de guardar/cancelar -->
                        <Button v-if="editingRows.some(row => row.ID_VIGENCIA === slotProps.data.ID_VIGENCIA)" unstyled
                            class="zoom-button" @click="saveRowEdit(slotProps.data)" style="margin-bottom: 0.5rem;">
                            <Tag icon="pi pi-save" severity="success" value="Guardar"></Tag>
                        </Button>

                        <Button v-if="editingRows.some(row => row.ID_VIGENCIA === slotProps.data.ID_VIGENCIA)" unstyled
                            class="zoom-button" @click="cancelRowEdit()" style="margin-bottom: 0.5rem;">
                            <Tag icon="pi pi-times" severity="danger" value="Cancelar"></Tag>
                        </Button>

                        <!-- Botón eliminar -->
                        <Button v-if="!editingRows.some(row => row.ID_VIGENCIA === slotProps.data.ID_VIGENCIA)" unstyled
                            class="zoom-button"
                            :class="{ 'opacity-50 cursor-not-allowed': slotProps.data.istla_estado_solicitud.ESTADO === 'Finalizado' }"
                            :disabled="slotProps.data.istla_estado_solicitud.ESTADO === 'Finalizado'"
                            style="margin-bottom: 0.5rem;" @click="eliminarPlazo(slotProps.data.ID_VIGENCIA)">
                            <Tag icon="pi pi-trash" severity="danger" value="Eliminar"></Tag>
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
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
