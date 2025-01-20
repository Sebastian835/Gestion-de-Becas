<script setup>
import 'primeicons/primeicons.css';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

import { logout } from '../services/authService';
import { getUser } from '../services/user';
import { getUsuariosBusqueda, actualizarUsuario } from '../services/usuarios';
import { useSidebarStore } from '../stores/sidebarStore';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import SplitButton from 'primevue/splitbutton';

const sidebarStore = useSidebarStore();
const router = useRouter();

const user = ref(null);
const settingsVisible = ref(false);
const datosUsuario = ref(false);
const submitted = ref(false);
const nombreUsuario = ref('');
const docente = ref(true);

const fecthUser = async () => {
  user.value = await getUser();
  if (user.value.role === 'estudiante') {
    docente.value = false;
    return;
  } else {
    user.value = await getUsuariosBusqueda(user.value.username);
    nombreUsuario.value = user._value.USUARIO;
  }

};

const handleLogout = () => {
  logout();
  router.push('/login');
};

const dialogUsuario = () => {
  submitted.value = true;
  datosUsuario.value = true;
};

const edicionUsuario = async (usuario) => {
  submitted.value = true;
  const data = {
    ID_USUARIO: usuario.ID_USUARIO,
    USUARIO: usuario.USUARIO,
    NOMBRES: usuario.NOMBRES,
    APELLIDOS: usuario.APELLIDOS,
    PASSWORD: usuario.PASSWORD,
    CORREO: usuario.CORREO,
  };

  try {
    const actualizacion = await actualizarUsuario(data);
    Swal.fire({
      title: '¡Éxito!',
      text: 'Usuario actualizado correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      if (nombreUsuario.value != data.USUARIO) {
        Swal.fire({
          title: 'Requerido',
          text: 'Se ha actualizado el usuario, por favor vuelva a iniciar sesión',
          icon: 'info',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          handleLogout();
        });
      }
      fecthUser();
    });
  } catch (error) {
    Swal.fire({
      title: '¡Error!',
      text: 'No se pudo actualizar el usuario',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      fecthUser();
    });
  }
  hideDialog();
};

const hideDialog = () => {
  submitted.value = false;
  datosUsuario.value = false;
};

const opciones = [
  {
    label: 'Salir',
    icon: 'pi pi-sign-out',
    command: () => {
      handleLogout();
    }
  },
];


onMounted(() => {
  fecthUser();
});

</script>


<template>

  <div class="flex flex-col-reverse justify-between gap-2 md:flex-row md:items-center">
    <div class="capitalize">
      <ol class="flex flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
        <li class="flex items-center text-gray-900 antialiased font-sans text-sm font-normal leading-normal ">
          <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
            <strong style="color: #161E2D;"> Intituto Superior Tecnológico Los Andes" ISTLA</strong>
          </p>
        </li>
      </ol>
    </div>

    <div class="flex justify-end items-center">
      <button @click="sidebarStore.toggleSidebar"
        class="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden"
        type="button">
        <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <div>
            <i class="pi pi-bars" style="font-size: 1.5rem; color: #020617;"></i>
          </div>
        </span>
      </button>

      <!-- AJUSTES y SALIR -->
      <SplitButton icon="pi pi-user" dropdownIcon="pi pi-cog" label="Perfil" @click="dialogUsuario" :model="opciones"
        size="small" severity="contrast" rounded />

    </div>
  </div>

  <!-- Diálogo de Edición -->
  <Dialog v-model:visible="datosUsuario" :style="{ width: '700px' }" header="Datos de Usuario" modal class="p-fluid"
    dismissableMask>
    <div class="form-container">
      <div class="form-group">
        <label for="usuario" class="font-medium">Nombres</label>
        <InputText id="nombre" v-model.trim="user.NOMBRES" placeholder="Ingrese el nombre"
          :class="{ 'p-invalid': submitted && !user.NOMBRES }" />
      </div>
      <div class="form-group">
        <label for="usuario" class="font-medium">Apellidos</label>
        <InputText id="apellido" v-model.trim="user.APELLIDOS" placeholder="Ingrese el apellido"
          :class="{ 'p-invalid': submitted && !user.APELLIDOS }" />
      </div>
      <div class="form-group">
        <label for="usuario" class="font-medium">Usuario</label>
        <InputText id="usuario" v-model.trim="user.USUARIO" placeholder="Ingrese el nombre de usuario"
          :class="{ 'p-invalid': submitted && !user.USUARIO }" />
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <Password id="password" v-model="user.PASSWORD" placeholder="Ingrese la contraseña" :feedback="false"
          :class="{ 'p-invalid': submitted && !user.PASSWORD }" toggleMask inputClass="w-full" />
      </div>
      <div class="form-group">
        <label for="usuario" class="font-medium">Correo</label>
        <InputText id="correo" v-model.trim="user.CORREO" placeholder="Ingrese el correo"
          :class="{ 'p-invalid': submitted && !user.CORREO }" />
      </div>
    </div>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
      <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="edicionUsuario(user)" />
    </template>
  </Dialog>

</template>



<style scoped>
.form-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  padding: 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0;
}

.full-width {
  grid-column: 1 / -1;
}

::v-deep(.p-password) {
  width: 100%;
}

::v-deep(.p-password-input),
::v-deep(.p-inputtext),
::v-deep(.p-dropdown) {
  margin: 0;
}

::v-deep(.p-dropdown-label) {
  padding: 0.5rem 0.75rem;
}

::v-deep(.p-dialog-footer) {
  padding: 1rem 1.5rem;
}

/* Asegura que todos los inputs tengan la misma altura */
::v-deep(.p-inputtext),
::v-deep(.p-dropdown),
::v-deep(.p-password .p-inputtext) {
  height: 2.5rem;
  padding: 0.5rem 0.75rem;
}
</style>