<script setup>
import { reactive, ref, onMounted } from 'vue';
import articleApi from '../../api/articleApi';
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';
import ArticleInner from '../subArticle/article_inner.vue';
import { commentInfoStore } from '../../store/comment';
import Like_button from '../subArticle/like_button.vue'

const commentStore = commentInfoStore();
const { getCommentCount, getComments } = commentStore;

const articleLists = reactive([]);
const titleList = reactive([
  { title: '推荐', routerlink: '/Discover/Recommend', value: 'Dressing' },
  { title: '穿搭', routerlink: '/Discover/Dressing', value: 'Dressing' },
  { title: '美食', routerlink: '/Discover/Gastronomy', value: 'Gastronomy' },
  { title: '彩妆', routerlink: '/Discover/MakeUp', value: 'MakeUp' },
  { title: '影视', routerlink: '/Discover/Filmtelevision', value: 'Filmtelevision' },
  { title: '职场', routerlink: '/Discover/Workplace', value: 'Workplace' },
  { title: '情感', routerlink: '/Discover/Emotion', value: 'Emotion' },
  { title: '家居', routerlink: '/Discover/Shome', value: 'Shome' },
  { title: '游戏', routerlink: '/Discover/Game', value: 'Game' },
  { title: '旅行', routerlink: '/Discover/Travel', value: 'Travel' },
  { title: '健身', routerlink: '/Discover/Fitness', value: 'Fitness' }
]);

const selectedArticle = ref(null);

async function filterContent(value) {
  try {
    let res = await articleApi.Filtercontent(value);
    Object.assign(articleLists, res.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const setActive = (item, value) => {
  articleLists.length = 0; 
  filterContent(value);
  titleList.forEach(title => {
    title.isActive = (title === item);
  });
};

const breakpoints = ref({
  1200: { rowPerView: 5 },
  800: { rowPerView: 3 },
  500: { rowPerView: 2 }
});

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

onMounted(() => {
  titleList.forEach(item => {
    item.isActive = (item.title === '推荐');
  });
  filterContent("Dressing");
});
</script>

<template>
  <div class="Discover-wrapper">
    <div class="title">
      <span v-for="item in titleList" :key="item.title" :class="{ 'title-inner': true, 'active': item.isActive }"
            @click="setActive(item, item.value)">
        {{ item.title }}
      </span>
    </div>
    <transition name="fade">
      <div class="main-body">
        <Waterfall :list="articleLists" :breakpoints="breakpoints" :gutter="25">
          <template #item="{ item, url, index }">
            <div>
              <div class="card">
                <LazyImg class="lazy" :url="item.img_url" @click="selectArticle(item)" />
                <p class="text" @click="selectArticle(item)">{{ item.title }}</p>
                <Like_button :item="item" />
              </div>
            </div>
          </template>
        </Waterfall>
      </div>
    </transition>
    <ArticleInner v-if="selectedArticle" :article="selectedArticle" :article_inner="true" :close="closeArticleInner" />
  </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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
  display: flex;
  flex-wrap: wrap;
  max-height: 75vh;
  overflow-y: auto;
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
</style>
