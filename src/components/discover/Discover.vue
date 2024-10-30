<script setup>
import { ref, onMounted, watch } from 'vue';
import { articleStore } from '../../store/article'; // 引入文章的 Pinia store
import { commentInfoStore } from '../../store/comment'; // 引入评论的 Pinia store
import { searchStore } from '../../store/search'; // 引入搜索 Store
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';
import ArticleInner from '../subArticle/article_inner.vue';
import Like_button from '../subArticle/like_button.vue';
import { storeToRefs } from 'pinia';
import UserList from './UserList.vue';

const articleData = articleStore();
const { filterContent, articleLists } = articleData;
const commentStore = commentInfoStore();
const { getCommentCount, getComments } = commentStore;

const searchData = searchStore();
const { userList } = storeToRefs(searchData);
const { searchArticleByTitleOrContent, searchUserByUsername } = searchData;
const { isSearch, searchArticle } = storeToRefs(searchData);
const selectedArticle = ref(null);

// 用于控制图片加载的过渡效果
const imageLoaded = ref({});

// 当图片加载完成后触发，更新加载状态
function handleImageLoad(articleId) {
  imageLoaded.value[articleId] = true;
}

const titleList = ref([
  { title: '推荐', value: 'Dressing' },
  { title: '穿搭', value: 'Dressing' },
  { title: '美食', value: 'Gastronomy' },
  { title: '彩妆', value: 'MakeUp' },
  { title: '影视', value: 'Filmtelevision' },
  { title: '职场', value: 'Workplace' },
  { title: '情感', value: 'Emotion' },
  { title: '家居', value: 'Shome' },
  { title: '游戏', value: 'Game' },
  { title: '旅行', value: 'Travel' },
  { title: '健身', value: 'Fitness' }
]);

// 定义 newTitleList
const newTitleList = ref([
  { title: '文章', value: 'Articles' },
  { title: '用户', value: 'Users' }
]);

const breakpoints = ref({
  1200: { rowPerView: 5 },
  800: { rowPerView: 3 },
  500: { rowPerView: 2 }
});

// 选择文章并获取评论
function selectArticle(item) {
  if (selectedArticle.value === item) {
    selectedArticle.value = null;
  } else {
    selectedArticle.value = item;
    getCommentCount(item.article_id);
    getComments(item.article_id);
  }
}

function closeArticleInner() {
  selectedArticle.value = null;
}

// 设置激活的标签并过滤文章或搜索
const setActive = (item, value) => {
  if (isSearch.value) {
    if (value === 'Articles') {
      searchArticle.value = true;
    } else if (value === 'Users') {
      searchArticle.value = false;
    }
  } else {
    filterContent(value);
  }
  // 更新激活状态
  const listToUpdate = isSearch.value ? newTitleList.value : titleList.value;
  listToUpdate.forEach(title => {
    title.isActive = (title === item);
  });
};

// 监听 isSearch 的变化，当切换为 true 时，激活 "文章"
watch(isSearch, (newValue) => {
  if (newValue) {
    const articlesItem = newTitleList.value.find(item => item.value === 'Articles');
    if (articlesItem) {
      setActive(articlesItem, articlesItem.value); // 自动触发点击事件，使“文章”激活
    }
  }
});

// 页面挂载时默认加载 "推荐" 文章
onMounted(async () => {
  titleList.value.forEach(item => {
    item.isActive = (item.title === '推荐');
  });
  await filterContent("Dressing");
});
</script>

<template>
  <div class="Discover-wrapper">
    <div class="title">
      <!-- 根据 isSearch 的状态动态展示 titleList 或 newTitleList -->
      <span v-for="item in (isSearch ? newTitleList : titleList)" :key="item.title" :class="{ 'title-inner': true, 'active': item.isActive }"
        @click="setActive(item, item.value)">
        {{ item.title }}
      </span>
    </div>
    <transition name="fade">
      <div class="main-body">
        <!-- 如果 searchArticle 为 true 表示在搜索文章 -->
        <template v-if="searchArticle">
          <!-- 如果文章列表为空，显示“没有相应文章”的提示 -->
          <div v-if="articleLists.length === 0" class="no-articles">
            没有相应文章
          </div>
          <!-- 否则展示文章列表 -->
          <Waterfall v-else :list="articleLists" :breakpoints="breakpoints" :gutter="25">
            <template #item="{ item }">
              <div class="card">
                <!-- 包裹 LazyImg 的过渡效果 -->
                <transition name="fade">
                  <!-- 将 Base64 编码图片以正确的格式传递给 LazyImg -->
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
        
        <!-- 如果 searchArticle 为 false，显示 UserList -->
        <UserList v-else />
      </div>
    </transition>
    <ArticleInner v-if="selectedArticle" :article="selectedArticle" :article_inner="true" :close="closeArticleInner" />
  </div>
</template>

<style scoped>
/* 样式保持不变 */
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
