<script setup>
import { ref, onMounted } from 'vue';
import { getUsuariosIstla } from '../../services/api_Istla';
import { getHistorico } from '../../services/historico';

import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import Panel from 'primevue/panel';
import Select from 'primevue/select';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const usuariosIstla = ref([]);
const selectedAlumno = ref(null);
const filteredUsuarios = ref([]);
const historicoBecas = ref([]);
const dialogVisible = ref(false);
const documentoUrl = ref('');
const documentoTitulo = ref('');
const historico = ref([]);

const fechUsuarios = async () => {
    usuariosIstla.value = await getUsuariosIstla();
    filteredUsuarios.value = usuariosIstla.value;
};

const searchAlumnos = (event) => {
    filteredUsuarios.value = usuariosIstla.value.filter((usuario) =>
        usuario.label.toLowerCase().includes(event.query.toLowerCase())
    );
};

const buscar = async () => {
    if (!selectedAlumno.value) {
        toast.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Seleccione un alumno',
            life: 3000
        });
        return;
    }

    try {
        const response = await getHistorico(selectedAlumno.value.value);
        if (!response || response.length === 0) {
            toast.add({
                severity: 'info',
                summary: 'Info',
                detail: 'No se encontró histórico para el alumno seleccionado',
                life: 3000
            });
            return;
        }
        historicoBecas.value = response;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al obtener el histórico',
            life: 3000
        });
    }
};

const getDocumentosValidos = (beca) => {
    return Object.entries(beca)
        .filter(([key, value]) =>
            value &&
            key !== 'SOLICITUD' &&
            (key.includes('CERTIFICADO') ||
                key === 'COPIA_CEDULA' ||
                key.includes('INFORME') ||
                key.includes('DECLARACION') ||
                key.includes('FICHA') ||
                key.includes('CARNE') ||
                key.includes('TRAYECTORIA') ||
                key.includes('PARTIDA') ||
                key.includes('MECANIZADO'))
        )
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
};

const formatearNombreDocumento = (tipo) => {
    return tipo
        .split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
};

const verDocumento = (url, titulo) => {
    documentoUrl.value = url;
    if(!documentoUrl.value){
        toast.add({
            severity: 'info',
            summary: 'Info',
            detail: 'No hay documento disponible',
            life: 3000
        });
        return;
    }
    documentoTitulo.value = titulo;
    dialogVisible.value = true;
};

const getEstadoSeverity = (estado) => {
    switch (estado.toLowerCase()) {
        case 'activo':
            return 'success';
        case 'finalizado':
            return 'info';
        case 'rechazado':
            return 'danger';
        default:
            return 'warning';
    }
};

onMounted(() => {
    fechUsuarios();
});

</script>


<template>
    <Toast />
    <div class="flex flex-col gap-4">
        <!-- Buscador -->
        <div class="flex gap-2">
            <AutoComplete inputId="alumnos" placeholder="Buscar Alumno" v-model="selectedAlumno" optionLabel="label"
                :suggestions="filteredUsuarios" @complete="searchAlumnos" :style="{
                    width: '30% !important',
                    display: 'block !important'
                }" :inputStyle="{
                    width: '100% !important',
                    height: '48px !important',
                    padding: '0.75rem !important'
                }" />
            <Button icon="pi pi-search" label="Buscar" @click="buscar" severity="secondary" raised />
        </div>

        <!-- Histórico de Becas -->
        <div v-if="historicoBecas.length" class="grid gap-4">
            <!-- Dos cards por fila -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                <div v-for="(beca, index) in historicoBecas" :key="index">
                    <Card class="shadow-sm">
                        <!-- Encabezado -->
                        <template #header>
                            <div class="bg-gray-50 p-4 border-b">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-bookmark text-primary"></i>
                                        <span class="text-lg font-semibold text-gray-800">{{ beca.TIPO_BECA }}</span>
                                    </div>
                                    <Tag :severity="getEstadoSeverity(beca.ESTADO)" class="!text-xs !px-3 !py-1">
                                        {{ beca.ESTADO }}
                                    </Tag>
                                </div>
                            </div>
                        </template>

                        <!-- Contenido principal -->
                        <template #content>
                            <div class="flex flex-col gap-3">
                                <!-- Información de la beca -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="flex flex-col gap-1">
                                        <div class="text-sm text-gray-600">Periodo Solicitud</div>
                                        <div class="font-medium">{{ beca.PERIODO_SOLICITUD }}</div>
                                    </div>
                                    <div v-if="beca.PERIODO_CADUCIDAD" class="flex flex-col gap-1">
                                        <div class="text-sm text-gray-600">Periodo Caducidad</div>
                                        <div class="font-medium">{{ beca.PERIODO_CADUCIDAD }}</div>
                                    </div>
                                    <div class="col-span-2">
                                        <div class="text-sm text-gray-600 mb-1">Porcentaje</div>
                                        <ProgressBar :value="beca.PORCENTAJE" :showValue="true" class="w-full" />
                                    </div>
                                </div>

                                <!-- Panel desplegable para documentos -->
                                <Panel toggleable collapsed class="mt-3">
                                    <template #header>
                                        <div class="flex items-center gap-2">
                                            <i class="pi pi-file-pdf"></i>
                                            <span>Documentos</span>
                                        </div>
                                    </template>
                                    <div class="flex flex-col gap-2">
                                        <!-- Solicitud -->
                                        <div class="flex gap-2">
                                            <Button icon="pi pi-file-pdf" label="Solicitud" severity="success" text
                                                @click="verDocumento(beca.SOLICITUD, 'Solicitud')"
                                                class="p-button-sm !justify-start !px-1" />
                                            <Button icon="pi pi-file-pdf" label="Renovacion" severity="info" text
                                                @click="verDocumento(beca.RENOVACION, 'Renovacion')"
                                                class="p-button-sm !justify-start !px-1" />
                                        </div>

                                        <!-- Grid de documentos -->
                                        <div class="grid grid-cols-2 gap-2">
                                            <div v-for="(ruta, tipo) in getDocumentosValidos(beca)" :key="tipo">
                                                <Button icon="pi pi-file-pdf" :label="formatearNombreDocumento(tipo)"
                                                    severity="secondary" text
                                                    @click="verDocumento(ruta, formatearNombreDocumento(tipo))"
                                                    class="p-button-sm !justify-start !px-1 text-left !whitespace-normal !h-auto text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
        </div>

        <Dialog :header="documentoTitulo" v-model:visible="dialogVisible" style="width: 80vw"
            pt:mask:class="backdrop-blur-sm">
            <embed v-if="documentoUrl" :src="documentoUrl" type="application/pdf" width="100%" height="500px" />
        </Dialog>
    </div>
</template>

<style scoped>
:deep(.p-panel-header) {
    padding: 0.5rem 1rem;
}

:deep(.p-panel-content) {
    padding: 1rem;
}

:deep(.p-panel .p-panel-header-icon) {
    width: 2rem;
    height: 2rem;
}

:deep(.p-card-content) {
    padding-top: 1rem;
}
</style>