import { createRouter, createWebHistory } from 'vue-router';
import Discover from '../components/discover/Discover.vue';
import Notify from '../components/notify/Notify.vue';
import Me from "../components/me/Me.vue";
import LikeList from "../components/me/meInfo/LikeList.vue";
import Note from "../components/me/meInfo/Note.vue";
import StarList from "../components/me/meInfo/StarList.vue";
import becomment from '../components/notify/becomment/becomment.vue';
import like_star from '../components/notify/like_star/like_star.vue';
import newSubscript from '../components/notify/newSubscript/newSubscript.vue';
import Publish from '../components/publish/Publish.vue'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/Discover' // 重定向到 /Discover
        },
        {
            path: '/Discover',
            component: Discover,
        },
        {
            path: '/Publish',
            component: Publish
        },
        {
            path: '/Notify',
            component: Notify,
            children:[
                {
                    path:'/',
                    redirect:becomment,
                },
                {
                    path:'becomment',
                    component:becomment
                },
                {
                    path:'like_star',
                    component:like_star
                },
                {
                    path:'newSubscript',
                    component:newSubscript
                }
            ]
        },
        {
            path: '/Me',
            component: Me,
            children: [
                {
                    path: '/', // 子路由的路径为空，表示默认路由
                    redirect: '/Note' // 重定向到 /Me/Note
                },
                {
                    path: 'LikeList',
                    component: LikeList
                },
                {
                    path: 'Note',
                    component: Note
                },
                {
                    path: 'StarList',
                    component: StarList
                },
            ]
        }
    ]
});

export default router;
