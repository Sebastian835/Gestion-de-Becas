<script setup>
import { ref, computed, onMounted } from 'vue';
import { initFlowbite } from 'flowbite'
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { getUser } from '../../services/user';
import { buscarDocumentos, guardarDocumentos } from '../../services/documentacionBeca';

const router = useRouter();

const selectedBeca = ref(null);
const isReadonly = ref(false);
const tipoBecaSeleccionado = ref(null);
const documentoSeleccionadoOpcional = ref(null);
const mostrarInputDocumentoOpcional = ref(false);
const datosSolicitud = ref(null);

const fetchCurrentUser = async () => {
    try {
        const user = await getUser();
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
};

const documentosPendientes = async () => {
    const user = await fetchCurrentUser();
    const existeSolicitud = await buscarDocumentos(user.DOCUMENTO_USUARIOS)
    if (existeSolicitud.existeSolicitud === false) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Usted no cuenta con una solicitud activa.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            router.push('/main/requisitos');
        });
    } else if (existeSolicitud.existeDocumentacion === false) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Usted no tiene procesos de documentación pendientes.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            router.push('/main/requisitos');
        });
    } else {
        const tipoBecaSolicitud = tiposBeca.find(beca => beca.nombre === existeSolicitud.tipo_beca);
        if (tipoBecaSolicitud) {
            datosSolicitud.value = existeSolicitud;
            selectedBeca.value = tipoBecaSolicitud.id;
            isReadonly.value = true;
            tipoBecaSeleccionado.value = tipoBecaSolicitud.id;
        }
    }
};

const tiposBeca = [
    { id: 1, nombre: 'Beca por distinción académica' },
    { id: 2, nombre: 'Beca a deportistas de alto rendimiento' },
    { id: 3, nombre: 'Beca a heroes o heroinas nacionales' },
    { id: 4, nombre: 'Beca por pertenecer a club deportivo del ITSLA' },
    { id: 5, nombre: 'Beca por pertenecer a club cultural, artistico o academico del ITSLA' },
    { id: 6, nombre: 'Beca a estudiantes con discapacidad' },
    { id: 7, nombre: 'Beca a estudiantes con limitaciones socioeconomicas' },
];

const documentosGenerales = [
    { nombre: 'Certificado de Matrícula', campo: 'CERTIFICADO_MATRICULA' },
    { nombre: 'Copia de Cédula', campo: 'COPIA_CEDULA' },
    { nombre: 'Certificado de Asistencia', campo: 'CERTIFICADO_ASISTENCIA' },
    { nombre: 'Certificado de Pagos', campo: 'CERTIFICADO_PAGOS' },
    { nombre: 'Certificado de Disciplina', campo: 'CERTIFICADO_DISCIPLINA' },
    { nombre: 'Certificado de Aprobación de Semestre', campo: 'CERTIFICADO_APROBACION_SEMESTRE' },
    { nombre: 'Certificado de Notas', campo: 'CERTIFICADO_NOTA' }
];

const documentosObligatoriosSituacionesCalamitosas = [
    { nombre: 'Ficha Socioeconómica', campo: 'FICHA_SOCIOECONOMICA' },
    { nombre: 'Mecanizado IESS', campo: 'MECANIZADO_IESS' },
    { nombre: 'Certificado IESS', campo: 'CERTIFICADO_IESS' },
    { nombre: 'Declaración de Impuestos', campo: 'DECLARACION_IMPUESTOS' }
];

const documentosOpcionalesSituacionesCalamitosas = [
    { nombre: 'Declaratoria Zona de Emergencia', campo: 'DECLARATORIA_ZONA_EMERGENCIA' },
    { nombre: 'Partida de Defunción', campo: 'PARTIDA_DEFUNCION' },
    { nombre: 'Certificado Médico Dependencia', campo: 'CERTIFICADO_MEDICO_DEPENDENCIA' },
    { nombre: 'Informe Policial', campo: 'INFORME_POLICIAL' },
    { nombre: 'Certificado Médico Personal', campo: 'CERTIFICADO_MEDICO_PERSONAL' },
    { nombre: 'Otro Documento', campo: 'OTRO_DOCUMENTO' }
];

