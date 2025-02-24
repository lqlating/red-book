<script setup>
import { ref } from 'vue';
import { searchStore } from '../../store/search'; // 假设 store 路径为 ../stores/searchStore
import { storeToRefs } from 'pinia';

// 使用 searchStore
const useSearchStore = searchStore();
const { searchArticleByTitleOrContent, searchUserByUsername } = useSearchStore;
let { isSearch } = storeToRefs(useSearchStore);
const searchKeyword = ref(''); // 用于存储输入框中的内容

// 点击搜索按钮或按下回车时触发搜索
function handleSearch() {
  if (searchKeyword.value.trim() !== '') {
    isSearch.value = true; // 设置 isSearch 为 true
    searchArticleByTitleOrContent(searchKeyword.value); // 调用搜索文章函数
    searchUserByUsername(searchKeyword.value);
  }
}

// 监听回车键
function onEnterPress(event) {
  if (event.key === 'Enter') {
    handleSearch(); // 调用搜索
  }
}
</script>

<template>
  <div>
    <div class="search-box">
      <span class="brand-name">集知书店</span>
      <span class="input-wrapper">
        <input type="text" class="input-box" placeholder="Search..." v-model="searchKeyword" @keyup.enter="onEnterPress">
        <div class="search-icon" @click="handleSearch">
          <img class="search-img" src="../../assets/img/search.png" alt="">
        </div>
      </span>
      
      <!-- 以下是关于创作中心和业务合作的注释代码，保留不变 -->
      <!-- <span class="work-together"> 
        <span class="creation" style="margin-right:20px"> 创作中心 </span> 
        <div class="drop-down"> 
          <div class="creation-inner">创作服务</div> 
          <div class="creation-inner">直播管理</div> 
          <div class="creation-inner">电脑直播助手</div> 
        </div> 
        <div class="useless"></div> 
        <span class="together">业务合作</span> 
        <div class="useless2"></div> 
        <div class="drop-down2"> 
          <div class="creation-inner">推广号</div> 
          <div class="creation-inner">推广合作</div> 
          <div class="creation-inner">蒲公英</div> 
          <div class="creation-inner">商家入驻</div> 
          <div class="creation-inner">MCN入驻</div> 
        </div> 
      </span> -->
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
  /* 保持搜索框在中间 */
}

.brand-name {
  font-family: 'ZCOOL KuaiLe', 'Lobster', cursive;
  font-size: 26px;
  font-weight: bold;
  color: #ff2e4d;
  margin-right: 20px;
  /* 使品牌名称和搜索框之间的间距可调 */
  margin-left: 47px; /* 这里可以随意调整间距 */
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  /* 确保搜索框始终在居中 */
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

.search-img {
  height: 20px;
  width: 20px;
}
</style>