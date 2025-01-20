<script setup>
import { computed, onMounted, ref, toRaw } from 'vue';
import { getperiodosIstla, getCarrerasIstla } from '../../services/api_Istla';
import { getTiposBecas } from '../../services/tiposBecas';
import { postReportes } from '../../services/reportes';
import Swal from 'sweetalert2';

import Select from 'primevue/select';
import Button from 'primevue/button';
import MultiSelect from 'primevue/multiselect';
import ToggleSwitch from 'primevue/toggleswitch';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const periodos = ref([]);
const carreras = ref([]);
const tiposBecas = ref([]);

const nombres = ref(false);

const fechtPeriodos = async () => {
      periodos.value = await getperiodosIstla();
};

const fechtCarreras = async () => {
      const response = await getCarrerasIstla();
      carreras.value = response.data.map((carrera) => {
            return {
                  ID_CARRERAS: carrera.ID_CARRERAS,
                  NOMBRE_CARRERAS: carrera.NOMBRE_CARRERAS
            };
      });
};

const fechtTiposBecas = async () => {
      tiposBecas.value = await getTiposBecas();
};

// Filtros Periodos
const opcionesPeriodos = [
      { id: 'todos', name: 'Todos los periodos' },
      { id: 'uno', name: 'Un solo periodo' },
      { id: 'entre', name: 'Entre periodos' }
];
const selectedOptionPeriodo = ref(null);
const selectedPeriod = ref(null);
const startPeriod = ref(null);
const endPeriod = ref(null);
const handleOptionChangePeriodo = () => {
      selectedPeriod.value = null;
      startPeriod.value = null;
      endPeriod.value = null;
};

// Filtros Carreras
const selectedCarreras = ref(null);

// Filtros tipo de beca
const selectedTipoBeca = ref(null);

// Filtro estados
const opcionesEstado = [
      { id: 'todas', name: 'Todas' },
      { id: 'activa', name: 'Activas' },
      { id: 'inactiva', name: 'Inactivas' },
];
const selectedOptionEstado = ref(null);
const penultimoPeriodo = computed(() => {
      if (periodos.value && periodos.value.length >= 2) {
            return periodos.value[1];
      }
      return null;
});
const mostrarSelectEstado = computed(() => {
      selectedOptionEstado.value = null;
      if (!penultimoPeriodo.value) return false;

      if (selectedOptionPeriodo.value?.id === 'uno') {
            return selectedPeriod.value?.ID_PERIODO === penultimoPeriodo.value.ID_PERIODO;
      }

      if (selectedOptionPeriodo.value?.id === 'entre') {
            return startPeriod.value?.ID_PERIODO === penultimoPeriodo.value.ID_PERIODO;
      }

      return false;
});

// Reportes
const reportes = async () => {
      if (!selectedOptionPeriodo.value) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Seleccione el periodo', life: 3000 });
            return;
      }

      let data = {};
      switch (selectedOptionPeriodo.value.id) {
            case 'todos':
                  data = { idPeriodo: null, idPeriodoFinal: null, todos: true };
                  break;
            case 'uno':
                  if (!selectedPeriod.value) {
                        toast.add({ severity: 'error', summary: 'Error', detail: 'Seleccione un periodo', life: 2000 });
                        return;
                  }
                  data = { idPeriodo: selectedPeriod.value.ID_PERIODO, idPeriodoFinal: null, todos: false };
                  const estadoPlano = toRaw(selectedOptionEstado.value);

                  if (estadoPlano) {
                        data = { ...data, estado: estadoPlano.name };
                  }
                  break;
            case 'entre':
                  if (!startPeriod.value || !endPeriod.value) {
                        toast.add({ severity: 'error', summary: 'Error', detail: 'Seleccione los periodos', life: 2000 });
                        return;
                  }
                  if (startPeriod.value === endPeriod.value) {
                        toast.add({ severity: 'error', summary: 'Error', detail: 'Los periodos no pueden ser el mismo', life: 2000 });
                        return;
                  }
                  if (Number(startPeriod.value.ID_PERIODO) >= Number(endPeriod.value.ID_PERIODO)) {
                        toast.add({ severity: 'error', summary: 'Error', detail: 'El orden de los periodos es incorrecto', life: 3000 });
                        return;
                  }
                  data = {
                        idPeriodo: startPeriod.value.ID_PERIODO,
                        idPeriodoFinal: endPeriod.value.ID_PERIODO,
                        todos: false
                  };

                  const estadoPlano2 = toRaw(selectedOptionEstado.value);

                  if (estadoPlano2) {
                        data = { ...data, estado: estadoPlano2.name };
                  }
                  break;
      }

      if (selectedCarreras._value !== null) {
            if (selectedCarreras._value.length === 0) {
                  data = { ...data };
            } else {
                  data = { ...data, carreras: selectedCarreras._value.map((carrera) => carrera.ID_CARRERAS) };
            }
      }

      if (selectedTipoBeca.value !== null) {
            const becasPlanas = toRaw(selectedTipoBeca.value);
            if (becasPlanas.length === 0) {
                  data = { ...data };
            } else {
                  data = {
                        ...data,
                        tiposBecas: becasPlanas.map(beca => beca.TIPO_BECA)
                  };
            }
      }

      if (nombres.value) {
            data = { ...data, nombres: true };
      }

      try {
            tabla.value = false;
            Swal.fire({
                  title: "Generando previsualizacion del reporte",
                  allowOutsideClick: false,
                  didOpen: () => {
                        Swal.showLoading();
                  }
            });
            const response = await postReportes(data);
            reportData.value = response;
            columns.value = [
                  { field: 'CEDULA_ESTUDIANTE', header: 'Cédula' },
                  ...(response.length > 0 && 'NOMBRE' in response[0] ?
                        [{ field: 'NOMBRE', header: 'Nombre' }] :
                        []),
                  { field: 'TIPO_BECA', header: 'Tipo de Beca' },
                  { field: 'PORCENTAJE', header: 'Porcentaje' },
                  { field: 'PERIODO', header: 'Periodo' },
                  { field: 'ESTADO', header: 'Estado' },
                  { field: 'CARRERA', header: 'Carrera' }
            ];
            tabla.value = true;
            Swal.close();
      } catch (error) {
            console.log(error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al generar reporte', life: 3000 });
      }
};
const reportData = ref([]);
const columns = ref([
      { field: 'CEDULA_ESTUDIANTE', header: 'Cédula' },
      ...(reportData.value.length > 0 && 'NOMBRE' in reportData.value[0] ?
            [{ field: 'NOMBRE', header: 'Nombre' }] :
            []),
      { field: 'TIPO_BECA', header: 'Tipo de Beca' },
      { field: 'PORCENTAJE', header: 'Porcentaje' },
      { field: 'PERIODO', header: 'Periodo' },
      { field: 'ESTADO', header: 'Estado' },
      { field: 'CARRERA', header: 'Carrera' }
]);
const filters = ref({});
const tabla = ref(false);

