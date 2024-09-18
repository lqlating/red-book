<template>
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
          <!-- 图片的 v-show 绑定加载状态 -->
          <LazyImg class="lazy" :url="item.img_url" @load="handleImageLoad(item.article_id)"
            :key="item.article_id + '-img'" v-show="imageLoaded[item.article_id]" @click="selectArticle(item)" />
        </transition>
        <!-- 文章标题 -->
        <p class="text" @click="selectArticle(item)">{{ item.title }}</p>
        <!-- 点赞按钮组件 -->
        <Like_button :item="item" :key="item.article_id + '-like'" />
      </div>
    </template>
  </Waterfall>

  <!-- 文章详情显示 -->
  <ArticleInner v-if="selectedArticle" :article="selectedArticle" :article_inner="true" :close="closeArticleInner" />
</template>

<script setup>
import { ref } from 'vue';
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
import ArticleInner from '../subArticle/article_inner.vue';
import Like_button from '../subArticle/like_button.vue';

// 接收 props，包含文章列表
const props = defineProps({
  articleLists: {
    type: Array,
    default: () => []
  }
});

// 响应式存储图片加载状态
const imageLoaded = ref({});
// 选中的文章
const selectedArticle = ref(null);

// 配置瀑布流的断点
const breakpoints = ref({
  1200: { rowPerView: 5 },
  800: { rowPerView: 3 },
  500: { rowPerView: 2 }
});

// 图片加载完成时更新状态
function handleImageLoad(articleId) {
  imageLoaded.value[articleId] = true;
}

// 选择文章时更新选中的文章
function selectArticle(item) {
  if (selectedArticle.value === item) {
    selectedArticle.value = null;
  } else {
    selectedArticle.value = item;
  }
}

// 关闭文章详情视图
function closeArticleInner() {
  selectedArticle.value = null;
}
</script>

<style scoped>
.no-articles {
  margin: 200px;
  text-align: center;
  color: #888;
  font-size: 16px;
  padding: 20px;
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
