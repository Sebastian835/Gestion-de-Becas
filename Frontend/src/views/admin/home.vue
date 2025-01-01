<script setup>
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import { postCrearPlazoBecas, getPlazoBecas } from '../../services/vigenciaBecas';
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

const becasTotal = ref(25);
const becasCompletas = ref(15);
const becasMitad = ref(10);
const otrasBecas = ref(5);

const editingRows = ref([]);

const editRow = (rowData) => {
    console.log(editingRows.value);

    editingRows.value = [rowData];

    console.log(editingRows.value);
};

const saveRowEdit = async (rowData) => {
    try {
        // Validar fechas
        const fechaInicio = new Date(rowData.FECHA_INICIO);
        const fechaFin = new Date(rowData.FECHA_FIN);

        if (fechaInicio.getTime() === fechaFin.getTime()) {
            Swal.fire({
                title: 'Error',
                text: 'Las fechas no pueden ser las mismas',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        if (fechaFin < fechaInicio) {
            Swal.fire({
                title: 'Error',
                text: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Llamar a tu servicio para actualizar
        // await putActualizarPlazoBecas(rowData);

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

const fetchPeriodosIstla = async () => {
    const periodosArray = await getperiodosIstla();
    periodo.value = periodosArray.sort((a, b) => b.ID_PERIODO - a.ID_PERIODO)[0];
};

const fetchPlazoBecas = async () => {
    plazos.value = await getPlazoBecas();
    plazos.value.forEach(plazo => {
        plazo.FECHA_INICIO = new Date(plazo.FECHA_INICIO).toLocaleDateString("es-ES");
        plazo.FECHA_FIN = new Date(plazo.FECHA_FIN).toLocaleDateString("es-ES");
    });

};

const refreshData = async () => {
    await fetchPlazoBecas();
};

const crearPlazo = async () => {
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



onMounted(() => {
    fetchPeriodosIstla();
    fetchPlazoBecas();
});

</script>

<template>
    <div class="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
            <div class="p-4 text-center">
                <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                    <strong class="text-green-500"> Becas
                        Otorgadas</strong>&nbsp;
                </p>
            </div>
            <div class="border-t border-blue-gray-50 p-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div
                        class="rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg grid h-16 w-16 place-items-center">
                        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none" class="w-9 h-9">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path fill="#ffffff" fill-rule="evenodd"
                                    d="M4 1a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0017.414 6L13 1.586A2 2 0 0011.586 1H4zm0 2h7.586L16 7.414V17H4V3zm2 2a1 1 0 000 2h5a1 1 0 100-2H6zm-1 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h8a1 1 0 100-2H6z">
                                </path>
                            </g>
                        </svg>
                    </div>
                    <div>
                        <h4
                            class="block antialiased tracking-normal font-sans text-3xl font-semibold leading-snug text-blue-gray-900">
                            {{ becasTotal }}
                        </h4>
                    </div>

                </div>
            </div>
        </div>
        <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
            <div class="p-4 text-center">
                <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                    <strong class="text-black-500"> Becas
                        del</strong>
                    <strong class="text-green-500"> 100%</strong>&nbsp;
                </p>
            </div>
            <div class="border-t border-blue-gray-50 p-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div
                        class="rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-blue-500/40 shadow-lg grid h-16 w-16 place-items-center">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M17 8V6C17 4.11438 17 3.17157 16.4142 2.58579C15.8284 2 14.8856 2 13 2H11C9.11438 2 8.17157 2 7.58579 2.58579C7 3.17157 7 4.11438 7 6V8"
                                    stroke="#ffffff" stroke-width="1.5"></path>
                                <path
                                    d="M19.7943 11.0312C19.7943 9.93319 19.1944 8.92292 18.2305 8.39728L13.4362 5.78311C12.541 5.29495 11.4591 5.29495 10.5638 5.78311L5.76962 8.39728C4.80563 8.92292 4.20581 9.93318 4.20581 11.0312V15.9688C4.20581 17.0668 4.80563 18.0771 5.76962 18.6027L10.5638 21.2169C11.4591 21.705 12.541 21.705 13.4362 21.2169L18.2305 18.6027C19.1944 18.0771 19.7943 17.0668 19.7943 15.9688V15"
                                    stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path>
                                <path
                                    d="M11.1459 11.5228C11.5259 10.8411 11.7159 10.5002 12 10.5002C12.2841 10.5002 12.4741 10.8411 12.8541 11.5228L12.9524 11.6991C13.0603 11.8928 13.1143 11.9897 13.1985 12.0536C13.2827 12.1175 13.3875 12.1412 13.5972 12.1887L13.7881 12.2319C14.526 12.3988 14.895 12.4823 14.9828 12.7646C15.0706 13.0468 14.819 13.341 14.316 13.9292L14.1858 14.0814C14.0429 14.2486 13.9714 14.3322 13.9392 14.4356C13.9071 14.539 13.9179 14.6505 13.9395 14.8735L13.9592 15.0766C14.0352 15.8614 14.0733 16.2539 13.8435 16.4283C13.6136 16.6028 13.2682 16.4437 12.5773 16.1256L12.3986 16.0433C12.2022 15.9529 12.1041 15.9077 12 15.9077C11.8959 15.9077 11.7978 15.9529 11.6014 16.0433L11.4227 16.1256C10.7318 16.4437 10.3864 16.6028 10.1565 16.4283C9.92674 16.2539 9.96476 15.8614 10.0408 15.0766L10.0605 14.8735C10.0821 14.6505 10.0929 14.539 10.0608 14.4356C10.0286 14.3322 9.95713 14.2486 9.81418 14.0814L9.68403 13.9292C9.18097 13.341 8.92945 13.0468 9.01723 12.7646C9.10501 12.4823 9.47396 12.3988 10.2119 12.2319L10.4028 12.1887C10.6125 12.1412 10.7173 12.1175 10.8015 12.0536C10.8857 11.9897 10.9397 11.8928 11.0476 11.6991L11.1459 11.5228Z"
                                    stroke="#ffffff" stroke-width="1.5"></path>
                            </g>
                        </svg>
                    </div>
                    <div>
                        <h4
                            class="block antialiased tracking-normal font-sans text-3xl font-semibold leading-snug text-blue-gray-900">
                            {{ becasCompletas }}
                        </h4>
                    </div>

                </div>
            </div>
        </div>
        <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
            <div class="p-4 text-center">
                <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                    <strong class="text-black-500"> Becas
                        del</strong>
                    <strong class="text-green-500"> 50%</strong>&nbsp;
                </p>
            </div>
            <div class="border-t border-blue-gray-50 p-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div
                        class="rounded-xl overflow-hidden bg-gradient-to-tr from-green-600 to-green-400 text-white shadow-blue-500/40 shadow-lg grid h-16 w-16 place-items-center">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 7.19887C13.0603 7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 7.73161C14.526 7.89857 14.895 7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 11.6014 11.5431L11.4227 11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 10.5763L10.0605 10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 7.02251Z"
                                    stroke="#ffffff" stroke-width="1.5"></path>
                                <path
                                    d="M12 16.0678L8.22855 19.9728C7.68843 20.5321 7.41837 20.8117 7.18967 20.9084C6.66852 21.1289 6.09042 20.9402 5.81628 20.4602C5.69597 20.2495 5.65848 19.8695 5.5835 19.1095C5.54117 18.6804 5.52 18.4658 5.45575 18.2861C5.31191 17.8838 5.00966 17.5708 4.6211 17.4219C4.44754 17.3554 4.24033 17.3335 3.82589 17.2896C3.09187 17.212 2.72486 17.1732 2.52138 17.0486C2.05772 16.7648 1.87548 16.1662 2.08843 15.6266C2.18188 15.3898 2.45194 15.1102 2.99206 14.5509L5.45575 12"
                                    stroke="#ffffff" stroke-width="1.5"></path>
                                <path
                                    d="M12 16.0678L15.7715 19.9728C16.3116 20.5321 16.5816 20.8117 16.8103 20.9084C17.3315 21.1289 17.9096 20.9402 18.1837 20.4602C18.304 20.2495 18.3415 19.8695 18.4165 19.1095C18.4588 18.6804 18.48 18.4658 18.5442 18.2861C18.6881 17.8838 18.9903 17.5708 19.3789 17.4219C19.5525 17.3554 19.7597 17.3335 20.1741 17.2896C20.9081 17.212 21.2751 17.1732 21.4786 17.0486C21.9423 16.7648 22.1245 16.1662 21.9116 15.6266C21.8181 15.3898 21.5481 15.1102 21.0079 14.5509L18.5442 12"
                                    stroke="#ffffff" stroke-width="1.5"></path>
                                <path
                                    d="M5.5 6.39691C5.17745 7.20159 5 8.08007 5 9C5 12.866 8.13401 16 12 16C15.866 16 19 12.866 19 9C19 5.13401 15.866 2 12 2C11.0801 2 10.2016 2.17745 9.39691 2.5"
                                    stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path>
                            </g>
                        </svg>
                    </div>
                    <div>
                        <h4
                            class="block antialiased tracking-normal font-sans text-3xl font-semibold leading-snug text-blue-gray-900">
                            {{ becasMitad }}
                        </h4>
                    </div>

                </div>
            </div>
        </div>
        <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
            <div class="p-4 text-center">
                <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                    <strong class="text-black-500"> Otras
                        Becas</strong>&nbsp;
                </p>
            </div>
            <div class="border-t border-blue-gray-50 p-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div
                        class="rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-blue-500/40 shadow-lg grid h-16 w-16 place-items-center">
                        <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <title>comment 4</title>
                                <desc>Created with Sketch Beta.</desc>
                                <defs> </defs>
                                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
                                    sketch:type="MSPage">
                                    <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                        transform="translate(-310.000000, -257.000000)" fill="#ffffff">
                                        <path
                                            d="M326,257 C317.163,257 310,263.143 310,270.72 C310,276.969 314.877,282.232 321.542,283.889 L326,289.001 L330.459,283.889 C337.123,282.232 342,276.969 342,270.72 C342,263.143 334.837,257 326,257"
                                            id="comment-4" sketch:type="MSShapeGroup"> </path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div>
                        <h4
                            class="block antialiased tracking-normal font-sans text-3xl font-semibold leading-snug text-blue-gray-900">
                            {{ otrasBecas }}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <h1 class="text-2xl font-semibold text-center mb-4">Periodos de Becas</h1>

    <div class="flex">
        <div class="w-1/3 pr-4">
            <div class="card">
                <form @submit.prevent="onSubmit" class="space-y-4">
                    <div class="flex flex-col gap-2">
                        <label for="fechaInicio" class="font-semibold">Fecha de Inicio</label>
                        <DatePicker id="fechaInicio" v-model="fechaInicio" dateFormat="dd/mm/yy" :showIcon="true" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="fechaFin" class="font-semibold">Fecha de Fin</label>
                        <DatePicker id="fechaFin" v-model="fechaFin" dateFormat="dd/mm/yy" :showIcon="true" />
                    </div>
                    <Button type="button" @click="crearPlazo()" label="Iniciar" class="w-full" />
                </form>
            </div>
        </div>
        <div class="w-2/3">
            <DataTable :value="plazos" responsiveLayout="stack" :paginator="true" :rows="3" :editingRows="editingRows"
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
                        <Tag v-if="slotProps.data.istla_estado_solicitud.ESTADO === 'En curso'"
                            icon="pi pi-spin pi-refresh" :value="slotProps.data.istla_estado_solicitud.ESTADO"
                            severity="secondary" />
                        <Tag v-else icon="pi pi-check" :value="slotProps.data.istla_estado_solicitud.ESTADO"
                            severity="danger" />
                    </template>
                </Column>

                <Column header="Acciones">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">

                            <Button v-if="!editingRows.includes(slotProps.data)" unstyled class="zoom-button"
                                @click="editRow(slotProps.data)"
                                :class="{ 'opacity-50 cursor-not-allowed': slotProps.data.istla_estado_solicitud.ESTADO === 'Finalizado' }"
                                :disabled="slotProps.data.istla_estado_solicitud.ESTADO === 'Finalizado'"
                                style="margin-bottom: 0.5rem;">
                                <Tag icon="pi pi-pencil" severity="success" value="Actualizar"></Tag>
                            </Button>

                            <Button v-if="editingRows.includes(slotProps.data)" unstyled class="zoom-button"
                                @click="saveRowEdit(slotProps.data)" style="margin-bottom: 0.5rem;">
                                <Tag icon="pi pi-save" severity="success" value="Guardar"></Tag>
                            </Button>

                            <Button v-if="editingRows.includes(slotProps.data)" unstyled class="zoom-button"
                                @click="cancelRowEdit()" style="margin-bottom: 0.5rem;">
                                <Tag icon="pi pi-times" severity="danger" value="Cancelar"></Tag>
                            </Button>

                            <Button v-if="!editingRows.includes(slotProps.data)" unstyled class="zoom-button"
                                :class="{ 'opacity-50 cursor-not-allowed': slotProps.data.istla_estado_solicitud.ESTADO === 'Finalizado' }"
                                :disabled="slotProps.data.istla_estado_solicitud.ESTADO === 'Finalizado'"
                                style="margin-bottom: 0.5rem;">
                                <Tag icon="pi pi-trash" severity="danger" value="Eliminar"></Tag>
                            </Button>
                        </div>
                    </template>
                </Column>

            </DataTable>
        </div>
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
