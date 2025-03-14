<script setup>
import { ref, onMounted, watch } from 'vue';
import { searchStore } from '../../store/search';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import bookApi from '../../api/bookApi';
import searchApi from '../../api/searchApi';

// 使用 searchStore
const useSearchStore = searchStore();
const { searchArticleByTitleOrContent, searchUserByUsername, resetSearch, searchBooksByTitle } = useSearchStore;
const { isSearch, searchArticle, searchKeyword } = storeToRefs(useSearchStore);

// 获取当前路由
const route = useRoute();
const router = useRouter();

// 加载状态
const isLoading = ref(false);

// 监听路由变化
watch(
  () => route.path,
  (newPath, oldPath) => {
    // 如果路由发生变化，重置搜索状态
    if (newPath !== oldPath) {
      clearSearch();
    }
  }
);

// 点击搜索按钮或按下回车时触发搜索
const handleSearch = async () => {
  if (searchKeyword.value.trim() !== '') {
    isSearch.value = true;
    isLoading.value = true;
    
    try {
      // 根据当前路由调用不同的搜索函数
      if (route.path === '/Market') {
        await searchBooksByTitle(searchKeyword.value);
      } else if (route.path === '/Discover') {
        searchArticle.value = true;
        await searchArticleByTitleOrContent(searchKeyword.value);
        await searchUserByUsername(searchKeyword.value);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      isLoading.value = false;
    }
  }
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = '';
  resetSearch();
}

// 监听回车键
const onEnterPress = (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
}

// 在挂载时根据路由设置搜索函数
onMounted(() => {
  // 初始化时清空搜索状态
  clearSearch();
});

</script>

<template>
  <div>
    <div class="search-box">
      <span class="brand-name">集知书店</span>
      <span class="input-wrapper">
        <input 
          type="text" 
          class="input-box" 
          placeholder="Search..." 
          v-model="searchKeyword" 
          @keyup.enter="onEnterPress"
        >
        <div class="search-icon" @click="handleSearch">
          <img class="search-img" src="../../assets/img/search.png" alt="">
        </div>
        <!-- 添加清除按钮 -->
        <div v-if="searchKeyword" class="clear-icon" @click="clearSearch">
          ×
        </div>
      </span>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Lobster&display=swap');

.search-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
}

.brand-name {
  font-family: 'ZCOOL KuaiLe', 'Lobster', cursive;
  font-size: 26px;
  font-weight: bold;
  color: #ff2e4d;
  margin-right: 20px;
  margin-left: 47px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

.input-box {
  background-color: #f5f5f5;
  border: 1px solid black;
  width: 500px;
  padding: 12px 40px 12px 16px;
  border: none;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
}

.search-icon {
  position: absolute;
  top: 57%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}

.clear-icon {
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #888;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-icon:hover {
  color: #ff2e4d;
}

.search-img {
  height: 20px;
  width: 20px;
}
</style>