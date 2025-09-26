<template>
  <div class="test-container">
    <h2>Discover组件测试</h2>
    <p>测试瀑布流布局和懒加载功能</p>
    
    <!-- 直接使用Discover组件进行测试 -->
    <Discover />
  </div>
</template>

<script setup>
import Discover from './Discover.vue';
</script>

<style scoped>
.test-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 20px;
}
</style>
