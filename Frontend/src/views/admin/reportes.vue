<script setup>
import { onMounted, ref, toRaw, computed } from 'vue';
import { getperiodosIstla, getCarrerasIstla } from '../../services/api_Istla';
import { getTiposBecas } from '../../services/tiposBecas';
import { postReportes, downloadReport } from '../../services/reportes';
import Swal from 'sweetalert2';

import Select from 'primevue/select';
import Button from 'primevue/button';
import MultiSelect from 'primevue/multiselect';
import ToggleSwitch from 'primevue/toggleswitch';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const periodos = ref([]);
const carreras = ref([]);
const tiposBecas = ref([]);
const pdfPath = ref(null);

const isOptionSelected = computed(() => !!selectedOptionPeriodo.value);

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
      { id: 'activa', name: 'Activas' },
      { id: 'inactiva', name: 'Inactivas' },
      { id: 'finalizado', name: 'Finalizadas' },
      { id: 'rechazada', name: 'Rechazadas' }
];
const selectedOptionEstado = ref(null);

// Incluir nombres
const nombres = ref(false);
const activarNombres = () => {
      nombres.value = !nombres.value;
};

// Filtros conteo becas
const graficosGenerales = ref(false);
const opcionesConteo = [
      { id: 'periodos', name: 'Conteo por periodos' },
      { id: 'tipoBeca', name: 'Conteo por el tipo de beca' },
      { id: 'carrera', name: 'Conteo por carrera' },
];
const selectedOptionConteo = ref(null);
const inlcuirGraficosGenerales = () => {
      graficosGenerales.value = !graficosGenerales.value;
};

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

      if (selectedOptionEstado.value !== null) {
            const estadoPlano = toRaw(selectedOptionEstado.value);
            if (estadoPlano.length === 0) {
                  data = { ...data };
            } else {
                  data = {
                        ...data,
                        estado: estadoPlano.map(estado => estado.id)
                  };
            }
      }

      if (selectedOptionConteo.value !== null) {
            const conteoPlano = toRaw(selectedOptionConteo.value);
            if (conteoPlano.length === 0) {
                  data = { ...data };
            } else {
                  data = {
                        ...data,
                        conteo: conteoPlano.map(conteo => conteo.id)
                  };
            }
      }

      if (graficosGenerales.value) {
            data = { ...data, graficosGenerales: true };
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
            if (!response) {
                  Swal.close();
                  toast.add({ severity: 'info', summary: 'Información', detail: 'No se encontraron registros', life: 3000 });
                  return;
            }

            pdfPath.value = response.pdfPath;
            if (response.length === 0) {
                  Swal.close();
                  toast.add({ severity: 'info', summary: 'Información', detail: 'No se encontraron registros', life: 3000 });
                  return;
            }
            reportData.value = response.report;
            columns.value = [
                  { field: 'CEDULA_ESTUDIANTE', header: 'Cédula' },
                  ...(reportData.value?.length > 0 && 'NOMBRE' in reportData.value[0] ?
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
            Swal.close();
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

const generarGeneral = async () => {
      if (!selectedOptionConteo.value) {
            toast.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Seleccione el conteo de becas',
                  life: 3000
            });
            return;
      }

      const conteoPlano = toRaw(selectedOptionConteo.value);
      if (conteoPlano.length === 0) {
            toast.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Seleccione el conteo de becas',
                  life: 3000
            });
            return;
      }

      let data = {
            conteo: conteoPlano.map(conteo => conteo.id),
            data: false
      };

      if (graficosGenerales.value) {
            data = { ...data, graficosGenerales: true };
      }

      try {
            Swal.fire({
                  title: "Generando reporte",
                  allowOutsideClick: false,
                  didOpen: () => {
                        Swal.showLoading();
                  }
            });

            const response = await postReportes(data);
            Swal.close();

            if (response) {
                  tabla.value = false;
                  toast.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Reporte generado con éxito',
                        life: 3000
                  });
                  await download(response);
            } else {
                  toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al generar el reporte',
                        life: 3000
                  });
            }
      } catch (error) {
            Swal.close();
            toast.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error al generar reporte',
                  life: 3000
            });
      }
};

const downloadEspecificos = async () => {
      await download(pdfPath.value);
};

const download = async (path) => {
      try {
            const response = await downloadReport(path);
      } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al descargar el reporte', life: 3000 });
      }
};

const clearFilters = () => {
      selectedOptionPeriodo.value = null;
      selectedPeriod.value = null;
      startPeriod.value = null;
      endPeriod.value = null;
      selectedCarreras.value = null;
      selectedTipoBeca.value = null;
      nombres.value = false;
      selectedOptionEstado.value = null;
      tabla.value = false;
};

