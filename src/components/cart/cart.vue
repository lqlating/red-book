<template>
  <div class="cart-container">
    <div class="cart-content">
      <div class="cart-left">
        <!-- 头部，全选 + 删除 -->
        <div class="cart-header">
          <div class="header-left">
            <input
              type="checkbox"
              v-model="selectAll"
              class="checkbox"
              :disabled="cartItems.length === 0"
            />
            <span>全选</span>
          </div>
          <button class="delete-btn" @click="removeSelectedItems">删除</button>
        </div>

        <!-- 购物车商品列表 -->
        <div class="cart-list" ref="cartList">
          <Card
            v-for="(item, index) in cartItems"
            :key="index"
            :image="item.image"
            :title="item.title"
            :author="item.author"
            :price="item.price"
            :selected="item.selected"
            @update:selected="updateItemSelected(index, $event)"
            @remove-item="removeItem(index)"
          />
        </div>

        <!-- 回顶部按钮 -->
        <button class="back-to-top" @click="scrollToTop"></button>
      </div>

      <!-- 结算框 -->
      <div class="checkout-box">
        <p>合计: ￥{{ totalPrice }}</p>
        <div class="checkout-items">
          <div class="item" v-for="(item, index) in visibleItems" :key="index">
            <img :src="item.image" alt="书籍封面" class="item-image" />
          </div>
        </div>
        <button v-if="selectedItems.length > 6" @click="toggleShowMore" class="show-more-btn">
          {{ showMore ? "收起" : "展开全部商品" }} <span>{{ showMore ? "▲" : "▼" }}</span>
        </button>
        <button class="checkout-btn">结算</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Card from "./card/card.vue";

const cartItems = ref([
  { image: "book1.jpg", title: "书籍 A", author: "作者 A", price: 100, selected: false },
  { image: "book2.jpg", title: "书籍 B", author: "作者 B", price: 120, selected: false },
  { image: "book3.jpg", title: "书籍 C", author: "作者 C", price: 80, selected: false },
  { image: "book4.jpg", title: "书籍 D", author: "作者 D", price: 90, selected: false },
  { image: "book5.jpg", title: "书籍 E", author: "作者 E", price: 110, selected: false },
  { image: "book6.jpg", title: "书籍 F", author: "作者 F", price: 130, selected: false },
  { image: "book7.jpg", title: "书籍 G", author: "作者 G", price: 140, selected: false },
  { image: "book8.jpg", title: "书籍 H", author: "作者 H", price: 150, selected: false },
]);

// 计算选中的商品
const selectedItems = computed(() => cartItems.value.filter(item => item.selected));

// 计算总价
const totalPrice = computed(() => selectedItems.value.reduce((sum, item) => sum + item.price, 0));

// 全选逻辑
const selectAll = computed({
  get: () => cartItems.value.length > 0 && cartItems.value.every(item => item.selected),
  set: (value) => {
    cartItems.value.forEach(item => (item.selected = value));
  },
});

// 监听 selectAll 的变化，手动更新每个 Card.vue 的 selected 状态
watch(selectAll, (newValue) => {
  cartItems.value.forEach(item => (item.selected = newValue));
});

// 更新单个商品的选中状态
const updateItemSelected = (index, selected) => {
  cartItems.value[index].selected = selected;
};

// 删除单个商品
const removeItem = (index) => {
  cartItems.value.splice(index, 1);
};

// 删除选中的商品
const removeSelectedItems = () => {
  cartItems.value = cartItems.value.filter(item => !item.selected);
};

// 展开/收起逻辑
const showMore = ref(false);
const visibleItems = computed(() =>
  showMore.value ? selectedItems.value : selectedItems.value.slice(0, 6)
);

const toggleShowMore = () => {
  showMore.value = !showMore.value;
};

// 回到顶部逻辑
const cartList = ref(null);
const scrollToTop = () => {
  if (cartList.value) {
    cartList.value.scrollTo({ top: 0, behavior: "smooth" });
  }
};
</script>
<style scoped>
.cart-container {
  display: flex;
  justify-content: center;
  max-width: 900px;
  margin: 0 auto;
}

.cart-content {
  display: flex;
  gap: 20px;
}

.cart-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%; /* 让它和 cart-list 宽度一致 */
  padding: 10px;
  border-radius: 6px;
  box-sizing: border-box;
  border: 1px solid #ddd; /* 更细的边框 */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox {
  transform: scale(1.2);
  cursor: pointer;
}

.delete-btn {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 14px;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 600px;
  overflow-y: auto;
  scrollbar-width: none;
  border-radius: 8px;
}

.checkout-box {
  width: 250px;
  height: fit-content;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.checkout-box p {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.checkout-btn {
  background: #ff2e4d;
  color: #fff;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  width: 100%;
}

.checkout-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  justify-content: center;
}

.item {
  width: 100%;
  display: flex;
  justify-content: center;
}

.item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.show-more-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.show-more-btn span {
  margin-left: 5px;
  font-size: 14px;
}

.back-to-top {
  position: absolute;
  right: 400px;
  bottom: 100px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.back-to-top:hover {
  opacity: 1;
}

.back-to-top::before {
  content: "";
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}
</style>
