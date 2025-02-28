<script setup>
import { ref, onMounted, watch } from 'vue';
import { articleStore } from '../../store/article'; // 文章 Store
import { commentInfoStore } from '../../store/comment'; // 评论 Store
import { searchStore } from '../../store/search'; // 搜索 Store
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';
import ArticleInner from '../subArticle/article_inner.vue';
import Like_button from '../subArticle/like_button.vue';
import { storeToRefs } from 'pinia';
import UserList from './UserList.vue';
import { titleStore } from '../../store/title'; // 引入 titleStore
import { userInfoStore } from '../../store/user'; // 引入 userInfoStore

// 获取 userInfoStore 中的 isLogin 和 showLogin
const userInfo = userInfoStore();
const { isLogin, showLogin } = storeToRefs(userInfo);

const articleData = articleStore();
const { filterContent, articleLists } = articleData;
const commentStore = commentInfoStore();
const { getCommentCount, getComments } = commentStore;

const searchData = searchStore();
const { isSearch, searchArticle } = storeToRefs(searchData);

const selectedArticle = ref(null);
const imageLoaded = ref({});

// 监听图片加载状态
function handleImageLoad(articleId) {
  imageLoaded.value[articleId] = true;
}

// 使用 titleStore
const titleData = titleStore();
const { titleList, fetchAllTitles } = storeToRefs(titleData);
const { fetchAllTitles: fetchTitles } = titleData;

// 定义新的标题列表（搜索时）
const newTitleList = ref([
  { title: '文章', value: 'Articles', isActive: false },
  { title: '用户', value: 'Users', isActive: false }
]);

const breakpoints = ref({
  1200: { rowPerView: 5 },
  800: { rowPerView: 3 },
  500: { rowPerView: 2 }
});

// 选择文章并获取评论
function selectArticle(item) {
  if (!isLogin.value) {
    showLogin.value = true; // 弹出登录框
    return;
  }

  if (selectedArticle.value === item) {
    selectedArticle.value = null;
  } else {
    selectedArticle.value = item;
    getCommentCount(item.article_id);
    getComments(item.article_id);
  }
}

// 关闭文章详情
function closeArticleInner() {
  selectedArticle.value = null;
}

// 设置激活的分类
const setActive = (item, value) => {
  if (isSearch.value) {
    searchArticle.value = value === 'Articles';
  } else {
    filterContent(value);
  }

  const listToUpdate = isSearch.value ? newTitleList.value : titleList.value;
  listToUpdate.forEach(title => {
    title.isActive = title.title === item.title;
  });
};

// 监听 isSearch 变化，切换搜索模式时默认激活 "文章"
watch(isSearch, (newValue) => {
  if (newValue) {
    const articlesItem = newTitleList.value.find(item => item.value === 'Articles');
    if (articlesItem) {
      setActive(articlesItem, articlesItem.value);
    }
  }
});

// 页面加载时，获取标题，并默认激活 "言情" 分类
onMounted(async () => {
  await fetchTitles(); // 获取所有分类
  const defaultTitle = titleList.value.find(item => item.value === 'Romance');
  if (defaultTitle) {
    setActive(defaultTitle, defaultTitle.value);
  }
});
</script>

<template>
  <div class="Discover-wrapper">
    <div class="title">
      <!-- 根据 isSearch 切换 titleList 或 newTitleList -->
      <span
        v-for="item in (isSearch ? newTitleList : titleList)"
        :key="item.title"
        :class="{ 'title-inner': true, 'active': item.isActive }"
        @click="setActive(item, item.value)"
      >
        {{ item.title }}
      </span>
    </div>
    <transition name="fade">
      <div class="main-body">
        <!-- 如果在搜索文章 -->
        <template v-if="searchArticle">
          <div v-if="articleLists.length === 0" class="no-articles">
            没有相应文章
          </div>
          <Waterfall v-else :list="articleLists" :breakpoints="breakpoints" :gutter="25">
            <template #item="{ item }">
              <div class="card">
                <transition name="fade">
                  <LazyImg
                    class="lazy"
                    :url="`data:image/png;base64,${item.img_url}`"
                    @load="handleImageLoad(item.article_id)"
                    :key="item.article_id + '-img'"
                    v-show="imageLoaded[item.article_id]"
                    @click="selectArticle(item)"
                  />
                </transition>
                <p class="text" @click="selectArticle(item)">{{ item.title }}</p>
                <Like_button :item="item" :key="item.article_id + '-like'" :out="true" />
              </div>
            </template>
          </Waterfall>
        </template>

        <!-- 如果搜索的是用户 -->
        <UserList v-else />
      </div>
    </transition>
    <ArticleInner
      v-if="selectedArticle"
      :article="selectedArticle"
      :article_inner="true"
      :close="closeArticleInner"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.main-body::-webkit-scrollbar {
  width: 0;
}

.main-body {
  width: 100%;
  max-height: 75vh;
  overflow-y: auto;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.title {
  display: inline-flex;
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
  background-color: #f0f0f0;
  font-weight: bold;
}

.lazy {
  border: 0.1px solid rgb(231, 227, 227);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.lazy:hover {
  transform: scale(1.05);
}

.lazy::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.lazy:hover::after {
  opacity: 1;
}

.text {
  color: #333333;
  font-size: 14px;
  padding: 0 10px;
  word-break: break-all;
  overflow: hidden;
}

.no-articles {
  margin: 200px;
  text-align: center;
  color: #888;
  font-size: 16px;
  padding: 20px;
}
</style>