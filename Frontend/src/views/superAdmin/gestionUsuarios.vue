<script setup>
import { ref, onMounted } from 'vue';
import { getUsuarios, getRoles, crearUsuario, actualizarUsuario, eliminarUsuario } from '../../services/usuarios.js';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import Swal from 'sweetalert2';

import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import Tag from 'primevue/tag';
import Password from 'primevue/password';
import Textarea from 'primevue/textarea';

const confirm = useConfirm();
const toast = useToast();


const usuario = ref({
    NOMBRE: '',
    APELLIDO: '',
    PASSWORD: '',
    CORREO: '',
    DESCRIPCION: '',
    ROL: ''
});

const roles = ref([]);
const usuarios = ref([]);
const creacionDialog = ref(false);
const editarUsuario = ref(false);
const deleteUsuarioDialog = ref(false);
const submitted = ref(false);


const fetchRoles = async () => {
    roles.value = await getRoles();
};

const fetchUsuarios = async () => {
    usuarios.value = await getUsuarios();
};

const creacionUsuario = () => {
    usuario.value = {
        NOMBRE: '',
        APELLIDO: '',
        PASSWORD: '',
        CORREO: '',
        DESCRIPCION: '',
        ROL: ''
    };
    submitted.value = false;
    creacionDialog.value = true;
};

const crearNuevoUsuario = async () => {
    submitted.value = true;

    if (!usuario.value.NOMBRE || !usuario.value.APELLIDO || !usuario.value.PASSWORD || !usuario.value.CORREO || !usuario.value.ROL) {
        return;
    }

    const data = {
        NOMBRES: usuario.value.NOMBRE,
        APELLIDOS: usuario.value.APELLIDO,
        PASSWORD: usuario.value.PASSWORD,
        CORREO: usuario.value.CORREO,
        DESCRIPCION: usuario.value.DESCRIPCION,
        ROL: usuario.value.ROL
    };

    try {
        const nuevoUser = await crearUsuario(data);
        Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario creado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            fetchUsuarios();
        });
    } catch (error) {
        Swal.fire({
            title: '¡Error!',
            text: 'No se pudo crear el usuario',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            fetchUsuarios();
        });
    }
    hideDialog();
};

const editUsuario = (editUsuario) => {
    editarUsuario.value = true;
    usuario.value = { ...editUsuario };
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
        DESCRIPCION: usuario.DESCRIPCION,
        ROL: usuario.ROL
    };

    try {
        const actualizacion = await actualizarUsuario(data);
        Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario actualizado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            fetchUsuarios();
        });
    } catch (error) {
        Swal.fire({
            title: '¡Error!',
            text: 'No se pudo actualizar el usuario',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            fetchUsuarios();
        });
    }
    hideDialog();
};

const confirmDeleteUsuario = (usuarioData) => {
    usuario.value = usuarioData;
    deleteUsuarioDialog.value = true;
};

const eliminacionUsuario = async (id) => {
    try {
        Swal.fire({
            title: '¿Está seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const eliminacion = await eliminarUsuario(id);
                Swal.fire(
                    '¡Eliminado!',
                    'El usuario ha sido eliminado.',
                    'success'
                ).then(() => {
                    fetchUsuarios();
                });
            }
        });
    } catch (error) {
        Swal.fire({
            title: '¡Error!',
            text: 'No se pudo eliminar el usuario',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            fetchUsuarios();
        });
    }
};

const hideDialog = () => {
    creacionDialog.value = false;
    editarUsuario.value = false;
    submitted.value = false;
};

const getRolColor = (rol) => {
    return rol === 'Admin' ? 'bg-purple-100' : 'bg-blue-100';
};

const getRolTextColor = (rol) => {
    return rol === 'Admin' ? 'text-purple-900' : 'text-blue-900';
};

onMounted(() => {
    fetchUsuarios();
    fetchRoles();
});
</script>

