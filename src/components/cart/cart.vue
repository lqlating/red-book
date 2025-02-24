<template>
    <div class="cart-container">
      <h2 class="cart-title">书籍商城</h2>
      <div class="card-list">
        <Card
          v-for="(book, index) in books"
          :key="index"
          :image="book.image"
          :title="book.title"
          :author="book.author"
          :price="book.price"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import Card from "./card/card.vue";
  
  const books = [
    {
      image: "https://img14.360buyimg.com/n1/jfs/t1/203467/21/40190/110281/65cde7cdF6b7686c7/6b6e6bd697440c4a.jpg",
      title: "Vue.js 深入浅出",
      author: "张三",
      price: 49.99
    },
    {
      image: "https://img14.360buyimg.com/n1/jfs/t1/224603/39/39057/66141/65cde7cdF86d148a5/6da7057070d1ad68.jpg",
      title: "JavaScript 高级编程",
      author: "李四",
      price: 39.99
    },
    {
      image: "https://img14.360buyimg.com/n1/jfs/t1/194755/12/43003/75562/65cde7cdFb63143b4/490b5dfcabe527e2.jpg",
      title: "前端工程化实践",
      author: "王五",
      price: 59.99
    },
    {
      image: "https://img14.360buyimg.com/n1/jfs/t1/193019/21/41339/68557/65cde7cdF88377c79/0b94cb5a449c90d6.jpg",
      title: "Node.js 设计模式",
      author: "赵六",
      price: 45.99
    },
    {
      image: "https://img14.360buyimg.com/n1/jfs/t1/225230/3/39169/82832/65cde7cdF821fa5ac/118b73d63b7718cf.jpg",
      title: "React 开发指南",
      author: "陈七",
      price: 42.99
    },
    {
      image: "https://img14.360buyimg.com/n1/jfs/t1/218765/9/41635/65919/65cde7cdF81493694/b7f768a4f3b6e527.jpg",
      title: "算法与数据结构",
      author: "王八",
      price: 55.99
    }
  ];
  </script>
  
  <style scoped>
  .cart-container {
    max-width: 1200px;
    margin: 20px auto;
    text-align: center;
  }
  
  .cart-title {
    font-size: 24px;
    font-weight: bold;
    color: #ff2e4d;
    margin-bottom: 20px;
    text-align: left;
    padding-left: 10px;
  }
  
  .card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    justify-content: center;
  }
  </style>
  