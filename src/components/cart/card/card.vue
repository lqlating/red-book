<template>
  <div class="card">
    <input type="checkbox" v-model="selected" class="checkbox" />
    <div class="image-container">
      <img :src="image" alt="书籍封面" class="book-image" />
    </div>
    <div class="card-info">
      <h3 class="book-title">{{ title }}</h3>
      <p class="book-author">作者: {{ author }}</p>
      <p class="book-price">￥{{ price }}</p>
    </div>
    <button @click="removeFromCart" class="remove-btn">删除</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, defineModel } from "vue";

const props = defineProps({
  image: String,
  title: String,
  author: String,
  price: Number,
  index: Number,
});

const selected = defineModel("selected", { type: Boolean });

const emit = defineEmits(["remove-item"]);

// 删除当前商品
const removeFromCart = () => {
  emit("remove-item", props.index);
};
</script>

<style scoped>
.card {
  display: flex;
  align-items: center;
  width: 800px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  transition: 0.2s;
  border: 1px solid #ddd;
}

.checkbox {
  margin-right: 10px;
  transform: scale(1.2);
  cursor: pointer;
}

.image-container {
  width: 120px;
  height: 120px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  border-radius: 6px;
}

.book-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-info {
  flex: 1;
  padding-left: 10px;
}

.book-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-author {
  font-size: 14px;
  color: #777;
  margin-bottom: 4px;
}

.book-price {
  font-size: 16px;
  font-weight: bold;
  color: #ff2e4d;
}

.remove-btn {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
}
</style>