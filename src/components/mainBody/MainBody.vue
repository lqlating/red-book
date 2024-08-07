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
        <a :href="externalLink" target="_blank" :class="['my-txt', isActive ? 'active' : '']">
          <span class="txt-inner"><img class="icon" src="../../assets/img/shizikuang.png" alt="">发布</span>
        </a>
        <RouterLink to="/Notify" active-class="active" class="my-txt">
          <span class="txt-inner"><img class="icon" src="../../assets/img/ringlingsheng.png" alt="">通知</span>
        </RouterLink>
        <RouterLink v-if="isLogin" to="/Me" active-class="active" class="my-txt">
          <span class="txt-inner"><img class="icon me" :src="userThing.avatar" alt=""> 我</span>
        </RouterLink>
        <div v-if="!isLogin" class="login" @click="showLogin = true">登录</div>
        <div 
          ref="moreButton"
          @click="showDropDown"
          class="more"
          :class="['my-txt']" 
        >
          <img class="more_pic" src="../../../src/assets/img/more_.png" alt="">
          更多
        </div>
        <div class="drop-down2" v-show="showDrop" :style="{ top: `${dropDownPosition.top}px`, left: `${dropDownPosition.left}px` }" @click.stop>
          <p class="more-inner">关于作者</p>
          <p class="more-inner">隐私、协议</p>
          <p class="more-inner" @click="logout">退出登录</p>
        </div>
      </div>

      <div class="main-content">
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Login from "../login/Login.vue";
import { userInfoStore } from "../../store/user";
import { storeToRefs } from 'pinia';

// 引入用户信息 store
const userStore = userInfoStore();
const { isLogin, userThing, showLogin } = storeToRefs(userStore);
const router = useRouter();
const route = useRoute();

const closeDialog = () => {
  showLogin.value = false;
}

const externalLink = "http://localhost:5174/";

// 计算当前路径是否是发布页面的链接
const isActive = computed(() => route.fullPath === '/Publish');

// 定义一个 ref 来控制 drop-down2 的显示
let showDrop = ref(false);
// 定义一个 ref 来保存 drop-down2 的位置
let dropDownPosition = ref({ top: 0, left: 0 });

// 获取 more 按钮的引用
const moreButton = ref<HTMLElement | null>(null);

const showDropDown = () => {
  showDrop.value = !showDrop.value;

  // 使用 nextTick 在 DOM 更新后获取按钮位置
  nextTick(() => {
    if (moreButton.value) {
      const rect = moreButton.value.getBoundingClientRect();
      dropDownPosition.value = {
        top: rect.top - 140, // 调整高度使其显示在按钮上方
        left: rect.left
      };
    }
  });
};

const updateShowLogin = (value: boolean) => {
  showLogin.value = value; // 更新 showLogin 的值
}

// 监控 isLogin 的变化，当其变为 true 时，跳转到 /Me 路由
watch(isLogin, (newValue) => {
  if (newValue) {
    router.push('/Me');
  }
});

// 添加登出方法
const logout = () => {
  userStore.logout();
  showDrop.value = false;
  router.push('/Discover'); // 可根据需要跳转到其他页面
};

// 点击下拉框外部时隐藏下拉框
const handleOutsideClick = (event: MouseEvent) => {
  if (showDrop.value && !moreButton.value?.contains(event.target as Node)) {
    showDrop.value = false;
  }
};

// 监听全局点击事件
onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.main-content {
  width: 1177px;
}
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
  border-radius: 20px;
  font-weight: bold;
  padding-left: 10px;
  font-size: 16px;
  display: flex;
  align-items: center; /* 垂直居中 */
  height: 48px;
  width: 209px;
  margin-bottom: 5px;
  cursor: pointer; /* 添加鼠标悬停效果 */
}

.my-txt.active {
  background-color: #f0f0f0; /* 激活时的背景颜色 */
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
.more{
  margin-top: 330px;
}
.more:hover{
  background-color: #f0f0f0;
}
.more_pic{
  margin-right: 5px;
  width: 20px;
  height: 20px;
}
.drop-down2 {
  width: 209px;
  height: auto;
  background-color: white;
  border-radius: 10px;
  position: absolute;
  padding: 5px;
  border: 1px solid #f0f0f0;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}
.more-inner:hover{
  background-color: #f0f0f0;
}
.more-inner{
  font-size: 16px;
  padding: 10px;
  margin: 0px;
  border-radius: 10px;
  color: #888888;
}
.my-txt:hover{
  background-color: #f0f0f0
}
</style>
