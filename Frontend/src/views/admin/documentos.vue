<script setup>
import {
  ref, onMounted, watch
} from 'vue';
import Swal from 'sweetalert2';
import {
  getDocumentos, postAprobarDocumentacion,
  putDocumentacionReenvio, deleteRechazarDocumentacion
} from '../../services/documentacionBeca';
import {
  getperiodosIstla
} from '../../services/api_Istla';


import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const globalFilter = ref('');
const documentos = ref([]);
const allDocumentos = ref([]);
const periodos = ref([]);
const periodoSeleccionado = ref(null);
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
  periodoSeleccionado.value = null;
  refreshData();
};

const refreshData = async () => {
  await fetchDocumentos();
};

const fetchPeriodos = async () => {
  try {
    periodos.value = await getperiodosIstla();
  } catch (error) {
    throw new Error('Error al obtener los documentos:', error);
  }
};

const fetchDocumentos = async () => {
  try {
    const response = await getDocumentos();
    if (response.noHay === true) {
      toast.add({ severity: 'info', summary: 'Informacion', detail: 'No hay documentacion', life: 2000 });
      return;
    }
    const processedDocs = response.map(doc => {
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

    allDocumentos.value = processedDocs;
    documentos.value = processedDocs.sort((a, b) => {
      const estadoA = a.istla_estado_solicitud.ESTADO;
      const estadoB = b.istla_estado_solicitud.ESTADO;
      if (estadoA === 'Pendiente') return -1;
      if (estadoB === 'Pendiente') return 1;
      return 0;
    });

    if (periodoSeleccionado.value) {
      documentos.value = documentos.value.filter(doc =>
        doc.istla_solicitudes_beca?.istla_vigencia_beca?.ID_PERIODO === parseInt(periodoSeleccionado.value.ID_PERIODO)
      );
    }
  } catch (error) {
    throw new Error('Error al obtener los documentos:', error);
  }
};

const getEstadoIcon = (estado) => {
  const iconMap = {
    'Pendiente': 'pi pi-spin pi-spinner',
    'Revision': 'pi pi-eye',
    'Aprobada': 'pi pi-verified',
    'Rechazada': 'pi pi-times',
  };
  return iconMap[estado] || iconMap['default'];
};

const getEstadoSeverity = (estado) => {
  const severityMap = {
    'Pendiente': 'warn',
    'Revision': 'info',
    'Aprobada': 'success',
    'Rechazada': 'danger',
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

const aceptarDocumentacion = async (id) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Se aprobará la documentación del estudiante y se creará la beca solicitada.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const rangeResult = await Swal.fire({
          title: 'Selecciona el porcentaje de beca',
          input: 'range',
          inputAttributes: {
            min: 0,
            max: 100,
            step: 1,
          },
          inputValue: 50,
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
        });

        if (rangeResult.isConfirmed) {
          const porcentaje = rangeResult.value;

          await postAprobarDocumentacion(id, porcentaje);

          await Swal.fire({
            title: 'Beca creada',
            text: `Se asigno la beca del ${porcentaje}%. Se emitirá el correo al estudiante.`,
            icon: 'success',
          });

          refreshData();
        }
      } catch (error) {
        throw new Error('Error al aprobar la documentación:', error);
      }
    }
  });


};

const rechazarDocumentacion = async (id) => {
  Swal.fire({
    title: 'Rechazar solicitud de beca',
    html: `
      <p>Elige qué acción deseas realizar con esta documentación:</p>
      <br>
      <strong>Actualizar documentos:</strong> El estudiante podrá volver a subir y enviar sus documentos.
      <br>
      <strong>Rechazar solicitud:</strong> La solicitud de beca será rechazada completamente.
    `,
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Actualizar documentos',
    denyButtonText: 'Rechazar solicitud',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    denyButtonColor: '#d33',
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { value: motivo } = await Swal.fire({
        title: 'Motivo de actualización',
        input: 'textarea',
        inputLabel: 'Por favor, ingrese el motivo para la actualización de documentos',
        inputPlaceholder: 'Escriba aquí el motivo...',
        inputAttributes: {
          'aria-label': 'Motivo de actualización'
        },
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Necesitas escribir un motivo'
          }
        }
      });
      if (motivo) {
        try {
          await putDocumentacionReenvio(id, motivo);
          Swal.fire({
            title: 'Documentos listos para reenvío',
            text: 'Se ha habilitado nuevamente la carga de documentos para el estudiante',
            icon: 'success'
          }).then(() => {
            refreshData();
          });
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo habilitar el reenvío de documentos',
            icon: 'error'
          });
        }
      }
    } else if (result.isDenied) {
      const { value: motivo } = await Swal.fire({
        title: 'Motivo de rechazo',
        input: 'textarea',
        inputLabel: 'Por favor, ingrese el motivo de rechazo de la beca',
        inputPlaceholder: 'Escriba aquí el motivo...',
        inputAttributes: {
          'aria-label': 'Motivo de rachazo'
        },
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Necesitas escribir un motivo'
          }
        }
      });
      if (motivo) {
        try {
          await deleteRechazarDocumentacion(id, motivo);
          Swal.fire({
            title: 'Solicitud rechazada',
            text: 'La solicitud de beca ha sido rechazada completamente',
            icon: 'success'
          }).then(() => {
            refreshData();
          });
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo rechazar la solicitud',
            icon: 'error'
          });
        }
      }
    }
  });
};

