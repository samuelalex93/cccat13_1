import { createApp } from 'vue'
//@ts-ignore
import App from './App.vue'
import AxiosAdapter from './infra/http/AxiosAdapter'

const app = createApp(App)
const httpClient = new AxiosAdapter()

app.mount('#app')
