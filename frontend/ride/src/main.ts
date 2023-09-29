import { createApp } from 'vue'
//@ts-ignore
import App from './App.vue'
import RideGatewayHttp from "./infra/gateway/RideGatewayHttp";
import AxiosAdapter from './infra/http/AxiosAdapter'
import GeolocationGatewayBrowser from "./infra/gateway/GeolocationGatewayBrowser";

const app = createApp(App)
const httpClient = new AxiosAdapter()
app.provide("rideGateway", new RideGatewayHttp(httpClient));
app.provide("geolocationGateway", new GeolocationGatewayBrowser());
app.mount('#app')
