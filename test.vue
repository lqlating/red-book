<template>
  <div ref="containerRef" class="scroll-container" @scroll="onScroll">
    <!-- 占位 padding -->
    <div :style="{ height: topPadding + 'px' }"></div>

    <!-- 可见区域渲染 -->
    <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <div v-for="item in visibleItems" :key="item.id" class="card">
        <!-- 懒加载图片 -->
        <img
          v-lazy="item.img"
          :alt="item.title"
          class="card-img"
        />
        <p class="card-title">{{ item.title }}</p>
      </div>
    </div>

    <!-- 占位 padding -->
    <div :style="{ height: bottomPadding + 'px' }"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// 模拟数据（假设 1000 条）
const items = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  title: `Item ${i}`,
  img: `https://picsum.photos/seed/${i}/300/200`,
}));

const containerRef = ref(null);
const scrollTop = ref(0);
const containerHeight = ref(0);
const cardHeight = 220; // 卡片高度 + margin（固定值）
const cols = ref(1); // 动态列数

// 根据容器宽度计算列数
const updateCols = () => {
  if (containerRef.value) {
    const w = containerRef.value.clientWidth;
    cols.value = Math.max(1, Math.floor(w / 240)); // 每个卡片约 240px 宽
  }
};

// 计算可见行
const startRow = computed(() => Math.floor(scrollTop.value / cardHeight));
const visibleRowCount = computed(() => Math.ceil(containerHeight.value / cardHeight) + 2); // buffer +2

const endRow = computed(() => startRow.value + visibleRowCount.value);
const totalRows = computed(() => Math.ceil(items.length / cols.value));

// 计算当前可见的数据
const startIndex = computed(() => startRow.value * cols.value);
const endIndex = computed(() => Math.min(endRow.value * cols.value, items.length));
const visibleItems = computed(() => items.slice(startIndex.value, endIndex.value));

// 上下占位
const topPadding = computed(() => startRow.value * cardHeight);
const bottomPadding = computed(() => (totalRows.value - endRow.value) * cardHeight);

// 处理滚动
const onScroll = () => {
  scrollTop.value = containerRef.value.scrollTop;
};

// 初始化
onMounted(() => {
  updateCols();
  containerHeight.value = containerRef.value.clientHeight;
  window.addEventListener("resize", updateCols);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateCols);
});


// ---------------- 懒加载指令 ----------------
const lazyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const src = el.dataset.src;
      if (src) {
        el.src = src;
        lazyObserver.unobserve(el);
      }
    }
  });
});

const vLazy = {
  mounted(el, binding) {
    el.dataset.src = binding.value;
    el.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzIwMCcgZmlsbD0nI2VlZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4="; // 占位图
    lazyObserver.observe(el);
  },
};
</script>

<style>
.scroll-container {
  height: 100vh;
  overflow-y: auto;
  border: 1px solid #ccc;
}

.grid {
  display: grid;
  gap: 10px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.card-title {
  padding: 8px;
  font-size: 14px;
  text-align: center;
}
</style>
