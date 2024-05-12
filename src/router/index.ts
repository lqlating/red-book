import {createRouter,createWebHistory} from 'vue-router'
import Discover from '../components/discover/Discover.vue'
import Publish from '../components/Publish/Publish.vue'
import Notify from '../components/Notify/Notify.vue'
import Me from "../components/me/Me.vue"
import LikeList from "../components/me/meInfo/LikeList.vue"
import Note from "../components/me/meInfo/Note.vue"
import StarList from "../components/me/meInfo/StarList.vue"
// import Dressing from '../components/best/Dressing.vue'
// import Emotion from '../components/best/Emotion.vue'
// import Filmtelevision from '../components/best/Filmtelevision.vue'
// import Fitness from '../components/best/Fitness.vue'
// import Game from '../components/best/Game.vue'
// import Gastronomy from '../components/best/Gastronomy.vue'
// import MakeUp from '../components/best/MakeUp.vue'
// import Shome from '../components/best/Shome.vue'
// import Travel from '../components/best/Travel.vue'
// import WorkPlace from '../components/best/WorkPlace.vue'
import Recommend from '../components/best/Recommend.vue'
import { compact } from 'lodash-es'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path: '/',
            redirect: '/Discover' // 重定向到 /Discover
          },
        {
            path:'/Discover',
            component:Discover,

            // children:[
            //     {
            //         path:'Dressing',
            //         component:Dressing
            //     },
            //     {
            //         path:'Emotion',
            //         component:Emotion
            //     },
            //     {
            //         path:'Filmtelevision',
            //         component:Filmtelevision
            //     },
            //     {
            //         path:'Fitness',
            //         component:Fitness
            //     },
            //     {
            //         path:'Game',
            //         component:Game
            //     },
            //     {
            //         path:'Gastronomy',
            //         component:Gastronomy
            //     },
            //     {
            //         path:'MakeUp',
            //         component:MakeUp
            //     },
            //     {
            //         path:'Shome',
            //         component:Shome
            //     },
            //     {
            //         path:'Travel',
            //         component:Travel
            //     },
            //     {
            //         path:'WorkPlace',
            //         component:WorkPlace
            //     },
            //     {
            //         path:'Recommend',
            //         component:Recommend
            //     },
            // ]
        },
        {
            path:'/Publish',
            component:Publish
        },
        {
            path:'/Notify',
            component:Notify
        },
        {
            path:'/Me',
            component:Me,
            children:[
                {
                    path:'LikeList',
                    component:LikeList
                },
                {
                    path:'Note',
                    component:Note
                },
                {
                    path:'StarList',
                    component:StarList
                },
                
            ]
        }
    ]
})
export default router