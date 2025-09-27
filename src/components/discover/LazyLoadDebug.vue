<template>
  <div class="lazy-debug-panel" v-if="showDebug">
    <div class="debug-header">
      <h3>懒加载性能监控</h3>
      <button @click="toggleDebug" class="close-btn">×</button>
    </div>
    
    <div class="debug-content">
      <!-- 基本统计 -->
      <div class="debug-section">
        <h4>📊 基本统计</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">总文章数:</span>
            <span class="stat-value">{{ totalArticles }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">已加载图片:</span>
            <span class="stat-value loaded">{{ loadedImages }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">加载中:</span>
            <span class="stat-value loading">{{ loadingImages }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">未开始:</span>
            <span class="stat-value pending">{{ pendingImages }}</span>
          </div>
        </div>
      </div>

      <!-- 性能指标 -->
      <div class="debug-section">
        <h4>⚡ 性能指标</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">图片加载率:</span>
            <span class="stat-value">{{ imageLoadRate }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">内存节省:</span>
            <span class="stat-value">{{ memorySaved }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">平均加载时间:</span>
            <span class="stat-value">{{ avgLoadTime }}ms</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">网络请求数:</span>
            <span class="stat-value">{{ networkRequests }}</span>
          </div>
        </div>
      </div>

      <!-- 滚动状态 -->
      <div class="debug-section">
        <h4>📜 滚动状态</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">滚动位置:</span>
            <span class="stat-value">{{ scrollTop }}px</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">容器高度:</span>
            <span class="stat-value">{{ containerHeight }}px</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">总高度:</span>
            <span class="stat-value">{{ scrollHeight }}px</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">滚动进度:</span>
            <span class="stat-value">{{ scrollProgress }}%</span>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="debug-section">
        <h4>🔄 加载状态</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">正在加载文章:</span>
            <span class="stat-value" :class="{ 'loading': isLoading }">
              {{ isLoading ? '是' : '否' }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">有更多数据:</span>
            <span class="stat-value" :class="{ 'has-more': hasMore }">
              {{ hasMore ? '是' : '否' }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">触底距离:</span>
            <span class="stat-value">{{ distanceToBottom }}px</span>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="debug-section">
        <h4>📝 最近活动</h4>
        <div class="recent-activity">
          <div 
            v-for="(activity, index) in recentActivities" 
            :key="index"
            class="activity-item"
            :class="activity.type"
          >
            <span class="activity-time">{{ activity.time }}</span>
            <span class="activity-text">{{ activity.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalArticles: {
    type: Number,
    default: 0
  },
  loadedImages: {
    type: Number,
    default: 0
  },
  loadingImages: {
    type: Number,
    default: 0
  },
  pendingImages: {
    type: Number,
    default: 0
  },
  networkRequests: {
    type: Number,
    default: 0
  },
  totalLoadTime: {
    type: Number,
    default: 0
  },
  scrollTop: {
    type: Number,
    default: 0
  },
  containerHeight: {
    type: Number,
    default: 0
  },
  scrollHeight: {
    type: Number,
    default: 0
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: true
  },
  recentActivities: {
    type: Array,
    default: () => []
  },
  showDebug: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-debug'])

// 计算属性
const imageLoadRate = computed(() => {
  if (props.totalArticles === 0) return 0
  return Math.round((props.loadedImages / props.totalArticles) * 100)
})

const memorySaved = computed(() => {
  if (props.totalArticles === 0) return 0
  return Math.round(((props.totalArticles - props.loadedImages) / props.totalArticles) * 100)
})

const avgLoadTime = computed(() => {
  if (props.loadedImages === 0) return 0
  return Math.round(props.totalLoadTime / props.loadedImages)
})

const scrollProgress = computed(() => {
  if (props.scrollHeight <= props.containerHeight) return 100
  return Math.round((props.scrollTop / (props.scrollHeight - props.containerHeight)) * 100)
})

const distanceToBottom = computed(() => {
  return Math.max(0, props.scrollHeight - props.scrollTop - props.containerHeight)
})

const toggleDebug = () => {
  emit('toggle-debug')
}
</script>

<style scoped>
.lazy-debug-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 320px;
  max-height: 80vh;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  z-index: 9999;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;
}

.debug-header h3 {
  margin: 0;
  color: #4CAF50;
  font-size: 14px;
}

.close-btn {
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background: #cc0000;
}

.debug-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.debug-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #2196F3;
}

.debug-section h4 {
  margin: 0 0 8px 0;
  color: #2196F3;
  font-size: 13px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
}

.stat-label {
  color: #ccc;
  font-size: 11px;
}

.stat-value {
  color: #fff;
  font-weight: bold;
  font-size: 11px;
}

.stat-value.loaded {
  color: #4CAF50;
}

.stat-value.loading {
  color: #FF9800;
}

.stat-value.pending {
  color: #9E9E9E;
}

.stat-value.has-more {
  color: #4CAF50;
}

/* 最近活动 */
.recent-activity {
  max-height: 100px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 6px;
  margin: 2px 0;
  border-radius: 3px;
  font-size: 10px;
}

.activity-item.load {
  background: rgba(76, 175, 80, 0.2);
  border-left: 2px solid #4CAF50;
}

.activity-item.scroll {
  background: rgba(33, 150, 243, 0.2);
  border-left: 2px solid #2196F3;
}

.activity-item.error {
  background: rgba(244, 67, 54, 0.2);
  border-left: 2px solid #f44336;
}

.activity-time {
  color: #888;
  font-size: 9px;
}

.activity-text {
  color: #fff;
  font-size: 10px;
}

/* 滚动条样式 */
.lazy-debug-panel::-webkit-scrollbar,
.recent-activity::-webkit-scrollbar {
  width: 4px;
}

.lazy-debug-panel::-webkit-scrollbar-track,
.recent-activity::-webkit-scrollbar-track {
  background: #333;
  border-radius: 2px;
}

.lazy-debug-panel::-webkit-scrollbar-thumb,
.recent-activity::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 2px;
}

.lazy-debug-panel::-webkit-scrollbar-thumb:hover,
.recent-activity::-webkit-scrollbar-thumb:hover {
  background: #888;
}
</style>
