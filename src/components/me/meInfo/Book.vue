<template>
    <div class="user-books-container" v-if="initialized">
        <!-- 未发布书籍时的空状态 -->
        <div v-if="!sellerBooks || sellerBooks.length === 0" class="empty-state">
            <div class="empty-avatar">
                <img src="../../../assets/img/head.png" alt="用户头像">
            </div>
            <div class="empty-message">你暂未发布任何书籍</div>
        </div>

        <!-- 已发布书籍列表 -->
        <div v-else class="books-list-container">
            <!-- 书籍列表（瀑布流布局） -->
            <transition-group name="fade-masonry" tag="div" class="books-grid">
                <div v-for="book in sellerBooks" :key="book.book_id" class="book-item-wrapper"
                    @contextmenu.prevent="handleContextMenu($event, book)">
                    <book-item :book="{
                        image: book.book_img_base64 ? `data:image/jpeg;base64,${book.book_img_base64}` : defaultBookCover,
                        title: book.book_title,
                        author: book.book_writer,
                        price: book.book_price
                    }" @click="openBookDetail(book)" />
                </div>
            </transition-group>

            <!-- 自定义右键菜单 -->
            <div v-show="showContextMenu" class="custom-context-menu" :style="contextMenuStyle">
                <button class="menu-item delete-btn" @click.stop="deleteBook">
                    <span class="icon">🗑️</span>
                    <span>删除书籍</span>
                </button>
            </div>
        </div>

        <!-- 书籍详情弹窗 -->
        <transition name="fade">
            <div v-if="selectedBook" class="overlay" @click.self="closeBookDetail">
                <book-detail :book="selectedBook" :is-my-books="true" @close="closeBookDetail" />
            </div>
        </transition>

        <!-- 确认删除对话框 -->
        <div v-if="showConfirmDialog" class="custom-dialog-overlay">
            <div class="custom-dialog">
                <div class="dialog-header">
                    <h3>确认删除</h3>
                </div>
                <div class="dialog-body">
                    <p>确定要删除这本书籍吗？删除后无法恢复。</p>
                </div>
                <div class="dialog-footer">
                    <button class="cancel-btn" @click="cancelDelete">取消</button>
                    <button class="confirm-btn" @click="confirmDelete">确认删除</button>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { userInfoStore } from '../../../store/user';
import { bookStore } from '../../../store/books';
import BookItem from '../../market/book_item/book_item.vue';
import BookDetail from '../../market/book_detail/book_detail.vue';

// 默认书籍封面（可以替换为实际的默认图片URL）
const defaultBookCover = ref('/src/assets/img/default-book-cover.jpg');

// 组件是否已初始化
const initialized = ref(false);

const userStore = userInfoStore();
const store = bookStore();
const userId = userStore.userThing.id;

// 使用 storeToRefs 解构 store 中的响应式属性
const { sellerBooks } = storeToRefs(store);

// 右键菜单相关状态
const showContextMenu = ref(false);
const contextMenuStyle = ref({
    top: '0px',
    left: '0px'
});
const currentBook = ref(null);

// 确认对话框相关状态
const showConfirmDialog = ref(false);

// 选中的书籍（用于详情页）
const selectedBook = ref(null);

// 打开书籍详情
const openBookDetail = (book) => {
    selectedBook.value = {
        image: book.book_img_base64 ? `data:image/jpeg;base64,${book.book_img_base64}` : defaultBookCover.value,
        title: book.book_title,
        author: book.book_writer,
        price: book.book_price,
        description: book.book_descripe || '暂无描述',
        seller_id: book.book_seller_id || userId, // 使用书籍自带的seller_id或当前用户ID
        book_id: book.book_id,
    };
};

// 关闭书籍详情
const closeBookDetail = () => {
    selectedBook.value = null;
};

// 显示右键菜单
const handleContextMenu = (event, book) => {
    event.preventDefault();
    currentBook.value = book;
    showContextMenu.value = true;
    contextMenuStyle.value.top = `${event.clientY}px`;
    contextMenuStyle.value.left = `${event.clientX}px`;
};

