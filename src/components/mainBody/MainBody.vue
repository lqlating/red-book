<template>
  <div>
    <div class="outer-overlay" v-if="showLogin" @click="closeDialog">
      <div class="inner-overlay" @click.stop>
        <Login :showLogin="showLogin" class="Login" @update:showLogin="updateShowLogin"></Login>
      </div>
    </div>

    <div class="mainBody-wrapper">
      <div class="navigate">
        <!-- 新增的商场入口 -->
        
        <RouterLink to="/Discover" active-class="active" class="my-txt" @click="setIsSearchFalse">
          <span class="txt-inner">
            <img class="icon" src="@/assets/img/House.png" alt=""> 广场
          </span>
        </RouterLink>
        <RouterLink to="/Market" active-class="active" class="my-txt" @click="setIsSearchFalse">
          <span class="txt-inner">
            <img class="icon" src="@/assets/img/wallet.png" alt=""> 商场
          </span>
        </RouterLink>
        <RouterLink to="/Cart" active-class="active" class="my-txt" @click="setIsSearchFalse">
          <span class="txt-inner">
            <img class="icon" src="@/assets/img/cart.png" alt=""> 购物车
          </span>
        </RouterLink>
        <RouterLink to="/Publish" active-class="active" class="my-txt">
          <span class="txt-inner">
            <img class="icon" src="@/assets/img/shizikuang.png" alt=""> 发布
          </span>
        </RouterLink>
        <RouterLink to="/Notify/becomment" active-class="active" class="my-txt">
          <span class="txt-inner">
            <img class="icon" src="@/assets/img/ringlingsheng.png" alt=""> 通知
          </span>
        </RouterLink>
        <RouterLink v-if="isLogin" to="/Me/Note" active-class="active" class="my-txt">
          <span class="txt-inner">
            <img class="icon me" :src="userThing.avatar" alt=""> 我
          </span>
        </RouterLink>
        <div v-if="!isLogin" class="login" @click="showLogin = true">登录</div>
        <div 
          ref="moreButton"
          @click="showDropDown"
          class="more"
          :class="['my-txt']"
        >
          <img class="more_pic" src="@/assets/img/more_.png" alt="">
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

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Login from "../login/Login.vue";
import { userInfoStore } from "../../store/user";
import { storeToRefs } from 'pinia';
import { searchStore } from "@/store/search";  
import { articleStore } from '../../store/article';

const useArticleStore = articleStore();
const { filterContent } = useArticleStore;
const userStore = userInfoStore();
const { isLogin, userThing, showLogin } = storeToRefs(userStore);
const search = searchStore();
const { isSearch } = storeToRefs(search);  

const router = useRouter();
const route = useRoute();

const closeDialog = () => {
  showLogin.value = false;
}

const externalLink = "http://localhost:5174/";

const isActive = computed(() => route.fullPath === '/Publish');

const showDrop = ref(false);
const dropDownPosition = ref({ top: 0, left: 0 });

const moreButton = ref(null);

const showDropDown = () => {
  showDrop.value = !showDrop.value;
  nextTick(() => {
    if (moreButton.value) {
      const rect = moreButton.value.getBoundingClientRect();
      dropDownPosition.value = {
        top: rect.top - 200, 
        left: rect.left
      };
    }
  });
};

const updateShowLogin = (value) => {
  showLogin.value = value; 
}

const setIsSearchFalse = () => {
  isSearch.value = false;
  filterContent("Dressing")
}

watch(isLogin, (newValue) => {
  if (newValue) {
    router.push('/Me');
  }
});

const logout = () => {
  userStore.logout();
  showDrop.value = false;
  router.push('/Discover'); 
};

const handleOutsideClick = (event) => {
  if (showDrop.value && !moreButton.value?.contains(event.target)) {
    showDrop.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  if (route.path !== '/Discover') {
    router.push('/Discover');
  }
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.inner-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
}

.Login {
  outline: none;
  width: 400px;
  height: 240px;
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
  border-radius: 20px;
  color: #333;
}

.navigate a.active {
  background-color: #f0f0f0;
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
  align-items: center;
  height: 48px;
  width: 209px;
  margin-bottom: 5px;
  cursor: pointer;
}

.my-txt.active {
  background-color: #f0f0f0;
}

.login {
  background-color: #ff2e4d;
  font-size: 18.4px;
  display: flex;
  align-items: center;
  height: 48px;
  width: 219px;
  border-radius: 20px;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
}

.more {
  margin-top: 300px;
}

.more:hover {
  background-color: #f0f0f0;
}

.more_pic {
  margin-right: 5px;
  width: 20px;
  height: 20px;
}

.drop-down2 {
  width: 209px;
  background-color: white;
  border-radius: 10px;
  position: absolute;
  padding: 5px;
  border: 1px solid #f0f0f0;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.more-inner {
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  color: #888888;
}

.more-inner:hover {
  background-color: #f0f0f0;
}

.my-txt:hover {
  background-color: #f0f0f0;
}
</style>
