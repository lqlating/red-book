<template>
  <div class="container">
    <div class="main-part">
      <span class="avatar-wrapper"><img class="avatar" :src="avatar"></span>
      <span class="info-thing">
        <div class="username">{{ username }}</div>
        <div class="id">小红书号:{{ id }}</div>
        <div class="intro" v-if="introduction != undefined">{{ introduction }}</div>
        <div class="intro" v-if="introduction == undefined">还没有简介</div>
        <div v-if="gender == '男'"><img class="gender" src="../../assets/img/male.png" alt=""></div>
        <div v-if="gender == '女'"><img class="gender" src="../../assets/img/female.png" alt=""></div>

        <div class="subscript-thing" v-if="!isLoading">
          <span class="subscript-detail" style="color: #33333399;">关注 {{ userStats.subscriptionsCount }}</span>
          <span class="subscript-detail" style="color: #33333399;">粉丝 {{ userStats.fansCount }}</span>
          <span class="subscript-detail" style="color: #33333399;">获赞与收藏 {{ userStats.likesAndStarsCount }}</span>
        </div>
      </span>
    </div>

    <!-- 按钮组 -->
    <div class="sticky-buttons">
      <RouterLink to="/Me/Note" active-class="active" class="Lbutton">笔记</RouterLink>
      <RouterLink to="/Me/StarList" active-class="active" class="Lbutton">收藏</RouterLink>
      <RouterLink to="/Me/LikeList" active-class="active" class="Lbutton">点赞</RouterLink>
    </div>

    <!-- 路由视图 -->
    <div class="output">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { userInfoStore } from "../../store/user";
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import likeStarApi from '../../api/likeStarApi';
import subscriptApi from '../../api/subscriptApi';
import articleApi from '../../api/articleApi'; // 引入 articleApi

const userStore = userInfoStore();
const { userThing } = storeToRefs(userStore);
const { username, email, id, avatar, gender, introduction } = userThing.value;

const router = useRouter();
const isLoading = ref(true); // 新增一个变量来跟踪加载状态

// 定义 ref 变量来存储数据
const userStats = ref({
    fansCount: 0,
    subscriptionsCount: 0,
    likesAndStarsCount: 0,
});

const articles = ref([]); // 新增的容器，用于存放文章数据

onMounted(async () => {
    if (router.currentRoute.value.path === '/Me') {
        router.push('/Me/Note');
    }

    try {
        // 获取粉丝数量
        const fansResponse = await subscriptApi.getUserIdbyTargetId(id);
        userStats.value.fansCount = fansResponse.data.data.length;

        // 获取已订阅的用户数量
        const subscriptionsResponse = await subscriptApi.getTargetId(id);
        userStats.value.subscriptionsCount = subscriptionsResponse.data.data.length;

        // 获取用户文章
        const articlesResponse = await articleApi.getArticlesByAuthorId(id);
        articles.value = articlesResponse.data.data; // 假设返回的数据为文章数组

        // 提取 target_id 组成数组并调用 searchCount
        const targetIds = articles.value.map(article => article.article_id);
        
        if (targetIds.length > 0) {
            const likeCountResponse = await likeStarApi.searchCountByTargetIds(targetIds);
            userStats.value.likesAndStarsCount = likeCountResponse.data.data; // 假设返回的是点赞与收藏的数量
        }

        isLoading.value = false; // 数据加载完成，关闭加载状态
    } catch (error) {
        console.error("请求失败:", error);
    }
});
</script>

<style scoped>
/* 设置最大高度，并隐藏滚动条 */
.container {
  max-height: 600px; /* 设置最大高度 */
  overflow-y: scroll; /* 超出部分滚动 */
  scrollbar-width: none; /* 隐藏滚动条 */
  -ms-overflow-style: none; /* IE和Edge隐藏滚动条 */
}
.container::-webkit-scrollbar {
  display: none; /* Chrome和Safari隐藏滚动条 */
}

.avatar-wrapper {
  width: 210px;
  height: 147px;
}

.avatar {
  width: 147px;
  height: 147px;
  border-radius: 50%;
}

a {
  text-decoration: none;
}

.main-part {
  display: flex;
  width: 600.1px;
  height: 164px;
  margin: 0 288.45px;
  padding: 48px 0;
}

.username {
  font-size: 24px;
  color: #333;
  font-weight: bolder;
  margin-bottom: 5px;
}

.id {
  color: #33333399;
  font-size: 12px;
  margin-bottom: 10px;
}

.intro {
  font-size: 14px;
  margin-bottom: 5px;
}

.gender {
  width: 24px;
  height: 24px;
}

.subscript-thing {
  margin-bottom: 60px;
}

.subscript-detail {
  margin-right: 10px;
}

.subscript-inner {
  font-size: 14px;
  color: #33333399;
}

.active {
  font-weight: bolder;
  background-color: #f0f0f0;
}

.Lbutton {
  box-sizing: border-box;
  color: #333333cc;
  font-size: 16px;
  padding: 9px 16px;
  height: 40px; /* 保留原有高度 */
  border-radius: 16px;
}

/* 按钮组设置为 sticky，不改变高度 */
.sticky-buttons {
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 10;
  
  background-color: white; /* 确保背景色与页面一致 */
}

.article-list {
  margin-top: 20px;
}
</style>