// 获取用户发布的书籍
const fetchUserBooks = async () => {
    try {
        await store.fetchBooksBySellerId(userId);
        initialized.value = true;
    } catch (error) {
        console.error("获取用户书籍失败:", error);
        showToast('获取书籍列表失败', 'error');
        initialized.value = true;
    }
};

// 删除书籍 - 第一步：显示确认对话框
const deleteBook = () => {
    if (!currentBook.value) return;
    showConfirmDialog.value = true;
    showContextMenu.value = false;
};

// 取消删除
const cancelDelete = () => {
    showConfirmDialog.value = false;
    currentBook.value = null;
};

// 确认删除
const confirmDelete = async () => {
    try {
        const bookId = currentBook.value.book_id;
        await store.deleteBook(bookId);
        // 删除成功后重新获取卖家书籍列表
        await store.fetchBooksBySellerId(userId);
        showToast('书籍删除成功', 'success');
    } catch (error) {
        console.error("删除书籍时出错:", error);
        showToast('删除书籍时出错', 'error');
    } finally {
        showConfirmDialog.value = false;
        currentBook.value = null;
    }
};

// 自定义Toast通知
const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// 点击页面其他地方关闭右键菜单
const handleClickOutside = () => {
    showContextMenu.value = false;
};

onMounted(async () => {
    // 确保 sellerBooks 有初始值
    if (!sellerBooks.value) {
        sellerBooks.value = [];
    }

    // 获取用户书籍
    await fetchUserBooks();

    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.user-books-container {
    width: 100%;
    min-height: 60vh;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
}

/* 加载状态样式 */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #ff2e4d;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 空状态样式 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    text-align: center;
}

.empty-avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #ff2e4d;
    padding: 5px;
    margin-bottom: 20px;
}

.empty-message {
    font-size: 18px;
    color: #666;
    margin-bottom: 25px;
}

/* 书籍列表容器 */
.books-list-container {
    position: relative;
    margin-top: 20px;
}

/* 瀑布流布局 */
.books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    animation-duration: 0.5s;
}

.book-item-wrapper {
    break-inside: avoid;
    margin-bottom: 20px;
    animation: fadeIn 0.5s ease-in-out;
}

/* 遮罩层 */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

/* 自定义右键菜单 */
.custom-context-menu {
    position: fixed;
    z-index: 1000;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    padding: 8px 0;
    min-width: 160px;
    overflow: hidden;
}

.menu-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 16px;
    border: none;
    background: none;
    text-align: left;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;
}

.menu-item:hover {
    background-color: #f9f9f9;
}

.menu-item .icon {
    margin-right: 8px;
    font-size: 16px;
}

.delete-btn {
    color: #ff2e4d;
}

/* 自定义对话框 */
.custom-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.custom-dialog {
    background-color: white;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.dialog-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f1f1f1;
}

.dialog-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.dialog-body {
    padding: 20px;
    color: #666;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    padding: 12px 20px;
    border-top: 1px solid #f1f1f1;
}

.dialog-footer button {
    padding: 8px 16px;
    margin-left: 10px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
}

.cancel-btn {
    background-color: #f5f5f5;
    color: #666;
}

.cancel-btn:hover {
    background-color: #ebebeb;
}

.confirm-btn {
    background-color: #ff2e4d;
    color: white;
}

.confirm-btn:hover {
    background-color: #ff1a3d;
}

/* 自定义Toast通知 */
.custom-toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 50px;
    color: white;
    font-size: 14px;
    z-index: 3000;
    animation: fade-in 0.3s ease-out;
}

.custom-toast.success {
    background-color: #4CAF50;
}

.custom-toast.error {
    background-color: #F44336;
}

.custom-toast.fade-out {
    animation: fade-out 0.3s ease-in forwards;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translate(-50%, 20px);
    }

    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}

@keyframes fade-out {
    from {
        opacity: 1;
        transform: translate(-50%, 0);
    }

    to {
        opacity: 0;
        transform: translate(-50%, 20px);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>