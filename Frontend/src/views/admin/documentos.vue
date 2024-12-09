<script setup>
import {
  ref, onMounted, watch
} from 'vue';
import { getDocumentos } from '../../services/documentacionBeca';

import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

const globalFilter = ref('');
const documentos = ref([]);
const selectedDocument = ref(null);
const displayModal = ref(false);
const selectDocumentDetail = ref(null);
const selectedCertificado = ref(null);
const filters = ref({
  global: { value: null, matchMode: 'contains' },
  'istla_solicitudes_beca.CEDULA_ESTUDIANTE': {
    value: null,
    matchMode: 'contains'
  },
  'istla_solicitudes_beca.istla_tipo_beca.TIPO_BECA': {
    value: null,
    matchMode: 'contains'
  },
  'istla_estado_solicitud.ESTADO': {
    value: null,
    matchMode: 'contains'
  }
});

watch(globalFilter, (newValue) => {
  filters.value.global.value = newValue;
});

const clearFilters = () => {
  globalFilter.value = '';
};

const refreshData = async () => {
  await fetchDocumentos();
};

const fetchDocumentos = async () => {
  try {
    const response = await getDocumentos();

    console.log(response);
    documentos.value = response.map(doc => {
      const updatedDoc = { ...doc };
      const fieldsToConvert = [
        'CERTIFICADO_MATRICULA',
        'COPIA_CEDULA',
        'CERTIFICADO_ASISTENCIA',
        'CERTIFICADO_PAGOS',
        'CERTIFICADO_DISCIPLINA'
      ];
      fieldsToConvert.forEach(field => {
        if (updatedDoc[field]) {
          updatedDoc[field] = updatedDoc[field].replace(/\\/g, '/');
        }
      });
      return updatedDoc;
    });
  } catch (error) {
    console.error(error);
  }
};

const getEstadoIcon = (estado) => {
  const iconMap = {
    'Pendiente': 'pi pi-spin pi-spinner',
    'Revision': 'pi pi-eye',
    'Aprobada': 'pi pi-verified',
  };
  return iconMap[estado] || iconMap['default'];
};

const getEstadoSeverity = (estado) => {
  const severityMap = {
    'Pendiente': 'warn',
    'Revision': 'info',
    'Aprobada': 'success',
  };
  return severityMap[estado] || severityMap['default'];
};

const openPdfModal = (pdfUrl) => {
  selectedDocument.value = pdfUrl;
  displayModal.value = true;
};

