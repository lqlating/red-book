<script setup>
import { ref, onMounted, watch } from 'vue';
import { articleStore } from '../../store/article';
import { commentInfoStore } from '../../store/comment';
import { searchStore } from '../../store/search';
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';
import ArticleInner from '../subArticle/article_inner.vue';
import Like_button from '../subArticle/like_button.vue';
import { storeToRefs } from 'pinia';
import UserList from './UserList.vue';
import { titleStore } from '../../store/title';
import { userInfoStore } from '../../store/user';
import { useRoute } from 'vue-router';

// 获取当前路由
const route = useRoute();

// 获取用户信息
const userStore = userInfoStore();
const { isLogin, showLogin, userThing } = storeToRefs(userStore);

// 获取文章数据
const articleData = articleStore();
const { filterContent, articleLists } = articleData;

// 获取评论数据
const commentStore = commentInfoStore();
const { getCommentCount, getComments } = commentStore;

// 获取搜索数据
const searchData = searchStore();
const { isSearch, searchArticle } = storeToRefs(searchData);

const selectedArticle = ref(null);
const imageLoaded = ref({});

// 处理图片加载
function handleImageLoad(articleId) {
  imageLoaded.value[articleId] = true;
}

// 使用标题数据
const titleData = titleStore();
const { titleList, fetchAllTitles } = storeToRefs(titleData);
const { fetchAllTitles: fetchTitles } = titleData;

// 搜索时使用的标题列表
const newTitleList = ref([
  { title: '文章', value: 'Articles', isActive: true },
  { title: '用户', value: 'Users', isActive: false }
]);

const breakpoints = ref({
  1200: { rowPerView: 5 },
  800: { rowPerView: 3 },
  500: { rowPerView: 2 }
});

// 文章选择处理
function selectArticle(item) {
  console.log('点击了文章，当前登录状态:', isLogin.value);
  if (!isLogin.value) {
    console.log('用户未登录，尝试显示登录框');
    userStore.showLogin = true;
    console.log('设置后的 showLogin 值:', userStore.showLogin);
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

// 设置激活的标题
const setActive = (item, value) => {
  // 根据搜索状态确定行为
  if (isSearch.value) {
    searchArticle.value = value === 'Articles';
  } else {
    filterContent(value);
  }

  // 更新激活状态
  const listToUpdate = isSearch.value ? newTitleList.value : titleList.value;
  listToUpdate.forEach(title => {
    title.isActive = title.title === item.title;
  });
};

// 监听搜索状态变化
watch(isSearch, (newValue) => {
  if (newValue) {
    // 进入搜索模式，激活"文章"标签
    const articlesItem = newTitleList.value.find(item => item.value === 'Articles');
    if (articlesItem) {
      setActive(articlesItem, articlesItem.value);
    }
  } else {
    // 退出搜索模式，激活默认标签
    const defaultTitle = titleList.value.find(item => item.value === 'Romance');
    if (defaultTitle) {
      setActive(defaultTitle, defaultTitle.value);
    }
  }
});

// 监听路由变化
watch(() => route.path, (newPath) => {
  if (newPath === '/Discover' && !isSearch.value) {
    // 当路由为Discover且不是搜索状态，强制加载默认内容
    const defaultTitle = titleList.value.find(item => item.value === 'Romance');
    if (defaultTitle) {
      setActive(defaultTitle, defaultTitle.value);
    }
  }
});

// 页面加载
onMounted(async () => {
  await fetchTitles(); // 获取所有标题

  // 根据搜索状态设置默认激活标签
  if (!isSearch.value) {
    const defaultTitle = titleList.value.find(item => item.value === 'Romance');
    if (defaultTitle) {
      setActive(defaultTitle, defaultTitle.value);
    }
  } else {
    const articlesItem = newTitleList.value.find(item => item.value === 'Articles');
    if (articlesItem) {
      setActive(articlesItem, articlesItem.value);
    }
  }
});

// 打开文章详情
const openArticleDetail = (article) => {
  console.log('尝试打开文章详情，当前登录状态:', isLogin.value);
  if (!isLogin.value) {
    console.log('用户未登录，尝试显示登录框');
    userStore.showLogin = true;
    console.log('设置后的 showLogin 值:', userStore.showLogin);
    return;
  }
  selectedArticle.value = {
    image: `data:image/jpeg;base64,${article.img}`,
    title: article.title,
    author: article.author,
    content: article.content,
    author_id: article.authorId,
    article_id: article.articleId,
  };
};
</script>

<template>
  <!-- 保持原有模板不变 -->
  <div class="Discover-wrapper">
    <div class="title">
      <!-- 根据 isSearch 切换 titleList 或 newTitleList -->
      <span v-for="item in (isSearch ? newTitleList : titleList)" :key="item.title"
        :class="{ 'title-inner': true, 'active': item.isActive }" @click="setActive(item, item.value)">
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
                  <LazyImg class="lazy" :url="`data:image/png;base64,${item.img_url}`"
                    @load="handleImageLoad(item.article_id)" :key="item.article_id + '-img'"
                    v-show="imageLoaded[item.article_id]" @click="selectArticle(item)" />
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
    <ArticleInner v-if="selectedArticle" :article="selectedArticle" :article_inner="true" :close="closeArticleInner"
      :current-user-id="userThing.id" />
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