<script setup>
import { onMounted, ref, computed } from 'vue';
import { getUser } from '../../services/user';
import { getBecasById, enviarRenovacionBeca } from '../../services/becasOtorgadas';
import { getperiodosIstla } from '../../services/api_Istla';


import Card from 'primevue/card';
import Tag from 'primevue/tag';
import ProgressBar from 'primevue/progressbar';
import Divider from 'primevue/divider';
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const usuario = ref(null);
const beca = ref(null);
const periodos = ref(null);
const ultimoPeriodo = ref(null);
const visible = ref(false);
const selectedFile = ref(null);

const fetchBecaUser = async () => {
    try {
        usuario.value = await getUser();
        beca.value = await getBecasById(usuario.value.DOCUMENTO_USUARIOS);

        console.log(beca.value);
    } catch (error) {
        return null;
    }
};

const sortedBecas = computed(() => {
    return [...beca.value].sort((a, b) => {
        if (a.ID_ESTADO === 6 && b.ID_ESTADO !== 6) return 1;
        if (b.ID_ESTADO === 6 && a.ID_ESTADO !== 6) return -1;
        return 0;
    });
});

const renovacion = () => {
    visible.value = true;
};
const enviarRenovacion = async () => {
    if (selectedFile.value) {
        const cedula = usuario.value.DOCUMENTO_USUARIOS;
        try {
            await enviarRenovacionBeca(selectedFile.value, cedula);
            toast.add({
                severity: 'success',
                summary: 'Documento enviado',
                detail: 'El documento se ha enviado correctamente',
                life: 3000
            });
            setTimeout(() => {
                visible.value = false;
                fetchBecaUser();
            }, 500);
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Error al enviar',
                detail: 'Error al enviar el documento',
                life: 3000
            });
        }
    } else {
        toast.add({
            severity: 'error',
            summary: 'No ha seleccionado el documento',
            detail: 'Debe seleccionar un documento para enviar',
            life: 3000
        });
    }
};
const onSelect = (event) => {
    selectedFile.value = event.files[0];
};
const onClear = () => {
    selectedFile.value = null;
};

onMounted(() => {
    fetchBecaUser();
});

</script>

<template>
    <h2 class="text-2xl font-bold text-gray-800 mb-8" style="color: #161E2D;">
        Becas Otorgadas
    </h2>
    <div v-if="beca && beca.length > 0" class="flex flex-wrap gap-4 justify-start">
        <Card v-for="becaItem in sortedBecas" :key="becaItem.ID_BECA"
            class="transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full md:w-96">

            <template #header>
                <div class="relative">
                    <div class="absolute top-0 right-0 m-2">
                        <Tag v-if="becaItem.ID_ESTADO == 7" icon="pi pi-check" value="Activa" severity="success"
                            rounded />
                        <Tag v-if="becaItem.ID_ESTADO == 8" icon="pi pi-ban" value="Inactiva" severity="warn" rounded />
                        <Tag v-if="becaItem.ID_ESTADO == 6" icon="pi pi-times" value="Finalizada" severity="info"
                            rounded />
                    </div>
                </div>
            </template>
            <template #title>
                <div class="flex items-center gap-2 mb-2">
                    <i class="pi pi-user text-primary"></i>
                    <span class="text-xl font-semibold">{{ becaItem.CEDULA_ESTUDIANTE }}</span>
                </div>
            </template>
            <template #content>
                <div class="flex flex-col gap-3">
                    <!-- Tipo de Beca -->
                    <div class="flex items-center gap-2">
                        <i class="pi pi-bookmark text-blue-500"></i>
                        <span class="font-medium">{{ becaItem.TIPO_BECA }}</span>
                    </div>
                    <!-- Porcentaje -->
                    <div class="flex items-center gap-2">
                        <i class="pi pi-percentage text-green-500"></i>
                        <ProgressBar :value="becaItem.PORCENTAJE" :showValue="true" class="w-full" />
                    </div>
                    <Divider />
                    <!-- Periodo y Estado -->
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-calendar text-purple-500"></i>
                            <div>
                                <p class="text-sm text-gray-600">Periodo Inicio Beca:</p>
                                <p class="font-medium">{{ becaItem.NOMBRE_PERIODO }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-calendar-times text-orange-500"></i>
                            <div>
                                <p class="text-sm text-gray-600">Periodo Caducidad:</p>
                                <p class="font-medium">{{ becaItem.PERIODO_CADUCIDAD }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Message v-if="becaItem.ID_ESTADO == 8 && becaItem.RENOVACION === null" class="flex justify-center"
                    style="margin-top: 10px; cursor: pointer;" severity="error" variant="simple" @click="renovacion()">
                    SE NECESITA RENOVACION
                </Message>
            </template>
        </Card>
    </div>

    <Dialog v-model:visible="visible" modal header="Instrucciones para la renovación" :style="{ width: '50rem' }"
        :breakpoints="{ '960px': '75vw', '641px': '90vw' }" dismissableMask>
        <Toast />
        <div class="flex flex-column gap-4">
            <div class="instruction-section">
                <ul class="mt-2 mb-4">
                    <li>Debe presentar una solicitud formal al rector para la renovación de la beca.</li>
                    <li>La solicitud debe contar con la firma del rector.</li>
                    <li>El documento debe estar en formato PDF y no exceder un tamaño máximo de 2 MB.</li>
                    <li>Asegúrese de que el documento sea legible y contenga toda la información requerida.</li>
                </ul>

            </div>

            <div class="upload-section">
                <FileUpload mode="basic" :maxFileSize="2000000" accept="application/pdf" :auto="false"
                    chooseLabel="Seleccionar Documento" @select="onSelect" @clear="onClear" :showCancelButton="true"
                    :showUploadButton="false" />
                <small v-if="selectedFile" class="block mt-2 text-center">
                    Archivo seleccionado: {{ selectedFile.name }}
                </small>
            </div>
        </div>

        <template #footer>
            <Button label="Enviar" icon="pi pi-check" @click="enviarRenovacion" autofocus />
        </template>
    </Dialog>

</template>

<style scoped>
.p-fileupload {
    width: 100%;
}

.instruction-section ul {
    list-style-type: disc;
    padding-left: 1.5rem;
}

.upload-section {
    border: 2px dashed var(--surface-border);
    border-radius: 6px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
}
</style>