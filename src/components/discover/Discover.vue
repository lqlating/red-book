<script setup>
import axios from 'axios';
import { reactive,onMounted } from 'vue';
import object from 'lodash-es/object';
import subArticle from '../subArticle/subArticle.vue'
let articleLists = reactive([])
let titleList = reactive([
    {
        title:'推荐',
        routerlink:'/Discover/Recommend',
        value:'Dressing'

    },
    
    {
        title:'穿搭',
        routerlink:'/Discover/Dressing',
        value:'Dressing'

    },
    {
        title:'美食',
        routerlink:'/Discover/Gastronomy',
        value:'Gastronomy'

    },
    {
        title:'彩妆',
        routerlink:'/Discover/MakeUp',
        value:'MakeUp'

    },
    {
        title:'影视',
        routerlink:'/Discover/Filmtelevision',
        value:'Filmtelevision'

    },
    {
        title:'职场',
        routerlink:'/Discover/Workplace',
        value:'Workplace'

    },
    {
        title:'情感',
        routerlink:'/Discover/Emotion',
        value:'Emotion'

    },

    {
        title:'家居',
        routerlink:'/Discover/Shome',
        value:'Shome'

    },
    {
        title:'游戏',
        routerlink:'/Discover/Game',
        value:'Game'

    },
    {
        title:'旅行',
        routerlink:'/Discover/Travel',
        value:'Travel'

    },
    {
        title:'健身',
        routerlink:'/Discover/Fitness',
        value:'Fitness'

    },

])
async function filterContent(value) {
    try {
        let res = await axios.get(`http://localhost:8080/FilterContent/${value}`);
        
        object.assign(articleLists,res.data.data)
        
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const setActive = (item,value) => {
    //为什么？将下面这句代码放进filterContent则不能正常更新页面
    articleLists.length = 0;
    filterContent(value)
    titleList.forEach(title => {
        title.isActive = (title === item);
    });
};
onMounted(() => {
    // 设置其他项为未点击状态
    for (let item of titleList) {
        if (item.title == '推荐') {
            item.isActive = true;
        }else {
      item.isActive = false;
    }
    }
    filterContent("Dressing")

    
});
</script>
<template>
    <div class="Discover-wrapper">
        <div class="title">
            <span v-for="item in titleList" :key="item.title" :class="{ 'title-inner': true, 'active': item.isActive }" @click="setActive(item,item.value)">
                {{ item.title }}
            </span>
        </div>
        <transition name="fade">
            <div class="main-body" >
                <subArticle v-for="articleList in articleLists" :article="articleList" :key="articleList.id"></subArticle>
            </div>
        </transition>
    </div>
</template>
<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s ease;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    /* 隐藏滚动条，但允许滚动 */
    .main-body::-webkit-scrollbar {
        width: 0;  /* 隐藏滚动条宽度 */
    }

   
    .main-body{
        width: 1177px;
        display: flex;
        flex-wrap: wrap;
        max-height: 75vh; /* 最大高度为视口高度 */
        overflow-y: auto; /* 溢出时显示滚动条 */
        justify-content: space-evenly;
        
        

    }
    /* 消除超链接的下划线修饰 */
    .title a{
        text-decoration: none;
    }
  
    .title {
        display: inline-flex; /* 将 display 设置为 inline-flex */
        justify-content: space-between;
        margin-bottom: 20px;
}
    .title-inner{
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 64px;
        height: 40px;
        border-radius: 20px;
        font-weight: normal;
        transition: font-weight 0.3s ease;
        
    }
    .active{
        background-color: #f0f0f0; /* 更浅的背景色 */
        font-weight: bold; /* 加粗效果 */
    }
</style>