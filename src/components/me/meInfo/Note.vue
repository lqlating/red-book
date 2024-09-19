<template>
    <div v-if="articlesByAuthor.length === 0" class="publish_thing">
        <div><img class="no_publish" src="../../../assets/img/head.png" alt=""></div>
        <div class="no_publish_txt">你暂未发布任何笔记</div>
    </div>
    
        <ArticleDisplay v-else class="main-body" :articleLists="articlesByAuthor" />
    
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useLikeStore } from '../../../store/likeStar';
import { userInfoStore } from '../../../store/user';
import ArticleDisplay from '../../discover/ArticleDisplay.vue';

// 获取用户信息
const userStore = userInfoStore();
const userId = userStore.userThing.id;
console.log("用户ID:", userId);

// 从 store 中获取作者文章列表和获取文章的函数
const articleStore = useLikeStore();
const { articlesByAuthor } = storeToRefs(articleStore);
const { fetchArticlesByAuthorId } = articleStore;

// 当组件挂载时，检查作者文章列表是否为空，若为空则调用接口获取
onMounted(async () => {
  if (articlesByAuthor.value.length === 0) {
    try {
      await fetchArticlesByAuthorId(userId);
      console.log("获取到的作者文章列表:", articlesByAuthor.value);
    } catch (error) {
      console.error("获取作者文章时出错:", error);
    }
  }
});
</script>

<style scoped>
.publish_thing {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%; /* 保持内容在容器内部 */
    width: 100%; /* 保持内容在容器内部 */
}

.no_publish {
    height: 90px;
    width: 90px;
    border-radius: 50%;
    border: 1px solid #f0f0f0;
    margin-bottom: 16px; /* 在图片和文字之间添加间距 */
}

.no_publish_txt {
    font-size: 16px;
    color: #33333399;
}

.main-body {
   
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
</style>
