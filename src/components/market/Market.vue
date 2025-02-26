<template>
  <div class="book-list">
    <!-- 遍历书籍列表 -->
    <book-item
      v-for="(book, index) in books"
      :key="index"
      :book="book"
      @click="openBookDetail(book)"
    />

    <!-- 书籍详情页面 -->
    <transition name="fade">
      <div v-if="selectedBook" class="overlay" @click.self="closeBookDetail">
        <book-detail :book="selectedBook" @close="closeBookDetail" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BookItem from "./book_item/book_item.vue";
import BookDetail from "./book_detail/book_detail.vue";

// 书籍数据
const books = [
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2s2ZurcnSji8iPe4phdEPiplzeGMRH1iwbA&s",
    title: "深入浅出Vue.js",
    author: "Evan You",
    price: "59.00",
    sellerName: "张三",
    sellerAvatar: "seller1.jpg",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2s2ZurcnSji8iPe4phdEPiplzeGMRH1iwbA&s",
    title: "JavaScript高级程序设计",
    author: "Nicholas C. Zakas",
    price: "79.00",
    sellerName: "李四",
    sellerAvatar: "seller2.jpg",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2s2ZurcnSji8iPe4phdEPiplzeGMRH1iwbA&s",
    title: "计算机网络",
    author: "谢希仁",
    price: "45.00",
    sellerName: "王五",
    sellerAvatar: "seller3.jpg",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2s2ZurcnSji8iPe4phdEPiplzeGMRH1iwbA&s",
    title: "数据结构与算法",
    author: "Robert Lafore",
    price: "68.00",
    sellerName: "赵六",
    sellerAvatar: "seller4.jpg",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2s2ZurcnSji8iPe4phdEPiplzeGMRH1iwbA&s",
    title: "算法导论",
    author: "Thomas H. Cormen",
    price: "120.00",
    sellerName: "孙七",
    sellerAvatar: "seller5.jpg",
  },
];

// 选中的书籍
const selectedBook = ref(null);

// 打开书籍详情
const openBookDetail = (book) => {
  selectedBook.value = book;
};

// 关闭书籍详情
const closeBookDetail = () => {
  selectedBook.value = null;
};
</script>

<style scoped>
/* 书籍列表布局 */
.book-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 自适应列数 */
  gap: 20px; /* 卡片之间的间距 */
  padding: 20px;
  width: 100%; /* 确保宽度充满 */
  box-sizing: border-box; /* 防止 padding 影响宽度 */
  background: #f8f9fa; /* 添加背景色 */
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>