watch(periodoSeleccionado, (newValue) => {
  if (!newValue) {
    documentos.value = [...allDocumentos.value].sort((a, b) => {
      const estadoA = a.istla_estado_solicitud.ESTADO;
      const estadoB = b.istla_estado_solicitud.ESTADO;
      if (estadoA === 'Pendiente') return -1;
      if (estadoB === 'Pendiente') return 1;
      return 0;
    });
  } else {
    documentos.value = [...allDocumentos.value]
      .filter(doc =>
        doc.istla_solicitudes_beca?.istla_vigencia_beca?.ID_PERIODO === parseInt(newValue.ID_PERIODO)
      )
      .sort((a, b) => {
        const estadoA = a.istla_estado_solicitud.ESTADO;
        const estadoB = b.istla_estado_solicitud.ESTADO;
        if (estadoA === 'Pendiente') return -1;
        if (estadoB === 'Pendiente') return 1;
        return 0;
      });
  }
});


onMounted(() => {
  fetchDocumentos();
  fetchPeriodos();
});

</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-8" style="color: #161E2D;">
      Documentos de Becas
    </h2>
    <div class="flex items-center gap-4 mb-4" style="margin-bottom: 25px;">
      <InputText v-model="globalFilter" placeholder="Buscar..." class="w-1/4" />
      <Select v-model="periodoSeleccionado" :options="periodos" optionLabel="NOMBRE_PERIODO"
        placeholder="Selecciona un período" class="w-full md:w-56" />

      <Button icon="pi pi-eraser" label="Limpiar Filtros" @click="clearFilters" severity="secondary" raised />
      <Button icon="pi pi-refresh" label="Refrescar" @click="refreshData" severity="secondary" raised />
    </div>

    <div class="rounded-lg overflow-hidden shadow-lg">
      <Toast />
      <DataTable :value="documentos" :filters="filters" :globalFilterFields="[
        'istla_solicitudes_beca.CEDULA_ESTUDIANTE',
        'istla_solicitudes_beca.istla_tipo_beca.TIPO_BECA',
        'istla_estado_solicitud.ESTADO'
      ]" :paginator="true" :rows="5" :rowsPerPageOptions="[5, 10, 20]" :emptyMessage="'No hay datos disponibles'"
        responsiveLayout="scroll" class="text-center" sortField="istla_estado_solicitud.ESTADO" :sortOrder="-1">

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

        <Column header="Certificados" class="text-center" :style="{ width: '130px' }">
          <template #body="{ data }">
            <div class="flex justify-center items-center gap-2">
              <Select v-if="data.istla_estado_solicitud.ESTADO != 'Pendiente'" v-model="selectedCertificado"
                :options="getCertificadosOptions(data)" optionLabel="label" optionValue="value"
                placeholder="Seleccionar documento" class="w-full md:w-56"
                @change="openPdfModal(selectedCertificado)" />
              <span v-if="data.istla_estado_solicitud.ESTADO === 'Pendiente'">
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
                placeholder="Seleccionar documento" class="w-full md:w-56"
                @change="openPdfModal(selectDocumentDetail)" />
              <span v-if="data.istla_estado_solicitud.ESTADO === 'Pendiente'">
                <Tag severity="secondary" value="En espera" icon="pi pi-hourglass"></Tag>
              </span>
            </div>
          </template>
        </Column>

        <Column header="Acciones">
          <template #body="slotProps">
            <div>
              <Button @click="aceptarDocumentacion(slotProps.data.ID_DOCUMENTOS)" unstyled class="zoom-button"
                :class="{ 'opacity-50 cursor-not-allowed': slotProps.data.istla_estado_solicitud.ESTADO === 'Aprobada' || slotProps.data.istla_estado_solicitud.ESTADO === 'Pendiente' || slotProps.data.istla_estado_solicitud.ESTADO === 'Rechazada' }"
                :disabled="slotProps.data.istla_estado_solicitud.ESTADO === 'Aprobada' || slotProps.data.istla_estado_solicitud.ESTADO === 'Pendiente' || slotProps.data.istla_estado_solicitud.ESTADO === 'Rechazada'"
                style="margin-bottom: 0.5rem;">
                <Tag icon="pi pi-check" severity="success" value="Aprobar"></Tag>
              </Button>
              <Button @click="rechazarDocumentacion(slotProps.data.ID_DOCUMENTOS)" unstyled class="zoom-button"
                :class="{ 'opacity-50 cursor-not-allowed': slotProps.data.istla_estado_solicitud.ESTADO === 'Aprobada' || slotProps.data.istla_estado_solicitud.ESTADO === 'Rechazada' }"
                :disabled="slotProps.data.istla_estado_solicitud.ESTADO === 'Aprobada' || slotProps.data.istla_estado_solicitud.ESTADO === 'Rechazada'"
                style="margin-bottom: 0.5rem;">
                <Tag icon="pi pi-times" severity="danger" value="Rechazar"></Tag>
              </Button>
            </div>
          </template>
        </Column>

      </DataTable>
    </div>

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