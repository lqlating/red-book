<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router';
import Login from "../login/Login.vue";
import { ref, watch } from 'vue';
import { userInfoStore } from "../../store/user";
import { storeToRefs } from 'pinia';
import Loged from '../loged/Loged.vue';

const userStore = userInfoStore();
const { isLogin, userThing } = storeToRefs(userStore);
let showLogin = ref(false);
const router = useRouter();

const closeDialog = () => {
  showLogin.value = false;
}

const updateShowLogin = (value: boolean) => {
  showLogin.value = value; // 更新showLogin的值
}

// 监控 isLogin 的变化，当其变为 true 时，跳转到 /Me 路由
watch(isLogin, (newValue) => {
  if (newValue) {
    router.push('/Me');
  }
});
</script>

<template>
  <div>
    <div class="outer-overlay" v-if="showLogin" @click="closeDialog">
      <div class="inner-overlay" @click.stop>
        <Login :showLogin="showLogin" class="Login" @update:showLogin="updateShowLogin"></Login>
      </div>
    </div>

    <div class="mainBody-wrapper">
      <div class="navigate">
        <RouterLink to="/Discover" active-class="active" class="my-txt">
          <span class="txt-inner"><img class="icon" src="../../assets/img/House.png">发现</span>
        </RouterLink>
        <RouterLink to="/Publish" active-class="active" class="my-txt">
          <span class="txt-inner"><img class="icon" src="../../assets/img/shizikuang.png" alt="">发布</span>
        </RouterLink>
        <RouterLink to="/Notify" active-class="active" class="my-txt">
          <span class="txt-inner"><img class="icon" src="../../assets/img/ringlingsheng.png" alt="">通知</span>
        </RouterLink>
        <RouterLink v-if="isLogin" to="/Me" active-class="active" class="my-txt">
          <span class="txt-inner"><img class="icon me" :src="userThing.avatar" alt=""> 我</span>
        </RouterLink>
        <div v-if="!isLogin" class="login" @click="showLogin = true">登录</div>
      </div>

      <div class="main-content">
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色遮罩层 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 使遮罩层在最顶层 */
}

.inner-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
}

.Login {
  width: 400px; /* 登录框的宽度 */
  height: 240px; /* 登录框的高度 */
  background-color: #fff;
  border-radius: 20px;
}

.mainBody-wrapper {
  display: flex;
}

.icon {
  margin-right: 5px;
  margin-bottom: -3px;
  width: 20px;
  height: 20px;
}

.me {
  border-radius: 50%;
}

img {
  width: 100px;
  height: 100px;
}

.navigate {
  display: flex;
  flex-direction: column;
  width: 20%;
  align-items: center;
}

.navigate a {
  text-decoration: none;
  border-radius: 20px; /* 设置圆角 */
  color: #333; /* 设置链接颜色 */
}

.navigate a.active {
  background-color: #f0f0f0; /* 激活时的背景颜色 */
}

.mainBody-wrapper .navigate .login {
  color: #fff;
}

.my-txt {
  font-weight: bold;
  padding-left: 10px;
  font-size: 16px;
  display: flex;
  align-items: center; /* 垂直居中 */
  height: 48px;
  width: 209px;
  margin-bottom: 5px;
}

.login {
  background-color: #ff2e4d;
  font-size: 18.4px;
  display: flex;
  align-items: center; /* 垂直居中 */
  height: 48px;
  width: 219px;
  border-radius: 20px;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  
  cursor: pointer;
  font-weight: bold;
}
</style>