const clearFilters = () => {
      selectedOptionPeriodo.value = null;
      selectedPeriod.value = null;
      startPeriod.value = null;
      endPeriod.value = null;
      selectedCarreras.value = null;
      selectedTipoBeca.value = null;
      nombres.value = false;
      selectedOptionEstado.value = null;
};

const activarNombres = () => {
      nombres.value = !nombres.value;
};

onMounted(async () => {
      fechtPeriodos();
      fechtCarreras();
      fechtTiposBecas();
});

</script>

<template>
      <h2 class="text-2xl font-bold text-gray-800 mb-8" style="color: #161E2D;">
            Reportes
      </h2>
      <Toast />
      <div class="space-y-6">
            <div class="flex flex-row flex-wrap gap-4 items-center">
                  <Select v-model="selectedOptionPeriodo" :options="opcionesPeriodos" optionLabel="name"
                        placeholder="Seleccione el periodo" class="w-full md:w-72"
                        @change="handleOptionChangePeriodo" />

                  <template v-if="selectedOptionPeriodo">
                        <Select v-if="selectedOptionPeriodo.id === 'uno'" v-model="selectedPeriod" :options="periodos"
                              optionLabel="NOMBRE_PERIODO" placeholder="Seleccione el periodo" class="w-full md:w-72" />

                        <template v-if="selectedOptionPeriodo.id === 'entre'">
                              <Select v-model="startPeriod" :options="periodos" optionLabel="NOMBRE_PERIODO"
                                    placeholder="Periodo inicial" class="w-full md:w-72" />
                              <Select v-model="endPeriod" :options="periodos" optionLabel="NOMBRE_PERIODO"
                                    placeholder="Periodo final" class="w-full md:w-72" />
                        </template>
                  </template>

                  <Select v-if="mostrarSelectEstado" v-model="selectedOptionEstado" :options="opcionesEstado"
                        optionLabel="name" placeholder="Seleccione el estado" class="w-full md:w-72" />


                  <MultiSelect v-model="selectedCarreras" :options="carreras" optionLabel="NOMBRE_CARRERAS" filter
                        placeholder="Seleccione la carrera" :maxSelectedLabels="2"
                        selectedItemsLabel="{0} carreras seleccionadas" class="w-full md:w-96" />

                  <MultiSelect v-model="selectedTipoBeca" :options="tiposBecas" optionLabel="TIPO_BECA" filter
                        placeholder="Seleccione la tipo de beca" :maxSelectedLabels="2"
                        selectedItemsLabel="{0} tipo de becas seleccionadas" class="w-full md:w-96" />

                  <div @click="activarNombres"
                        class="group flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition-all duration-200 max-w-md">
                        <div class="flex-1">
                              <label class="text-gray-700 font-medium text-sm tracking-wide cursor-pointer"
                                    style="margin-right: 15px;">
                                    Incluir nombres del estudiante
                              </label>
                        </div>
                        <div class="relative inline-flex items-center ">
                              <ToggleSwitch v-model="nombres" @click="activarNombres" />
                        </div>
                  </div>

                  <Button icon="pi pi-eraser" label="Limpiar Filtros" @click="clearFilters" raised severity="secondary"
                        class="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200" />

                  <Button icon="pi pi-table" label="Previsualizar" @click="reportes" raised severity="secondary"
                        class="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200" />

                  <Button v-if="tabla" icon="pi pi-file-pdf" label="Generar" raised severity="secondary"
                        class="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200" />

            </div>
      </div>

      <div class="card mt-4 rounded-lg shadow-sm">
            <DataTable v-if="tabla" :value="reportData" :paginator="true" :rows="10"
                  :rowsPerPageOptions="[5, 10, 20, 50]" responsiveLayout="scroll" class="p-datatable-sm"
                  :filters="filters" filterDisplay="menu" showGridlines stripedRows>
                  <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" sortable
                        :filter="true" filterMatchMode="contains">
                        <template #body="slotProps" v-if="col.field === 'PORCENTAJE'">
                              {{ slotProps.data[col.field] }}%
                        </template>
                  </Column>
            </DataTable>
      </div>


</template>

<style scoped></style>