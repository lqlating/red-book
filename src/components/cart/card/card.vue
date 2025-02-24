<template>
    <div class="card">
      <div class="image-container">
        <img :src="image" alt="书籍封面" class="book-image">
      </div>
      <div class="card-info">
        <h3 class="book-title">{{ title }}</h3>
        <p class="book-author">作者: {{ author }}</p>
        <p class="book-price">￥{{ price }}</p>
        <button class="buy-btn">加入购物车</button>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    image: String,
    title: String,
    author: String,
    price: Number
  });
  </script>
  
  <style scoped>
  .card {
    width: 280px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 2px solid transparent;
    position: relative;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    border: 2px solid #ff2e4d;
  }
  
  .image-container {
    width: 100%;
    height: 200px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f8f8;
  }
  
  .book-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .card-info {
    padding: 15px;
  }
  
  .book-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 10px 0;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .book-author {
    font-size: 14px;
    color: #777;
    margin-bottom: 5px;
    text-align: left;
  }
  
  .book-price {
    font-size: 18px;
    font-weight: bold;
    color: #ff2e4d;
    margin-bottom: 10px;
    text-align: left;
  }
  
  .buy-btn {
    background: #ff2e4d;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    font-weight: bold;
    transition: background 0.3s;
  }
  
  .buy-btn:hover {
    background: #e6002e;
  }
  </style>
  