<template>
    <div class="card">
        <Toast />
        <ConfirmDialog />

        <div class="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
            <h2 class="text-2xl font-semibold text-gray-800">Gestión de Usuarios</h2>

        </div>

        <Button icon="pi pi-user-plus" label="Nuevo Usuario" @click="creacionUsuario" severity="secondary" raised
            class="flex-1 min-w-[150px]" style="margin-bottom: 30px;" />

        <!-- Grid de Cards de Usuarios -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="user in usuarios" :key="user.ID_USUARIO" class="card-hover">
                <Card class="user-card">
                    <template #header>
                        <div :class="['w-full p-3 flex justify-center items-center', getRolColor(user.ROL)]">
                            <i class="pi pi-user text-4xl mr-3" style="font-size: 1.5rem"></i>
                            <span class="text-2xl font-semibold">{{ user.NOMBRES }} {{ user.APELLIDOS }}</span>

                        </div>

                    </template>
                    <template #title>
                        <div class="flex items-center justify-between">
                            <span class="text-base font-semibold">{{ user.CORREO }}</span>
                            <Tag :value="user.ROL" :severity="user.ROL === 'Admin' ? 'danger' : 'info'" />
                        </div>
                    </template>


                    <template #content>
                        <div class="text-gray-600">
                            <p><i class="pi pi-user mr-2"></i> {{ user.USUARIO }}</p>
                        </div>
                        <div class="text-gray-600">
                            <p><i class="pi pi-id-card mr-2"></i> {{ user.CEDULA }}</p>
                        </div>
                    </template>

                    <template #footer>
                        <div class="flex justify-end gap-2">
                            <Button icon="pi pi-user-edit" class="p-button-rounded p-button-success p-button-outlined"
                                @click="editUsuario(user)" />
                            <Button icon="pi pi-user-minus" class="p-button-rounded p-button-danger p-button-outlined"
                                @click="eliminacionUsuario(user.ID_USUARIO)" />
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <!-- Diálogo de Creacion -->
        <Dialog v-model:visible="creacionDialog" :style="{ width: '800px' }" header="Nuevo Usuario" :modal="true"
            class="user-dialog">
            <div class="form-container">
                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <InputText id="nombre" v-model.trim="usuario.NOMBRE" placeholder="Ingrese el nombre"
                        :class="{ 'p-invalid': submitted && !usuario.NOMBRE }" />
                </div>

                <div class="form-group">
                    <label for="apellido">Apellido</label>
                    <InputText id="apellido" v-model.trim="usuario.APELLIDO" placeholder="Ingrese el apellido"
                        :class="{ 'p-invalid': submitted && !usuario.APELLIDO }" />
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <Password id="password" v-model="usuario.PASSWORD" placeholder="Ingrese la contraseña"
                        :feedback="false" :class="{ 'p-invalid': submitted && !usuario.PASSWORD }" toggleMask
                        inputClass="w-full" />
                    <small class="p-error" v-if="submitted && !usuario.PASSWORD" style="color: red;">La contraseña es
                        requerida.</small>
                </div>

                <div class="form-group">
                    <label for="correo">Correo</label>
                    <InputText id="correo" v-model.trim="usuario.CORREO" placeholder="Ingrese el correo"
                        :class="{ 'p-invalid': submitted && !usuario.CORREO }" />
                </div>

                <div class="form-group full-width">
                    <label for="descripcion">Descripción</label>
                    <Textarea id="descripcion" v-model.trim="usuario.DESCRIPCION" placeholder="Ingrese una descripción"
                        rows="3" autoResize />
                </div>

                <div class="form-group full-width">
                    <label for="rol">Rol</label>
                    <Select id="rol" v-model="usuario.ROL" :options="roles.map(role => role.NOMBRE)"
                        :class="{ 'p-invalid': submitted && !usuario.ROL }" placeholder="Seleccione un rol" />

                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                    <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="crearNuevoUsuario" />
                </div>
            </template>
        </Dialog>

        <!-- Diálogo de Edición -->
        <Dialog v-model:visible="editarUsuario" :style="{ width: '700px' }" header="Edicion de Usuario" :modal="true"
            class="p-fluid">
            <div class="form-container">
                <div class="form-group">
                    <label for="usuario" class="font-medium">Nombres</label>
                    <InputText id="nombre" v-model.trim="usuario.NOMBRES" placeholder="Ingrese el nombre"
                        :class="{ 'p-invalid': submitted && !usuario.NOMBRES }" />
                </div>
                <div class="form-group">
                    <label for="usuario" class="font-medium">Apellidos</label>
                    <InputText id="apellido" v-model.trim="usuario.APELLIDOS" placeholder="Ingrese el apellido"
                        :class="{ 'p-invalid': submitted && !usuario.APELLIDOS }" />
                </div>
                <div class="form-group">
                    <label for="usuario" class="font-medium">Usuario</label>
                    <InputText id="usuario" v-model.trim="usuario.USUARIO" placeholder="Ingrese el nombre de usuario"
                        :class="{ 'p-invalid': submitted && !usuario.USUARIO }" />
                </div>
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <Password id="password" v-model="usuario.PASSWORD" placeholder="Ingrese la contraseña"
                        :feedback="false" :class="{ 'p-invalid': submitted && !usuario.PASSWORD }" toggleMask
                        inputClass="w-full" />
                </div>
                <div class="form-group">
                    <label for="usuario" class="font-medium">Correo</label>
                    <InputText id="correo" v-model.trim="usuario.CORREO" placeholder="Ingrese el correo"
                        :class="{ 'p-invalid': submitted && !usuario.CORREO }" />
                </div>

                <div class="form-group">
                    <label for="rol" class="font-medium">Rol</label>
                    <Select id="rol" v-model="usuario.ROL" :options="roles.map(role => role.NOMBRE)"
                        :class="{ 'p-invalid': submitted && !usuario.ROL }" placeholder="Seleccione un rol" />
                    <small class="p-error" v-if="submitted && !usuario.ROL">El rol es requerido.</small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="edicionUsuario(usuario)" />
            </template>
        </Dialog>

        <!-- Diálogo de Eliminación -->
        <!-- <Dialog v-model:visible="deleteUsuarioDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="usuario">¿Está seguro de que desea eliminar el usuario <b>{{ usuario.USUARIO }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUsuarioDialog = false" />
                <Button label="Sí" icon="pi pi-check" class="p-button-text" @click="deleteUsuario" />
            </template>
        </Dialog> -->
    </div>
</template>

<style scoped>
.card {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 10px;
}

.card-hover {
    transition: transform 0.2s ease-in-out;
}

.card-hover:hover {
    transform: translateY(-5px);
}

.user-card {
    background: white;
    border: none;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12);
}

.field {
    margin-bottom: 1.5rem;
}

::v-deep(.p-card-header) {
    padding: 0;
}

::v-deep(.p-card-body) {
    padding: 1.5rem;
}

::v-deep(.p-dialog-header) {
    border-bottom: 1px solid #dee2e6;
    padding: 1.5rem;
}

::v-deep(.p-dialog-footer) {
    border-top: 1px solid #dee2e6;
    padding: 1.5rem;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

user-dialog ::v-deep(.p-dialog-content) {
    padding: 1.5rem;
}

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