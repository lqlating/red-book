<template>
  <div class="book-detail">
    <!-- 添加举报按钮 -->
    <el-dropdown trigger="click" class="report-dropdown" teleported>
      <button class="report-btn">
        <el-icon class="more-icon">
          <MoreFilled />
        </el-icon>
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="showReportDialog">举报</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 添加举报对话框 -->
    <ReportDialog :is-visible="isReportDialogVisible" content-type="book" :target-id="book.book_id"
      :report-content-id="book.book_id" :reporter-id="user.userThing.id" :extra-data="{ seller_id: book.seller_id }"
      @close="closeReportDialog" />

    <!-- 左侧书籍封面 -->
    <div class="book-image-container">
      <img :src="book.image" alt="书籍封面" class="book-image" />
    </div>

    <!-- 中间分割线 -->
    <div class="vertical-divider"></div>

    <!-- 右侧商品详情 -->
    <div class="book-info">
      <div class="book-info-block">
        <h2 class="book-title">{{ book.title }}</h2>
        <p class="book-author">作者: {{ book.author }}</p>
        <p class="book-price">价格: ¥{{ book.price }}</p>
        <p class="book-description">
          {{ book.description || "这本书暂无详细介绍。" }}
        </p>
      </div>

      <!-- 卖家信息 -->
      <div v-if="isLoading" class="seller-loading">加载卖家信息中...</div>
      <div v-else-if="seller" class="seller-info">
        <div v-if="!seller.avatar_base64" class="avatar-skeleton"></div>
        <img v-else :src="`data:image/png;base64,${seller.avatar_base64}`" alt="卖家头像" class="seller-avatar" />
        <p class="seller-name">{{ seller.username }}</p>
      </div>
      <div v-else class="seller-error">获取卖家信息失败</div>

      <!-- 分割线 -->
      <div class="divider"></div>

      <!-- 按钮区域 -->
      <div class="button-group">
        <!-- 绑定 addCart 函数，传入 userThing.id 和 book.book_id 作为参数 -->
        <button class="contact-btn" @click="addCart(user.userThing.id, book.book_id)">联系卖家</button>
        <button class="cart-btn" @click="addCart(user.userThing.id, book.book_id)">加入购物车</button>
      </div>
    </div>

    <!-- 关闭按钮 -->
    <button class="close-btn" @click="$emit('close')">✖</button>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import userApi from "../../../api/userApi";
import { cartStore } from "../../../store/cart";
import { userInfoStore } from "../../../store/user";
import { ElMessage } from "element-plus";
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { MoreFilled } from '@element-plus/icons-vue';
import ReportDialog from '../../report/ReportDialog.vue';

// 接收 book 对象
const props = defineProps({
  book: Object,
});
console.log(props.book);

// 使用 Pinia 的 store
const user = userInfoStore();  // 修改这里
const cart = cartStore();

const seller = ref(null);  // 卖家信息
const isLoading = ref(true);  // 加载状态
const error = ref(null);  // 错误信息
const isReportDialogVisible = ref(false);

// 添加到购物车的函数
const addCart = async (userId, bookId) => {
  if (!user.isLogin) {
    ElMessage.warning("请先登录！");
    return;
  }

  try {
    await cart.addCart(userId, bookId);
    ElMessage.success("已添加到购物车！");
  } catch (err) {
    console.error("添加到购物车失败:", err);
    ElMessage.error("添加到购物车失败！");
  }
};

// 根据 seller_id 获取卖家信息
const fetchSellerInfo = async () => {
  try {
    const response = await userApi.SearchUserById(props.book.seller_id);
    if (response.data.code === 1 && response.data.data.length > 0) {
      seller.value = response.data.data[0];
    } else {
      throw new Error("未找到卖家信息");
    }
  } catch (err) {
    console.error("API Error:", err);
    error.value = err.message || "获取卖家信息失败";
  } finally {
    isLoading.value = false;
  }
};

// 组件加载时调用 API
onMounted(() => {
  fetchSellerInfo();
});

const showReportDialog = () => {
  isReportDialogVisible.value = true;
};

const closeReportDialog = () => {
  isReportDialogVisible.value = false;
};
</script>


<style scoped>
/* 整体布局 */
.book-detail {
  display: flex;
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 90%;
  height: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
}

.book-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.book-image {
  width: 100%;
  max-width: 250px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.vertical-divider {
  width: 1px;
  background: linear-gradient(to bottom, transparent, #ddd, transparent);
  height: 100%;
}

.book-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.book-info-block {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  overflow-y: auto;
  max-height: calc(100% - 280px);
}

.book-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
}

.book-author,
.book-price {
  font-size: 14px;
  color: #666;
  margin: 8px 0;
}

.book-description {
  font-size: 14px;
  color: #777;
  line-height: 1.6;
  margin: 16px 0 0 0;
  word-break: break-word;
}

.seller-info {
  display: flex;
  align-items: center;
  margin-top: 143px;
}

.avatar-skeleton {
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 50%;
  margin-right: 12px;
}

.seller-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.seller-name {
  font-size: 14px;
  font-weight: 600;
  color: #444;
}

.seller-loading {
  font-size: 14px;
  color: #888;
  margin-top: 12px;
}

.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, transparent, #ddd, transparent);
  margin: 16px 0;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 6px;
  margin-bottom: 20px;
}

.contact-btn,
.cart-btn {
  width: 140px;
  height: 40px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-btn {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
}

.cart-btn {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.report-dropdown {
  position: absolute;
  top: 167px;
  right: 16px;
  /* 你可以根据需要调整这个值 */
  z-index: 1;
}

.report-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.report-btn:hover {
  color: #333;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
