<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { userInfoStore } from "../../store/user";
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const userStore = userInfoStore();
const { userThing } = storeToRefs(userStore);
const { username, email, id, avatar, gender, introduction, fans, subscript } = userThing.value;

const router = useRouter();

onMounted(() => {
  if (router.currentRoute.value.path === '/Me') {
    router.push('/Me/Note');
  }
});
</script>

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
        <div class="subscript-thing">
          <span class="subscript-detail"><span class="subscript-inner">关注</span></span>
          <span class="subscript-detail"><span class="subscript-inner">粉丝</span></span>
          <span class="subscript-detail"><span class="subscript-inner">获赞与收藏</span></span>
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
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1000;
  
  background-color: white; /* 确保背景色与页面一致 */
}
</style>
