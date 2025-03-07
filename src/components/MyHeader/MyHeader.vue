<script setup>
import { ref } from 'vue';
import { searchStore } from '../../store/search';
import { storeToRefs } from 'pinia';

// 使用 searchStore
const useSearchStore = searchStore();
const { searchArticleByTitleOrContent, searchUserByUsername, resetSearch } = useSearchStore;
const { isSearch, searchArticle } = storeToRefs(useSearchStore);
const searchKeyword = ref(''); // 用于存储输入框中的内容

// 点击搜索按钮或按下回车时触发搜索
function handleSearch() {
  if (searchKeyword.value.trim() !== '') {
    isSearch.value = true; // 设置 isSearch 为 true
    searchArticle.value = true; // 默认显示文章搜索结果
    
    // 同时搜索文章和用户
    searchArticleByTitleOrContent(searchKeyword.value);
    searchUserByUsername(searchKeyword.value);
  }
}

// 清除搜索
function clearSearch() {
  searchKeyword.value = '';
  resetSearch();
}

// 监听回车键
function onEnterPress(event) {
  if (event.key === 'Enter') {
    handleSearch();
  }
}
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