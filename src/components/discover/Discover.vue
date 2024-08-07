<script setup>
import { reactive, onMounted } from 'vue';
import object from 'lodash-es/object';
import subArticle from '../subArticle/subArticle.vue';
import articleApi from '../../api/articleApi'
// 定义文章列表和标题列表的响应式变量
let articleLists = reactive([]);
let titleList = reactive([
    { title: '推荐', routerlink: '/Discover/Recommend', value: 'Dressing' },
    { title: '穿搭', routerlink: '/Discover/Dressing', value: 'Dressing' },
    { title: '美食', routerlink: '/Discover/Gastronomy', value: 'Gastronomy' },
    { title: '彩妆', routerlink: '/Discover/MakeUp', value: 'MakeUp' },
    { title: '影视', routerlink: '/Discover/Filmtelevision', value: 'Filmtelevision' },
    { title: '职场', routerlink: '/Discover/Workplace', value: 'Workplace' },
    { title: '情感', routerlink: '/Discover/Emotion', value: 'Emotion' },
    { title: '家居', routerlink: '/Discover/Shome', value: 'Shome' },
    { title: '游戏', routerlink: '/Discover/Game', value: 'Game' },
    { title: '旅行', routerlink: '/Discover/Travel', value: 'Travel' },
    { title: '健身', routerlink: '/Discover/Fitness', value: 'Fitness' }
]);

// 定义过滤内容的异步函数
async function filterContent(value) {
    try {
        // let res = await axios.get(`http://localhost:8080/FilterContent/${value}`);
        let res = await articleApi.Filtercontent(value)
        object.assign(articleLists, res.data.data); // 更新文章列表
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// 设置激活的标题项，并过滤相应内容
const setActive = (item, value) => {
    articleLists.length = 0; // 清空文章列表
    filterContent(value); // 调用过滤内容函数
    titleList.forEach(title => {
        title.isActive = (title === item); // 设置激活状态
    });
};

// 组件挂载时初始化
onMounted(() => {
    titleList.forEach(item => {
        item.isActive = (item.title === '推荐'); // 设置推荐项为激活状态
    });
    filterContent("Dressing"); // 初始化推荐内容
});
</script>

<template>
    <div class="Discover-wrapper">
        <div class="title">
            <!-- 循环遍历标题列表，设置点击事件和样式 -->
            <span 
                v-for="item in titleList" 
                :key="item.title" 
                :class="{ 'title-inner': true, 'active': item.isActive }" 
                @click="setActive(item, item.value)">
                {{ item.title }}
            </span>
        </div>
        <transition name="fade">
            <div class="main-body">
                <!-- 循环遍历文章列表，渲染子组件 -->
                <subArticle 
                    v-for="articleList in articleLists" 
                    :article="articleList" 
                    :key="articleList.id">
                </subArticle>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease; /* 淡入淡出动画 */
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
/* 隐藏滚动条，但允许滚动 */
.main-body::-webkit-scrollbar {
    width: 0;
}
.main-body {
    width: 1177px;
    display: flex;
    flex-wrap: wrap;
    max-height: 75vh; /* 最大高度为视口高度的75% */
    overflow-y: auto; /* 溢出时显示滚动条 */
    justify-content: space-evenly;
}
.title {
    display: inline-flex; /* 将 display 设置为 inline-flex */
    justify-content: space-between;
    margin-bottom: 20px;
}
.title-inner {
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
.active {
    background-color: #f0f0f0; /* 更浅的背景色 */
    font-weight: bold; /* 加粗效果 */
}
</style>
