<script setup>
import { ref, onMounted } from 'vue';
import { getTiposBecas } from '../../services/tiposBecas';

const tiposBecas = ref([]);

const selectedBeca = ref('');

const fetchTiposBecas = async () => {
    tiposBecas.value = await getTiposBecas();
};

const validateForm = (event) => {
    if (selectedBeca.value === '') {
        alert('Por favor selecciona un tipo de beca.');
        event.preventDefault(); 
    }
};

onMounted(() => {
    fetchTiposBecas();
});
</script>

<template>
    <div class="bg-gray-100 text-gray-900 flex justify-center items-center" style="min-height: 80vh; text-align: center;">
        <form class="bg-white p-10 rounded-lg shadow-lg" @submit="validateForm">
            <!-- Recordatorio -->
            <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Solicitud de Beca</h2>
            <p class="text-gray-700 mb-6 text-sm text-center">
                Por favor, descarga y completa el formulario con los datos requeridos para la solicitud de beca. 
                Una vez que lo hayas llenado y escaneado, súbelo a continuación.
            </p>
            
            <!-- Botón para descargar el PDF -->
            <a href="https://www.istla.edu.ec/wp-content/uploads/2024/pdf/Bienestar-Estudiantil/Formulario-para-becas-actual.pdf"
               download
               class="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block text-center transition-all duration-200 ease-in-out transform hover:scale-105">
               <i class="pi pi-download mr-2"></i> Descargar Formulario de Solicitud
            </a>

            <!-- Select para tipo de beca -->
            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900">Tipo de Beca</label>
            <select id="countries" v-model="selectedBeca" required
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-6">
                <option disabled value="">Selecciona una opción</option>
                <option v-for="beca in tiposBecas" :key="beca.id" :value="beca.id">{{ beca.tipo_beca }}</option>
            </select>

            <!-- Subida de archivos -->
            <label for="file-upload" class="block mb-2 text-sm font-medium text-gray-900">Subir Formulario Escaneado</label>
            <input id="file-upload" type="file" accept="application/pdf" required
                   class="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none mb-3" />
            <p class="text-xs text-gray-500 mb-6">Formato permitido: PDF. Tamaño máximo: 5MB.</p>
            
            <!-- Botón para enviar la solicitud -->
            <button type="submit" 
                    class="w-72 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-600">
                Enviar Solicitud
            </button>
        </form>
    </div>
</template>

<style scoped></style>
