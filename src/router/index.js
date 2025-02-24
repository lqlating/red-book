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
import Publish from '../components/publish/Publish.vue';
import Market from '../components/market/Market.vue';
import Cart from '../components/cart/Cart.vue'; // 导入购物车组件

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/Discover' // 让首页默认进入 Discover
        },
        {
            path: '/Market', // 商场页面
            component: Market
        },
        {
            path: '/Cart', // 购物车页面
            component: Cart
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
                    path: '',
                    redirect: 'becomment', // 子路由的默认跳转
                },
                {
                    path: 'becomment',
                    component: becomment
                },
                {
                    path: 'like_star',
                    component: like_star
                },
                {
                    path: 'newSubscript',
                    component: newSubscript
                }
            ]
        },
        {
            path: '/Me',
            component: Me,
            children: [
                {
                    path: '',
                    redirect: 'Note' // 默认跳转到 Note
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
