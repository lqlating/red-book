<template>
  <div class="main-body">
      <ArticleDisplay :articleLists="articles" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ArticleDisplay from '../../discover/ArticleDisplay.vue';
import { useLikeStore } from '../../../store/likeStar';
import articleApi from '../../../api/articleApi';
import { storeToRefs } from 'pinia';
import { userInfoStore } from '../../../store/user';

// 获取用户信息
const userStore = userInfoStore();
const userId = userStore.userThing.id;

// 获取点赞的文章ID
const likeStarStore = useLikeStore();
let { fetchLikedArticleIds } = likeStarStore;
let { likedArticleIds } = storeToRefs(likeStarStore);

// 创建一个 ref 来保存获取到的文章列表
const articles = ref([]);

// 当组件挂载时，检查点赞的文章ID列表是否为空，若为空则调用接口获取
onMounted(async () => {
try {
  // 如果点赞的文章 ID 列表为空，则调用 fetchLikedArticleIds 获取
  if (likedArticleIds.value.length === 0) {
    await fetchLikedArticleIds(userId);
  }

  // 如果点赞的文章 ID 列表不为空，获取文章数据
  if (likedArticleIds.value.length > 0) {
    const response = await articleApi.getArticlesByIds(likedArticleIds.value);
    articles.value = response.data.data; // 将返回的数据赋值给 articles
  } else {
    console.log("没有点赞的文章");
  }
} catch (error) {
  console.error("获取文章时出错:", error);
}
});
</script>

<style scoped>
.main-body {
  margin-top: 20px;
}
</style>
