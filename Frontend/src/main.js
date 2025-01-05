import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import ConfirmationService from 'primevue/confirmationservice';
import './style.css'


const app = createApp(App);
const pinia = createPinia();

app.use(pinia); 
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            darkModeSelector: false,
        }
    }
});
app.use(ConfirmationService);
app.use(ToastService);
app.directive('tooltip', Tooltip);


app.use(router).mount('#app')
