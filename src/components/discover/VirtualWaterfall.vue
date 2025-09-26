<template>
  <div class="virtual-waterfall-container" ref="containerRef" @scroll="handleScroll">
    <!-- 简化的瀑布流布局 -->
    <div class="waterfall-grid" :style="gridStyle">
      <div
        v-for="(item, index) in visibleItems"
        :key="item.article_id"
        class="waterfall-item"
        :style="getItemStyle(index)"
      >
        <div class="card">
          <transition name="fade">
            <img 
              class="lazy" 
              :src="`data:image/png;base64,${item.img_url}`"
              @load="handleImageLoad(item.article_id)" 
              :key="item.article_id + '-img'"
              v-show="imageLoaded[item.article_id]" 
              @click="selectArticle(item)"
              loading="lazy"
              alt="文章图片"
            />
          </transition>
          <p class="text" @click="selectArticle(item)">{{ item.title }}</p>
          <Like_button :item="item" :key="item.article_id + '-like'" :out="true" />
        </div>
      </div>
    </div>

    <!-- 加载指示器 -->
    <div v-if="isLoading" class="loading-indicator">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 没有更多数据提示 -->
    <div v-if="!hasMore && items.length > 0" class="no-more-data">
      没有更多内容了
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import Like_button from '../subArticle/like_button.vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  itemHeight: {
    type: Number,
    default: 200 // 预估的单个项目高度
  },
  columns: {
    type: Number,
    default: 4 // 列数
  },
  gap: {
    type: Number,
    default: 25 // 间距
  },
  containerHeight: {
    type: Number,
    default: 600 // 容器高度
  },
  bufferSize: {
    type: Number,
    default: 5 // 缓冲区大小
  }
});

const emit = defineEmits(['loadMore', 'selectArticle', 'imageLoad']);

// 响应式数据
const containerRef = ref(null);
const imageLoaded = ref({});
const isLoading = ref(false);
const hasMore = ref(true);
const scrollTop = ref(0);

// 计算属性
// 简化的虚拟滚动实现
const visibleItems = computed(() => {
  // 暂时返回所有项目，后续可以优化为真正的虚拟滚动
  return props.items;
});

const gridStyle = computed(() => {
  const columnWidth = `calc((100% - ${(props.columns - 1) * props.gap}px) / ${props.columns})`;
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.columns}, ${columnWidth})`,
    gap: `${props.gap}px`,
    width: '100%'
  };
});

// 方法
const handleScroll = () => {
  if (!containerRef.value) return;
  
  scrollTop.value = containerRef.value.scrollTop;
  
  // 检查是否需要加载更多数据
  const scrollBottom = containerRef.value.scrollTop + containerRef.value.clientHeight;
  const scrollHeight = containerRef.value.scrollHeight;
  const threshold = scrollHeight - 200; // 距离底部200px时开始加载
  
  if (scrollBottom >= threshold && hasMore.value && !isLoading.value) {
    loadMore();
  }
};

const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return;
  
  isLoading.value = true;
  try {
    await emit('loadMore');
  } finally {
    isLoading.value = false;
  }
};

const handleImageLoad = (articleId) => {
  imageLoaded.value[articleId] = true;
  emit('imageLoad', articleId);
};

const selectArticle = (item) => {
  emit('selectArticle', item);
};

const getItemStyle = (index) => {
  return {
    height: `${props.itemHeight}px`,
    width: '100%'
  };
};

// 监听items变化，重置状态
watch(() => props.items.length, (newLength, oldLength) => {
  if (newLength === 0) {
    hasMore.value = true;
  }
  // 如果新加载的数据少于预期，说明没有更多数据了
  if (oldLength > 0 && newLength === oldLength) {
    hasMore.value = false;
  }
});

// 暴露方法给父组件
defineExpose({
  scrollToTop: () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0;
    }
  },
  setHasMore: (value) => {
    hasMore.value = value;
  }
});
</script>

<style scoped>
.virtual-waterfall-container {
  width: 100%;
  max-height: 75vh;
  overflow-y: auto;
  position: relative;
}

.virtual-waterfall-container::-webkit-scrollbar {
  width: 0;
}

.waterfall-grid {
  width: 100%;
  padding: 20px;
}

.waterfall-item {
  break-inside: avoid;
  margin-bottom: 20px;
}

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.lazy {
  border: 0.1px solid rgb(231, 227, 227);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  flex: 1;
  width: 100%;
  height: auto;
  object-fit: cover;
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
  padding: 8px 10px;
  word-break: break-all;
  overflow: hidden;
  flex-shrink: 0;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-more-data {
  text-align: center;
  padding: 20px;
  color: #888;
  font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