const documentosPorBeca = {
    1: [ // Con Alto Promedio
    ],
    2: [ // Deportistas de Alto Rendimiento
        { nombre: 'Trayectoria Deportiva', campo: 'TRAYECTORIA_DEPORTIVA' },
        { nombre: 'Informe Federación Deportiva', campo: 'INFORME_FEDERACIONDEPORTIVA' }
    ],
    3: [ // Héroes y Heroínas Nacionales
        { nombre: 'Reconocimiento Héroe', campo: 'RECONOCIMIENTO_HEROE' }
    ],
    4: [ // Club Deportivo
        { nombre: 'Informe Actividades Club', campo: 'INFORME_ACTIVIDADES_CLUB' }
    ],
    5: [ // Club Cultural
        { nombre: 'Informe Bienestar Club', campo: 'INFORME_BIENESTAR_CLUB' }
    ],
    6: [ // Estudiantes con Capacidades Especiales
        { nombre: 'Carné MSP', campo: 'CARNE_MSP' }
    ],
    7: [ // Estudiantes con Situaciones Calamitosas
    ]
};

const documentosFormulario = computed(() => {
    if (tipoBecaSeleccionado.value) {
        let documentos = [...documentosGenerales];

        if (tipoBecaSeleccionado.value === 7) {
            documentos = [...documentos, ...documentosObligatoriosSituacionesCalamitosas];
        }
        documentos = [...documentos, ...documentosPorBeca[tipoBecaSeleccionado.value] || []];

        return documentos;
    }
    return [];
});

const seleccionarDocumentoOpcional = () => {
    if (documentoSeleccionadoOpcional.value) {
        mostrarInputDocumentoOpcional.value = true;
    } else {
        mostrarInputDocumentoOpcional.value = false;
    }
};

