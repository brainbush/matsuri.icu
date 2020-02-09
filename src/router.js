import Vue from 'vue'
import Router from 'vue-router'

import Home from "@/views/Home";
import Channel from "@/views/Channel";
import Detail from "@/views/Detail";
import Viewer from "@/views/Viewer"

Vue.use(Router);

const routes = [
    {path: '/', name: 'home', component: Home},
    {path: '/channel/:channel', name: 'channel', component: Channel},
    {path: '/detail/:id', name: 'detail', component: Detail},
    {path: '/viewer/:id', name: 'viewer', component: Viewer},
    {path: '*', redirect: '/'}
];

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes
})