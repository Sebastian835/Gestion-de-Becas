<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { login } from '../services/authService';

const router = useRouter();

let usuario = ref('');
let contra = ref('');

const iniciarSesion = async () => {
    try {
        Swal.fire({
            title: "Iniciando Sesión",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const dataUser = await login(usuario.value, contra.value);
        Swal.close();
        Swal.fire({
            icon: "success",
            title: "Inicio de Sesión Exitoso",
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            if (usuario.value === 'admin') {
                usuario.value = '';
                contra.value = '';
                router.push('/main/home');
            } else if (dataUser.user.PERFIL === 'ESTUDIANTE') {
                usuario.value = '';
                contra.value = '';
                router.push('/main/requisitos');
            }
        });
    } catch (error) {
        Swal.close();
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Datos Incorrectos",
        }).then(() => {
            usuario.value = '';
            contra.value = '';
        });
    }
}


</script>


<template>
    <div class="min-h-screen flex flex-col md:flex-row">
        <div class="bg-sky-100 md:w-1/2 flex items-center justify-center p-8">
            <div class="text-center">
                <div class="w-60 h-60 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <img class="w-60 h-60 object-contain" src="../assets/logo_istla.png" alt="ISTLA Logo">
                </div>
                <h1 class="text-3xl font-bold text-sky-800 mt-4">Instituto Superior Tecnológico
                </h1>
                <h1 class="text-3xl font-bold text-sky-800 mt-4">"Los Andes" ISTLA</h1>
                <p className="mt-3 text-sky-600">Gestion de Becas</p>
            </div>
        </div>


        <div class="bg-white md:w-1/2 flex items-center justify-center p-8">
            <div class="max-w-lg w-full space-y-10">
                <div>
                    <h2 class="text-4xl font-extrabold text-gray-900">Inicio de Sesión</h2>
                </div>
                <form class="space-y-8" @submit.prevent="iniciarSesion">
                    <div class="rounded-md shadow-sm space-y-4">
                        <div>
                            <label for="usuario" class="sr-only">Usuario</label>
                            <input id="usuario" name="usuario" type="text" required
                                class="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-lg"
                                placeholder="Usuario" v-model="usuario" />
                        </div>
                        <div>
                            <label for="contra" class="sr-only">Contraseña</label>
                            <input id="contra" name="contra" type="password" required
                                class="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-lg"
                                placeholder="Contraseña" v-model="contra" />
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="text-sm">
                            <a href="#" class="font-medium text-sky-600 hover:text-sky-500">
                                Olvidó su contraseña?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button type="submit"
                            class="group relative w-full flex justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                            Iniciar Sesión
                        </button>

                    </div>
                </form>
            </div>
        </div>

    </div>
</template>


<style scoped></style>
