import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import VueGtm from 'vue-gtm'
import moment from 'moment'

moment.locale('zh-cn');

Vue.prototype.$moment = moment;
Vue.config.productionTip = false;
Vue.prototype.$http = axios;

Vue.use(VueGtm, {id: 'GTM-52TBTCD', vueRouter: router});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