const getDocumentOptions = (documentDetails) => {
  if (!documentDetails || documentDetails.length === 0) return [];

  return Object.keys(documentDetails[0]).map((key) => ({
    label: key.replace('CERTIFICADO_', 'Certificado ').replace('_', ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    value: documentDetails[0][key]
  }));
};

const getCertificadosOptions = (data) => {
  const certificados = [
    { key: 'CERTIFICADO_MATRICULA', label: 'Certificado Matrícula' },
    { key: 'COPIA_CEDULA', label: 'Copia Cédula' },
    { key: 'CERTIFICADO_ASISTENCIA', label: 'Certificado Asistencia' },
    { key: 'CERTIFICADO_PAGOS', label: 'Certificado Pagos' },
    { key: 'CERTIFICADO_DISCIPLINA', label: 'Certificado Disciplina' }
  ];

  return certificados
    .filter(cert => data[cert.key])
    .map(cert => ({
      label: cert.label,
      value: data[cert.key]
    }));
};

onMounted(() => {
  fetchDocumentos();
});

</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Documentos de Becas</h2>
    <div class="flex items-center gap-4 mb-4">
      <InputText v-model="globalFilter" placeholder="Buscar..." class="w-1/4" />

      <Button icon="pi pi-eraser" label="Limpiar Filtros" @click="clearFilters" severity="secondary" />
      <Button icon="pi pi-refresh" label="Refrescar" @click="refreshData" severity="secondary" />

    </div>
    <DataTable :value="documentos" :filters="filters" :globalFilterFields="[
      'istla_solicitudes_beca.CEDULA_ESTUDIANTE',
      'istla_solicitudes_beca.istla_tipo_beca.TIPO_BECA',
      'istla_estado_solicitud.ESTADO'
    ]" :paginator="true" :rows="5" :rowsPerPageOptions="[5, 10, 20]" :emptyMessage="'No hay datos disponibles'"
      responsiveLayout="scroll" class="text-center">

      <Column field="istla_solicitudes_beca.CEDULA_ESTUDIANTE" header="Cédula Estudiante" sortable
        class="text-center" />

      <Column field="istla_solicitudes_beca.istla_tipo_beca.TIPO_BECA" header="Tipo de Beca" sortable
        class="text-center" />

      <Column header="Estado" sortable class="text-center">
        <template #body="slotProps">
          <div class="flex justify-center">
            <Tag :icon="getEstadoIcon(slotProps.data.istla_estado_solicitud.ESTADO)"
              :value="slotProps.data.istla_estado_solicitud.ESTADO"
              :severity="getEstadoSeverity(slotProps.data.istla_estado_solicitud.ESTADO)" />
          </div>
        </template>
      </Column>

      <Column header="Cerificados" class="text-center">
        <template #body="{ data }">
          <div class="flex justify-center items-center gap-2">
            <Select v-if="getCertificadosOptions(data).length > 0" v-model="selectedCertificado"
              :options="getCertificadosOptions(data)" optionLabel="label" optionValue="value"
              placeholder="Seleccionar documento" class="w-full md:w-56" @change="openPdfModal(selectedCertificado)" />
            <span v-else class="flex justify-center">
              <Tag severity="secondary" value="En espera" icon="pi pi-hourglass"></Tag>
            </span>
          </div>
        </template>
      </Column>

      <Column header="Documentos Específicos" class="text-center">
        <template #body="{ data }">
          <div class="flex justify-center items-center gap-2">
            <Select v-if="data.istla_estado_solicitud.ESTADO != 'Pendiente'" v-model="selectDocumentDetail"
              :options="getDocumentOptions(data.istla_documentos_detalle)" optionLabel="label" optionValue="value"
              placeholder="Seleccionar documento" class="w-full md:w-56" @change="openPdfModal(selectDocumentDetail)" />
            <span v-if="data.istla_estado_solicitud.ESTADO === 'Pendiente'">
              <Tag severity="secondary" value="En espera" icon="pi pi-hourglass"></Tag>
            </span>
          </div>
        </template>
      </Column>

      <Column header="Acciones">
        <template #body="slotProps">
          <div>
            <Button @click="aceptarSolicitud(slotProps.data.ID_SOLICITUD)" unstyled class="zoom-button"
              :class="{ 'opacity-50 cursor-not-allowed': slotProps.data.ESTADO === 'Aprobada' }"
              :disabled="slotProps.data.ESTADO === 'Aprobada'" style="margin-bottom: 0.5rem;">
              <Tag icon="pi pi-check" severity="success" value="Aprobar"></Tag>
            </Button>
            <Button @click="rechazoSolicitud(slotProps.data.ID_SOLICITUD)" unstyled class="zoom-button">
              <Tag icon="pi pi-times" severity="danger" value="Rechazar"></Tag>
            </Button>
          </div>
        </template>
      </Column>

    </DataTable>

    <!-- Modal para mostrar el PDF -->
    <Dialog header="Solicitud" v-model:visible="displayModal" style="width: 80vw" pt:mask:class="backdrop-blur-sm">
      <embed v-if="selectedDocument" :src="selectedDocument" type="application/pdf" width="100%" height="500px" />
    </Dialog>

  </div>
</template>

<style scoped>
.p-dialog-content {
  height: 70vh;
}


.zoom-button {
  display: inline-block;
  transition: transform 0.2s ease-in-out;
}

.zoom-button:hover {
  transform: scale(1.1);
}
</style>