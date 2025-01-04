<script setup>
import { ref, onMounted } from 'vue';
import { initFlowbite } from 'flowbite'

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

onMounted(() => {
    initFlowbite();
})


const isSectionOpen = ref({
    generales: false,
});

function toggleSection(section) {
    for (const key in isSectionOpen.value) {
        if (key !== section) {
            isSectionOpen.value[key] = false;
        }
    }
    isSectionOpen.value[section] = !isSectionOpen.value[section];
}

function beforeEnter(el) {
    el.style.maxHeight = '0';
}

function enter(el) {
    el.style.maxHeight = `${el.scrollHeight}px`;
}

function leave(el) {
    el.style.maxHeight = '0';
}

const isModalOpen = ref(false);

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

const distincionAcademica = ref(false);
const deportistasAltoRendimiento = ref(false);
const heroesNacionales = ref(false);
const discapacidad = ref(false);
const clubDeportivo = ref(false);
const clubCAA = ref(false);
const socioeconomicas = ref(false);

</script>

<template>
    <div class="bg-gray-100 text-gray-900 min-h-screen">
        <main class="p-6">
            <!-- Requisitos Generales -->
            <section>
                <button @click="toggleSection('generales')"
                    class="text-xl font-semibold mb-4 w-full text-left bg-blue-500 text-white p-2 rounded-md mb-2 flex items-center justify-between">
                    REQUISITOS GENERALES
                    <span class="ml-2 flex flex-col items-center">
                        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7">
                            </path>
                        </svg>

                    </span>

                </button>

                <transition name="accordion" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                    <div v-show="isSectionOpen.generales" class="overflow-hidden transition-all duration-500">
                        <div class="bg-white p-4 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold">1. Estar debidamente matriculado y tener aprobado un
                                semestre en el ISTLA</h3>
                            <ul class="list-disc pl-5 mt-2">
                                <li>Certificado de matrícula otorgado por el departamento de secretaria del ISTLA.</li>
                                <li>Copia de cédula de ciudadanía o pasaporte y certificado de votación vigente.</li>
                                <li>Carta dirigido a la rectora/or.</li>
                                <li>Solicitud para admisión de becas.</li>
                                <li>Certificación de coordinación de carreras respecto a la asistencia.</li>
                                <li>Certificado de tesorería respecto a puntualidad de pagos.</li>
                            </ul>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                            <h3 class="text-lg font-semibold">2. No ser becario o beneficiario de una ayuda económica...
                            </h3>
                            <ul class="list-disc pl-5 mt-2">
                                <li>Declaración juramentada ante un notario de no percibir beca por el mismo fin en
                                    otras instituciones.</li>
                            </ul>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                            <h3 class="text-lg font-semibold">3. No haber sido sancionado disciplinariamente</h3>
                            <ul class="list-disc pl-5 mt-2">
                                <li>Certificado de no registrar sanciones disciplinarias otorgado por el Departamento de
                                    Bienestar Estudiantil.</li>
                            </ul>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                            <h3 class="text-lg font-semibold">4. Adquirir y presentar solicitud de beca</h3>
                            <ul class="list-disc pl-5 mt-2">
                                <li>Descargarla de la página web del Instituto dirigida a rectorado y presentarla en el
                                    departamento de bienestar estudiantil.</li>
                            </ul>
                        </div>
                    </div>
                </transition>
            </section>
        </main>
        <!-- Becas -->
        <section class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button @click="distincionAcademica = true"
                    class="transform transition duration-300 ease-in-out hover:scale-105 flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img class="w-20 h-20 md:w-20 md:h-20 rounded-t-lg md:rounded-none"
                        src="../../assets/img/user_requisitos/distincionAcademica.svg"
                        alt="Beca por distinción académica">
                    <div class="p-4">
                        <h5 class="text-xl font-bold text-gray-900 dark:text-white">Beca por distinción académica</h5>
                    </div>
                </button>

                <button @click="deportistasAltoRendimiento = true"
                    class="transform transition duration-300 ease-in-out hover:scale-105 flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img class="w-20 h-20 md:w-20 md:h-20 rounded-t-lg md:rounded-none"
                        src="../../assets/img/user_requisitos/deportista.svg" alt="Beca a deportistas de alto">
                    <div class="p-4">
                        <h5 class="text-xl font-bold text-gray-900 dark:text-white">Beca a deportistas de alto
                            rendimiento</h5>

                    </div>
                </button>

                <button @click="heroesNacionales = true"
                    class="transform transition duration-300 ease-in-out hover:scale-105 flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img class="w-20 h-20 md:w-20 md:h-20 rounded-t-lg md:rounded-none"
                        src="../../assets/img/user_requisitos/heroes.svg" alt="Beca a heroes o heroinas nacionales">
                    <div class="p-4">
                        <h5 class="text-xl font-bold text-gray-900 dark:text-white">Beca a heroes o heroinas nacionales
                        </h5>
                    </div>
                </button>

                <button @click="discapacidad = true"
                    class="transform transition duration-300 ease-in-out hover:scale-105 flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img class="w-20 h-20 md:w-20 md:h-20 rounded-t-lg md:rounded-none"
                        src="../../assets/img/user_requisitos/discapacidad.svg"
                        alt="Beca a estudiantes con discapacidad">
                    <div class="p-4">
                        <h5 class="text-xl font-bold text-gray-900 dark:text-white">Beca a estudiantes con discapacidad
                        </h5>
                    </div>
                </button>

                <button @click="clubDeportivo = true"
                    class="transform transition duration-300 ease-in-out hover:scale-105 flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img class="w-20 h-20 md:w-20 md:h-20 rounded-t-lg md:rounded-none"
                        src="../../assets/img/user_requisitos/clubDeportivo.svg"
                        alt="Beca por pertenecer a club deportivodel ISTLA">
                    <div class="p-4">
                        <h5 class="text-xl font-bold text-gray-900 dark:text-white">Beca por pertenecer a club
                            deportivo del ISTLA</h5>
                    </div>
                </button>

                <button @click="clubCAA = true"
                    class="transform transition duration-300 ease-in-out hover:scale-105 flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img class="w-20 h-20 md:w-20 md:h-20 rounded-t-lg md:rounded-none"
                        src="../../assets/img/user_requisitos/music.svg" alt="Beca por pertenecer a club cultural,
                            artistico o academico del ISTLA">
                    <div class="p-4">
                        <h5 class="text-xl font-bold text-gray-900 dark:text-white">Beca por pertenecer a club cultural,
                            artistico o academico del ISTLA</h5>
                    </div>
                </button>
            </div>

            <div class="flex justify-center items-center py-4">
                <div class="grid grid-cols-1 sm:grid-cols-1 gap-1">
                    <button @click="socioeconomicas = true"
                        class="transform transition duration-300 ease-in-out hover:scale-105 flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                        <img class="w-20 h-20 md:w-20 md:h-20 rounded-t-lg md:rounded-none"
                            src="../../assets/img/user_requisitos/socioeconmicas.svg"
                            alt="Beca a estudiantes con limitaciones socioeconomicas">
                        <div class="p-4">
                            <h5 class="text-xl font-bold text-gray-900 dark:text-white">Beca a estudiantes con
                                limitaciones socioeconomicas</h5>
                        </div>
                    </button>
                </div>
            </div>

        </section>
    </div>

    <!-- Modal Distincion Academica -->
    <Dialog v-model:visible="distincionAcademica" modal header="Beca por distinción académica"
        :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" dismissableMask="true">
        <div class="p-4 md:p-5 space-y-4">
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold">1. Estar debidamente matriculado y tener aprobado un
                    semestre.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de aprobación de semestre, otorgado por el departamento de secretaria
                        del ISTLA.</li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">2. Contar con un promedio final de nueve sobre diez.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de notas otorgado por el departamento de secretaria indicando que el
                        aspirante se encuentra en la media del promedio indicado en el presente reglamento.
                    </li>
                </ul>
            </div>
        </div>
    </Dialog>

    <!-- Modal Deportistas de alto rendimiento -->
    <Dialog v-model:visible="deportistasAltoRendimiento" modal header="Beca a deportistas de alto rendimiento"
        :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" dismissableMask="true">
        <div class="p-4 md:p-5 space-y-4">
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold">1. Estar debidamente matriculado y tener aprobado un
                    semestre.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de aprobación de semestre, otorgado por el departamento de secretaria
                        del ISTLA.</li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">2. Contar con un promedio final de nueve sobre diez.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de notas otorgado por el departamento de secretaria indicando que el
                        aspirante se encuentra en la media del promedio indicado en el presente reglamento.
                    </li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">3. Ser deportista, o haber sido
                    deportista de alto rendimiento y
                    haber obtenido reconocimientos o
                    premios especiales en eventos
                    internacionales.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Hoja de vida sobre la trayectoria
                        deportiva, logros, títulos, medallas o
                        distinciones alcanzadas, con
                        documentación justificativa de soporte.
                    </li>
                    <li>-Informe del Comité Olímpico
                        Ecuatoriano o la Federación Deportiva
                        Nacional o Provincial, donde acredite
                        la calidad de deportista de alto
                        rendimiento.
                    </li>
                </ul>
            </div>
        </div>
    </Dialog>

    <!-- Modal Heroes o Heroias Nacionales -->
    <Dialog v-model:visible="heroesNacionales" modal header="Beca a heroes o heroinas nacionales"
        :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" dismissableMask="true">
        <div class="p-4 md:p-5 space-y-4">
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold">1. Estar debidamente matriculado y tener aprobado un
                    semestre.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de aprobación de semestre, otorgado por el departamento de secretaria
                        del ISTLA.</li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">2. Contar con un promedio final de nueve sobre diez.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de notas otorgado por el departamento de secretaria indicando que el
                        aspirante se encuentra en la media del promedio indicado en el presente reglamento.
                    </li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">3. Haber obtenido la calidad de héroe o
                    heroína nacional de conformidad a lo
                    establecido en la Ley de
                    Reconocimiento a los Héroes y
                    Heroínas nacionales, o ser familiar
                    directo en primer grado de
                    consanguinidad o afinidad.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Fotocopia de la declaratoria de
                        reconocimiento de héroe o heroína
                        nacional del postulante padres o
                        esposos, otorgados por el órgano
                        competente.
                    </li>
                </ul>
            </div>
        </div>
    </Dialog>

    <!-- Modal Estudiantes con Discapacidad -->
    <Dialog v-model:visible="discapacidad" modal header="Beca a estudiantes con discapacidad"
        :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" dismissableMask="true">
        <div class="p-4 md:p-5 space-y-4">
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold">1. Estar debidamente matriculado y tener aprobado un
                    semestre.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de aprobación de semestre, otorgado por el departamento de secretaria
                        del ISTLA.</li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">2. Contar con un promedio final de nueve sobre diez.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de notas otorgado por el departamento de secretaria indicando que el
                        aspirante se encuentra en la media del promedio indicado en el presente reglamento.
                    </li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">3. Tener discapacidad certificada por el
                    MSP, y por lo tanto contar con el carné
                    emitido por esta institución.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Fotocopia del carné emitido por el MSP.
                    </li>
                </ul>
            </div>
        </div>
    </Dialog>

    <!-- Modal Club Deportivo -->
    <Dialog v-model:visible="clubDeportivo" modal header="Beca por pertenecer a club
                        deportivo del ISTLA" :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" dismissableMask="true">
        <div class="p-4 md:p-5 space-y-4">
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold">1. Estar debidamente matriculado y tener aprobado un
                    semestre.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de aprobación de semestre, otorgado por el departamento de secretaria
                        del ISTLA.</li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">2. Contar con un promedio final de nueve sobre diez.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de notas otorgado por el departamento de secretaria indicando que el
                        aspirante se encuentra en la media del promedio indicado en el presente reglamento.
                    </li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">3. Pertenecer por lo menos un periodo
                    a un club deportivo del ISTLA, debe
                    estar activo y legalizado, participar
                    activamente en las competiciones o
                    eventos que desarrolle el club con
                    documentación justificada que
                    indique minino el 90% de asistencia
                    al mismo.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Informe general de las actividades o
                        presentaciones de los clubes por parte
                        del Director/encargado de deportes del
                        ISTLA.
                    </li>
                </ul>
            </div>
        </div>
    </Dialog>

    <!-- Modal Club cultural, artistico o academico -->
    <Dialog v-model:visible="clubCAA" modal header="Beca por pertenecer a club cultural,
                        artistico o academico del ISTLA" :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" dismissableMask="true">
        <div class="p-4 md:p-5 space-y-4">
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold">1. Estar debidamente matriculado y tener aprobado un
                    semestre.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de aprobación de semestre, otorgado por el departamento de secretaria
                        del ISTLA.</li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">2. Contar con un promedio final de nueve sobre diez.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de notas otorgado por el departamento de secretaria indicando que el
                        aspirante se encuentra en la media del promedio indicado en el presente reglamento.
                    </li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">3. Pertenecer por lo menos un periodo
                    a un club deportivo del ISTLA, debe
                    estar activo y legalizado, participar
                    activamente en las competiciones o
                    eventos que desarrolle el club con
                    documentación justificada que
                    indique minino el 90% de asistencia
                    al mismo.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Informe general de soporte emitido por el
                        Coordinador de Bienestar Estudiantil, del
                        instructor del club correspondiente, sobre
                        el aporte y el rendimiento dentro del club
                        del interesado\a.
                    </li>
                </ul>
            </div>
        </div>
    </Dialog>

    <!-- Modal limitaciones socioeconomicas -->
    <Dialog v-model:visible="socioeconomicas" modal header="Beca a estudiantes con
                        limitaciones socioeconomicas" :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" dismissableMask="true">
        <div class="p-4 md:p-5 space-y-4">
            <div class="bg-white p-4 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold">1. Estar debidamente matriculado y tener aprobado un
                    semestre.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de aprobación de semestre, otorgado por el departamento de secretaria
                        del ISTLA.</li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">2. Contar con un promedio final de nueve sobre diez.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Certificado de notas otorgado por el departamento de secretaria indicando que el
                        aspirante se encuentra en la media del promedio indicado en el presente reglamento.
                    </li>
                </ul>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mt-4">
                <h3 class="text-lg font-semibold">3. Pertenecer al grupo de vulnerabilidad, haber sido
                    víctima de eventos graves, encontrarse atravesando calamidad doméstica, situaciones
                    fortuitas y/o de fuerza mayor, debidamente comprometan el ingreso familiar y/o
                    encontrarse el estudiante atravesando una situación económica adversa.</h3>
                <ul class="list-disc pl-5 mt-2">
                    <li>Ficha socio-económica.</li>
                    <li>Mecanizado del IESS de miembros que aportan al grupo familiar.</li>
                    <li>Certificado de no aportar al IESS de los miembros del grupo familiar menores de 25
                        años.</li>
                    <li>Declaración del impuesto a la renta del anterior periodo fiscal de los miembros
                        computables del grupo familiar que lo sustentan.</li>
                    <li>
                        Cualquiera de los certificados o documentos descritos a continuación que demuestren
                        la situación especial o de vulnerabilidad que se encuentra atravesando el/la
                        postulante o su familia, tales como:
                        <ul class="list-disc pl-5 mt-2">
                            <li>
                                Declaratorias de zonas de emergencia: a través de la certificación de la
                                institución competente, en el que indique que la zona en la que vive el
                                postulante ha sido afectada por desastres naturales o declaradas zonas de
                                emergencia.
                            </li>
                            <li>Partida de defunción de quien depende económicamente.</li>
                            <li>
                                Certificados médicos o de discapacidad, de quien depende económicamente,
                                legalmente reconocida.
                            </li>
                            <li>Informes policiales o judiciales.</li>
                            <li>Otro tipo de documentos que acrediten su condición de vulnerabilidad.</li>
                        </ul>
                    </li>

                </ul>
            </div>
        </div>
    </Dialog>

</template>


<style scoped>
.accordion-enter-active,
.accordion-leave-active {
    transition: max-height 0.5s ease;
}

.accordion-enter,
.accordion-leave-to {
    max-height: 0;
    overflow: hidden;
}

ul.list-disc ul {
    list-style-type: circle;
}

ul.list-disc ul li {
    margin-left: 1rem;
}
</style>
