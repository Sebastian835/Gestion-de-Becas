<script setup>
import Sidebar from '../components/sidebar.vue';
import Header from '../components/header.vue';
import Footer from '../components/footer.vue';
</script>

<template>
    <div class="animated-background min-h-screen">
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

<style>
.animated-background {
    background: linear-gradient(270deg, #e0f7fa, #c9edf0, #e0f7fa);
    background-size: 400% 400%;
    animation: moveGradient 8s ease infinite;
}

@keyframes moveGradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
