<script setup>
import { ref } from 'vue';

import Sidebar from '../components/layouts/sidebar.vue';
import Header from '../components/layouts/header.vue';
import Footer from '../components/layouts/footer.vue';


</script>

<template>
    <div class="min-h-screen bg-gray-50/50">
        <Sidebar />
        <div class="p-4 xl:ml-80">
            <nav
                class="block w-full max-w-full bg-transparent text-white shadow-none rounded-xl transition-all px-0 py-1">
                <Header />
            </nav>
            <div class="mt-8">
                <router-view />
            </div>
            <!-- <div class="text-blue-gray-600">
                <Footer />
            </div> -->
        </div>
    </div>
</template>

<style scoped></style>
