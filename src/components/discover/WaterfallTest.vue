<template>
  <div class="test-container">
    <h2>瀑布流懒加载测试</h2>
    <div class="test-controls">
      <button @click="addItems">添加20条数据</button>
      <button @click="clearItems">清空数据</button>
      <button @click="scrollToTop">回到顶部</button>
      <p>当前数据量: {{ testItems.length }}</p>
      <p>加载状态: {{ isLoading ? '加载中' : '空闲' }}</p>
      <p>是否有更多数据: {{ hasMore ? '是' : '否' }}</p>
    </div>
    
    <SimpleWaterfall
      ref="waterfallRef"
      :items="testItems"
      :columns="4"
      :gap="25"
      @load-more="handleLoadMore"
      @select-article="handleSelectArticle"
      @image-load="handleImageLoad"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SimpleWaterfall from './SimpleWaterfall.vue';

const waterfallRef = ref(null);
const testItems = ref([]);
const isLoading = ref(false);
const hasMore = ref(true);

// 生成测试数据
const generateTestItem = (index) => ({
  article_id: `test_${index}`,
  title: `测试文章 ${index}`,
  img_url: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1透明图片
  like_count: Math.floor(Math.random() * 100),
  star_count: Math.floor(Math.random() * 50)
});

// 初始化测试数据
const initTestData = () => {
  for (let i = 0; i < 20; i++) {
    testItems.value.push(generateTestItem(i));
  }
};

// 添加更多测试数据
const addItems = () => {
  const startIndex = testItems.value.length;
  for (let i = 0; i < 20; i++) {
    testItems.value.push(generateTestItem(startIndex + i));
  }
};

// 清空数据
const clearItems = () => {
  testItems.value = [];
  hasMore.value = true;
};

// 处理加载更多
const handleLoadMore = async () => {
  console.log('触发加载更多');
  isLoading.value = true;
  
  // 模拟异步加载
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 添加新数据
  const startIndex = testItems.value.length;
  for (let i = 0; i < 20; i++) {
    testItems.value.push(generateTestItem(startIndex + i));
  }
  
  // 模拟没有更多数据的情况（当数据量达到100条时）
  if (testItems.value.length >= 100) {
    hasMore.value = false;
  }
  
  isLoading.value = false;
  
  return {
    success: true,
    hasMore: hasMore.value
  };
};

// 处理文章选择
const handleSelectArticle = (item) => {
  console.log('选择文章:', item);
};

// 处理图片加载
const handleImageLoad = (articleId) => {
  console.log('图片加载完成:', articleId);
};

// 回到顶部
const scrollToTop = () => {
  if (waterfallRef.value) {
    waterfallRef.value.scrollToTop();
  }
};

onMounted(() => {
  initTestData();
});
</script>

<style scoped>
.test-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-controls {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.test-controls button {
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.test-controls button:hover {
  background-color: #0056b3;
}

.test-controls p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}
</style>