const clearFiltersGenerales = () => {
      selectedOptionConteo.value = null;
      tabla.value = false;
      graficosGenerales.value = false;
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

      <div class="card">
            <Accordion :value="['0']" multiple>
                  <AccordionPanel value="0">
                        <AccordionHeader>Generales</AccordionHeader>
                        <AccordionContent>
                              <div class="space-y-6">
                                    <div class="flex flex-row flex-wrap gap-4 items-center">
                                          <MultiSelect v-model="selectedOptionConteo" :options="opcionesConteo"
                                                optionLabel="name" filter placeholder="Conteo de becas"
                                                :maxSelectedLabels="2" selectedItemsLabel="{0} conteo de becas"
                                                class="w-full md:w-96" />
                                          <div @click="inlcuirGraficosGenerales"
                                                class="group flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition-all duration-200 max-w-md">
                                                <div class="flex-1">
                                                      <label class="text-gray-700 font-medium text-sm tracking-wide cursor-pointer"
                                                            style="margin-right: 15px;">
                                                            Incluir graficos
                                                      </label>
                                                </div>
                                                <div class="relative inline-flex items-center ">
                                                      <ToggleSwitch v-model="graficosGenerales"
                                                            @click="inlcuirGraficosGenerales" />
                                                </div>
                                          </div>

                                          <Button icon="pi pi-eraser" label="Limpiar Filtros"
                                                @click="clearFiltersGenerales" raised severity="secondary"
                                                class="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200" />

                                          <Button v-if="!isOptionSelected" icon="pi pi-file-pdf" label="Generar PDF"
                                                @click="generarGeneral" raised severity="secondary"
                                                class="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                                                v-tooltip.right="'Se generar el reporte de la informacion mostrada en el Home'" />


                                    </div>
                              </div>

                        </AccordionContent>
                  </AccordionPanel>
                  <AccordionPanel value="1">
                        <AccordionHeader>Filtros especificos</AccordionHeader>
                        <AccordionContent>
                              <div class="space-y-6">
                                    <div class="flex flex-row flex-wrap gap-4 items-center">
                                          <Select v-model="selectedOptionPeriodo" :options="opcionesPeriodos"
                                                optionLabel="name" placeholder="Seleccione el periodo"
                                                class="w-full md:w-72" @change="handleOptionChangePeriodo" />

                                          <template v-if="selectedOptionPeriodo">
                                                <Select v-if="selectedOptionPeriodo.id === 'uno'"
                                                      v-model="selectedPeriod" :options="periodos"
                                                      optionLabel="NOMBRE_PERIODO" placeholder="Seleccione el periodo"
                                                      class="w-full md:w-72" />

                                                <template v-if="selectedOptionPeriodo.id === 'entre'">
                                                      <Select v-model="startPeriod" :options="periodos"
                                                            optionLabel="NOMBRE_PERIODO" placeholder="Periodo inicial"
                                                            class="w-full md:w-72" />
                                                      <Select v-model="endPeriod" :options="periodos"
                                                            optionLabel="NOMBRE_PERIODO" placeholder="Periodo final"
                                                            class="w-full md:w-72" />
                                                </template>
                                          </template>

                                          <MultiSelect v-model="selectedOptionEstado" :options="opcionesEstado"
                                                optionLabel="name" filter placeholder="Seleccione estado"
                                                :maxSelectedLabels="2" selectedItemsLabel="{0} estados seleccionados"
                                                class="w-full md:w-96" />

                                          <MultiSelect v-model="selectedCarreras" :options="carreras"
                                                optionLabel="NOMBRE_CARRERAS" filter placeholder="Seleccione la carrera"
                                                :maxSelectedLabels="2" selectedItemsLabel="{0} carreras seleccionadas"
                                                class="w-full md:w-96" />

                                          <MultiSelect v-model="selectedTipoBeca" :options="tiposBecas"
                                                optionLabel="TIPO_BECA" filter placeholder="Seleccione la tipo de beca"
                                                :maxSelectedLabels="2"
                                                selectedItemsLabel="{0} tipo de becas seleccionadas"
                                                class="w-full md:w-96" />

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

                                          <Button icon="pi pi-eraser" label="Limpiar Filtros" @click="clearFilters"
                                                raised severity="secondary"
                                                class="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200" />

                                          <Button icon="pi pi-table" label="Previsualizar" @click="reportes" raised
                                                severity="secondary"
                                                class="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200" />

                                          <Button v-if="tabla" icon="pi pi-file-pdf" label="Generar PDF"
                                                @click="downloadEspecificos" raised severity="secondary"
                                                class="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200" />

                                    </div>
                              </div>
                        </AccordionContent>
                  </AccordionPanel>
            </Accordion>
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