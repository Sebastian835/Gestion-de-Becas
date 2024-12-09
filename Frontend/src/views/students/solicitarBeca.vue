<script setup>
import { ref, onMounted } from 'vue';
import { getUser } from '../../services/user';
import { getTiposBecas } from '../../services/tiposBecas';
import { postSolicitud, getBuscarSolicitud } from '../../services/solicitudBeca';
import { getperiodosIstla } from '../../services/api_Istla';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { initFlowbite } from 'flowbite'

const tiposBecas = ref([]);
const selectedBeca = ref('');
const fileInput = ref(null);
const solicitud = ref(false);
const router = useRouter();
const periodo = ref();

const fetchTiposBecas = async () => {
    tiposBecas.value = await getTiposBecas();
};

const fetchPeriodosIstla = async () => {
    const periodosArray = await getperiodosIstla();
    periodo.value = periodosArray.sort((a, b) => b.ID_PERIODO - a.ID_PERIODO)[0];
};

const validateForm = () => {
    if (selectedBeca.value === '') {
        Swal.fire({
            title: 'Advertencia',
            text: 'Por favor selecciona un tipo de beca.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return false;
    }

    if (fileInput.value && fileInput.value.files.length === 0) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Por favor sube el formulario escaneado.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return false;
    }
    return true;
};

const fetchCurrentUser = async () => {
    try {
        const user = await getUser();
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
};

const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const submitSolicitud = async () => {
    if (!validateForm()) return;

    const currentUser = await fetchCurrentUser();
    const fechaActual = new Date();
    if (currentUser) {
        let fileBase64 = '';

        if (fileInput.value && fileInput.value.files.length > 0) {
            const file = fileInput.value.files[0];

            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    title: 'Error',
                    text: 'El archivo es demasiado grande. El tamaño máximo permitido es de 5 MB.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            try {
                fileBase64 = await readFileAsBase64(file);
            } catch (error) {
                console.error('Error leyendo el archivo:', error);
            }
        }

        const jsonData = {
            fecha: fechaActual,
            becaSeleccionada: selectedBeca.value,
            cedula_estudiante: currentUser.DOCUMENTO_USUARIOS,
            periodo: periodo.value.ID_PERIODO,
            documento: fileBase64,
        };

        try {
            await postSolicitud(jsonData);
            Swal.fire({
                title: '¡Éxito!',
                text: 'Tu solicitud ha sido enviada correctamente. Sera notificado por correo electrónico cuando se haya procesado su solicitud.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                router.push('/main/requisitos');
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar la solicitud.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                selectedBeca.value = '';
                fileInput.value.value = '';
            });
        }
    } else {
        console.error('No se pudo obtener el usuario.');
    }
};

const solicitudPendiente = async () => {
    const user = await fetchCurrentUser();
    const existeSolicitud = await getBuscarSolicitud(user.DOCUMENTO_USUARIOS)
    solicitud.value = true;
    if (existeSolicitud.existe) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Usted ya tiene una solicitud enviada. Por favor, espere la respuesta del Coordinador de Becas.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
    } else {
        solicitud.value = false;
        fetchTiposBecas();
        fetchPeriodosIstla();
    }
};

onMounted(() => {
    initFlowbite();
    solicitudPendiente();
});


</script>

<template>
    <div class="bg-gray-100 text-gray-900 flex justify-center items-center"
        style="min-height: 80vh; text-align: center;">
        <form class="bg-white p-10 rounded-lg shadow-lg" @submit="validateForm">
            <!-- Recordatorio -->
            <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Solicitud de Beca</h2>
            <p class="text-gray-700 mb-6 text-sm text-center">
                Por favor, descarga y completa el formulario con los datos requeridos para la solicitud de beca.
                Una vez que lo hayas llenado y escaneado, súbelo a continuación.
            </p>

            <a href="https://www.istla.edu.ec/wp-content/uploads/2024/pdf/Bienestar-Estudiantil/Formulario-para-becas-actual.pdf"
                download
                class="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block text-center transition-all duration-200 ease-in-out transform hover:scale-105">
                <i class="pi pi-download mr-2"></i> Descargar Formulario de Solicitud
            </a>

            <!-- Select para tipo de beca -->
            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900">Tipo de Beca</label>
            <select id="countries" v-model="selectedBeca" :disabled="solicitud"
                :class="solicitud ? 'opacity-50 cursor-not-allowed' : ''"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-6">
                <option disabled value="">Selecciona una opción</option>
                <option v-for="beca in tiposBecas" :key="beca.id" :value="beca.ID_TIPO_BECA">{{ beca.TIPO_BECA }}
                </option>
            </select>

            <!-- Subida de archivos -->
            <label for="file-upload" class="block mb-2 text-sm font-medium text-gray-900">Subir Formulario
                Escaneado</label>
            <!-- Input para subir el archivo -->
            <input id="file-upload" type="file" accept="application/pdf" ref="fileInput" :disabled="solicitud"
                :class="solicitud ? 'opacity-50 cursor-not-allowed' : ''"
                class="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none mb-3" />
            <p class="text-xs text-gray-500 mb-6">Formato permitido: PDF. Tamaño máximo: 5MB.</p>

            <!-- Botón para enviar la solicitud -->
            <button @click="submitSolicitud" type="button" :disabled="solicitud"
                :class="solicitud ? 'opacity-50 cursor-not-allowed' : ''"
                class="w-72 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-600 mx-auto">
                Enviar Solicitud
            </button>

        </form>
    </div>

</template>

<style scoped></style>