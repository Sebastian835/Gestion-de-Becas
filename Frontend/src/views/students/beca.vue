<script setup>
import { onMounted, ref } from 'vue';
import { getUser } from '../../services/user';
import { getBecaVigente } from '../../services/becasOtorgadas';

const usuario = ref(null);
const beca = ref(null);

const fetchCurrentUser = async () => {
    try {
        const user = await getUser();
        usuario.value = user;
        beca.value = await getBecaVigente(user.DOCUMENTO_USUARIOS);
        return;
    } catch (error) {
        return null;
    }
};

onMounted(() => {
    fetchCurrentUser();
});

</script>

<template>
    Beca
</template>

<style scoped></style>