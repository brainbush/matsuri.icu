import {createRouter, createWebHistory} from 'vue-router'

import Home from "@/views/Home";
import Channel from "@/views/Channel";
import Detail from "@/views/Detail";
import Viewer from "@/views/Viewer"
import About from "@/views/About";

const routes = [
    {path: '/', name: 'home', component: Home},
    {path: '/channel/:channel', name: 'channel', component: Channel},
    {path: '/detail/:id', name: 'detail', component: Detail},
    {path: '/viewer/:id', name: 'viewer', component: Viewer},
    {path: '/about', name: 'about', component: About},
    {path: '/:catchAll(.*)', redirect: '/'}
];

const router = createRouter({
    mode: 'history',
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

export default router