const validarDocumentos = async () => {
    let documentosFaltantes = [];

    if (tipoBecaSeleccionado.value === 7) {
        documentosGenerales.forEach(doc => {
            const inputArchivo = document.querySelector(`input[name="${doc.campo}"]`);
            if (!inputArchivo || !inputArchivo.files.length) {
                documentosFaltantes.push(`${doc.nombre}`);
            }
        });

        documentosObligatoriosSituacionesCalamitosas.forEach(doc => {
            const inputArchivo = document.querySelector(`input[name="${doc.campo}"]`);
            if (!inputArchivo || !inputArchivo.files.length) {
                documentosFaltantes.push(`${doc.nombre}`);
            }
        });

        if (!documentoSeleccionadoOpcional.value) {
            documentosFaltantes.push('Documento opcional');
        } else {
            const inputArchivoOpcional = document.querySelector(`input[name="${documentoSeleccionadoOpcional.value}"]`);
            if (!inputArchivoOpcional || !inputArchivoOpcional.files.length) {
                documentosFaltantes.push('Archivo de documento opcional');
            }
        }
    }
    else {
        const documentos = [
            ...documentosGenerales,
            ...(documentosPorBeca[tipoBecaSeleccionado.value] || [])
        ];

        documentos.forEach(doc => {
            const inputArchivo = document.querySelector(`input[name="${doc.campo}"]`);
            if (!inputArchivo || !inputArchivo.files.length) {
                documentosFaltantes.push(`${doc.nombre}`);
            }
        });
    }

    if (documentosFaltantes.length > 0) {
        Swal.fire({
            title: 'Faltan documentos',
            text: `Debe subir los siguientes documentos: ${documentosFaltantes.join(', ')}`,
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
    } else {
        const formData = new FormData();

        documentosGenerales.forEach(doc => {
            const inputArchivo = document.querySelector(`input[name="${doc.campo}"]`);
            if (inputArchivo.files.length > 0) {
                formData.append(doc.campo, inputArchivo.files[0]);
            }
        });

        if (tipoBecaSeleccionado.value === 7) {
            documentosObligatoriosSituacionesCalamitosas.forEach(doc => {
                const inputArchivo = document.querySelector(`input[name="${doc.campo}"]`);
                if (inputArchivo.files.length > 0) {
                    formData.append(doc.campo, inputArchivo.files[0]);
                }
            });

            if (documentoSeleccionadoOpcional.value) {
                const inputArchivoOpcional = document.querySelector(`input[name="${documentoSeleccionadoOpcional.value}"]`);
                if (inputArchivoOpcional.files.length > 0) {
                    formData.append(documentoSeleccionadoOpcional.value, inputArchivoOpcional.files[0]);
                }
            }
        }
        else {
            const documentosEspecificos = documentosPorBeca[tipoBecaSeleccionado.value] || [];
            documentosEspecificos.forEach(doc => {
                const inputArchivo = document.querySelector(`input[name="${doc.campo}"]`);
                if (inputArchivo.files.length > 0) {
                    formData.append(doc.campo, inputArchivo.files[0]);
                }
            });
        }
        const user = await fetchCurrentUser();
        formData.append('usuario', user.APELLIDOS_USUARIOS + '_' + user.NOMBRES_USUARIOS + '_' + user.DOCUMENTO_USUARIOS);  
        formData.append('id_documento_pendiente', datosSolicitud.value.id_documento_pendiente);
    
        try {
            await guardarDocumentos(formData);
            Swal.fire({
                title: '¡Éxito!',
                text: 'Tu solicitud ha sido enviada correctamente. Sera notificado por correo electrónico cuando se haya procesado su solicitud.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar la solicitud.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }
};

onMounted(() => {
    initFlowbite();
    documentosPendientes();
});


</script>


<template>
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Documentos para Solicitud de Beca</h2>

        <!-- Selección del tipo de beca -->
        <label for="tipoBeca" class="block text-sm font-medium text-gray-900 mb-2">Tipo de beca</label>
        <!-- <select id="tipoBeca" v-model="tipoBecaSeleccionado"
            class="block w-full sm:w-1/2 p-2.5 mb-6 rounded-lg border border-gray-300 text-gray-900">
            <option value="" disabled>Seleccione un tipo de beca</option>
            <option v-for="tipo in tiposBeca" :key="tipo.id" :value="tipo.id">{{ tipo.nombre }}</option>
        </select> -->

        <select id="tipoBeca" v-model="selectedBeca" :disabled="isReadonly"
            class="block w-full sm:w-1/2 p-2.5 mb-6 rounded-lg border border-gray-300 text-gray-900">
            <option v-for="beca in tiposBeca" :key="beca.id" :value="beca.id">
                {{ beca.nombre }}
            </option>
        </select>

        <!-- Formulario de documentos -->
        <form v-if="tipoBecaSeleccionado">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="(documento, index) in documentosFormulario" :key="index" class="w-full">
                    <div v-if="!documento.opciones">
                        <label :for="documento.campo" class="block text-sm font-medium text-gray-900 mb-2">{{
                            documento.nombre }}:</label>
                        <input type="file" :id="documento.campo" :name="documento.campo"
                            class="block w-full p-2.5 rounded-lg border border-gray-300" />
                    </div>
                </div>
            </div>

            <!-- Si es la beca de Situaciones Calamitosas, mostrar la selección de documentos opcionales -->
            <div v-if="tipoBecaSeleccionado === 7" class="m|t-4">
                <label for="documentoOpcional" class="block text-sm font-medium text-gray-900 mb-2">Seleccione un
                    documento opcional:</label>
                <select v-model="documentoSeleccionadoOpcional" @change="seleccionarDocumentoOpcional"
                    class="block w-full sm:w-1/2 p-2.5 mb-6 rounded-lg border border-gray-300 text-gray-900">
                    <option value="" disabled>Seleccione un documento adicional</option>
                    <option v-for="(opcion, idx) in documentosOpcionalesSituacionesCalamitosas" :key="idx"
                        :value="opcion.campo">{{ opcion.nombre }}</option>
                </select>

                <!-- Si se selecciona un documento opcional, mostrar el input para subir el archivo -->
                <div v-if="mostrarInputDocumentoOpcional" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="w-full">
                        <label :for="documentoSeleccionadoOpcional"
                            class="block text-sm font-medium text-gray-900 mb-2">Subir archivo:</label>
                        <input type="file" :id="documentoSeleccionadoOpcional" :name="documentoSeleccionadoOpcional"
                            class="block w-full p-2.5 rounded-lg border border-gray-300" />
                    </div>
                </div>
            </div>
            <div class="flex justify-center mt-4">
                <button @click="validarDocumentos" type="button"
                    class="w-72 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-600">
                    Enviar Solicitud
                </button>
            </div>
        </form>
    </div>
</template>


<style scoped>
form {
    margin-top: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input[type="file"],
select {
    margin-bottom: 15px;
}
</style>
