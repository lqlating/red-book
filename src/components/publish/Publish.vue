<template>
  <!-- 切换按钮放在框外 -->
  <div class="toggle-btn-wrapper">
    <el-switch
      v-model="isBookPublish"
      :active-text="'发布书籍'"
      :inactive-text="'发布文章'"
      active-color="#ff2e4d"
      inactive-color="#dcdfe6"
      @change="togglePublishType"
      class="switch-btn"
    />
  </div>

  <!-- 表单容器 -->
  <div class="publish-wrapper">
    <!-- 标题部分 -->
    <h1 ref="titleRef" class="publish-title">{{ isBookPublish ? '发布书籍' : '发布文章' }}</h1>

    <!-- 表单内容 -->
    <form @submit.prevent="submitContent" class="publish-form">
      <div class="form-group">
        <label for="title">{{ isBookPublish ? '书籍名' : '标题' }}</label>
        <input v-model="form.title" type="text" id="title" placeholder="请输入内容标题" required />
      </div>

      <div class="form-group">
        <label for="author">{{ isBookPublish ? '书本作者' : '文章作者' }}</label>
        <input v-model="form.author" type="text" id="author" placeholder="请输入作者名字" required />
      </div>

      <div class="form-group" v-if="isBookPublish">
        <label for="price">书本售价</label>
        <input v-model="form.price" type="number" id="price" placeholder="请输入书本售价" required />
      </div>

      <div class="form-group">
        <label for="image">选择图片</label>
        <div class="image-upload" v-if="!form.imagePreview" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
          <input type="file" id="image" @change="handleImageUpload" accept="image/*" required ref="fileInput" />
          <div class="upload-area">
            <span class="upload-icon">+</span>
            <span class="upload-text">点击或拖拽文件上传</span>
          </div>
        </div>

        <div class="uploaded-image" v-if="form.imagePreview">
          <img :src="form.imagePreview" alt="Image Preview" class="image-preview" />
          <button class="remove-image" @click="clearImage">×</button>
        </div>
      </div>

      <div class="form-group">
        <label for="content">{{ isBookPublish ? '具体介绍' : '文章内容' }}</label>
        <textarea v-model="form.content" id="content" placeholder="请输入内容" rows="4" required></textarea>
      </div>

      <button type="submit" class="publish-button">{{ isBookPublish ? '发布书籍' : '发布文章' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { userInfoStore } from '../../store/user';
import { ElMessage } from 'element-plus';
import articleApi from '../../api/articleApi';
import gsap from 'gsap'; // 引入 GSAP 库

const userStore = userInfoStore();
const isBookPublish = ref(false); // 切换发布类型
const form = ref({
  title: '',
  author: '', // 书籍作者
  price: '', // 书籍售价
  image: '',
  imagePreview: '',
  content: '',
});
const titleRef = ref(null); // 标题的 DOM 引用

// 切换发布类型
const togglePublishType = () => {
  resetForm(); // 切换时重置表单数据
};

// 监听 isBookPublish 变化，触发标题动画
watch(isBookPublish, () => {
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }
});

// 处理图片上传
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.image = e.target.result;
      form.value.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 处理文件拖放
const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.image = e.target.result;
      form.value.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 点击触发文件输入
const triggerFileInput = () => {
  fileInput.value.click();
};

// 清除已上传的图片
const clearImage = () => {
  form.value.image = '';
  form.value.imagePreview = '';
};

// 重置表单
const resetForm = () => {
  form.value.title = '';
  form.value.author = '';
  form.value.price = '';
  form.value.image = '';
  form.value.imagePreview = '';
  form.value.content = '';
};

// 提交文章或书籍
const submitContent = async () => {
  if (!form.value.title || !form.value.image || !form.value.content || (isBookPublish.value && !form.value.price)) {
    ElMessage({
      message: '请填写所有必填项',
      type: 'warning',
    });
    return;
  }

  const data = {
    title: form.value.title,
    author: form.value.author, // 书籍作者
    price: form.value.price, // 书籍售价
    img: form.value.image.split(',')[1], // 仅取出base64部分
    content: form.value.content,
    authorId: userStore.userThing.id, // 传入用户ID
  };

  try {
    let res;
    if (isBookPublish.value) {
      res = await bookApi.addBook(data); // 发布书籍接口
    } else {
      res = await articleApi.addArticle(data); // 发布文章接口
    }

    ElMessage({
      message: isBookPublish.value ? '书籍发布成功！' : '文章发布成功！',
      type: 'success',
    });

    resetForm();
  } catch (error) {
    ElMessage({
      message: '发布失败，请重试',
      type: 'error',
    });
  }
};
</script>

<style scoped>
.toggle-btn-wrapper {
  margin-left: 435px;

  margin-bottom: 10px; /* 缩小顶部距离 */
}

.switch-btn {
  --el-switch-on-color: #ff2e4d;
  --el-switch-off-color: #dcdfe6;
}

/* 始终保持文字颜色为主题红色 */
.switch-btn .el-switch__label {
  color: #ff2e4d !important;
  font-weight: bold;
}

.publish-wrapper {
  background-color: white;
  padding: 10px; /* 减少内边距 */
  margin-left: 280px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px; /* 限制表单最大宽度 */
  overflow: hidden; /* 防止出现滚动条 */
}

.publish-title {
  color: #ff2e4d;
  text-align: center;
  margin-bottom: 10px; /* 缩小标题底部距离 */
  font-size: 20px;
}

.publish-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 8px; /* 缩小表单项之间的间距 */
}

label {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
  display: block;
}

input[type="text"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 6px; /* 减小输入框的内边距 */
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

input[type="file"] {
  display: none;
}

.image-upload {
  position: relative;
}

.upload-area {
  border: 2px dashed #ff2e4d;
  border-radius: 5px;
  height: 100px; /* 缩小图片上传区域高度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.upload-icon {
  font-size: 22px; /* 缩小图标大小 */
  color: #ff2e4d;
}

.upload-text {
  margin-top: 5px;
  color: #333;
}

.uploaded-image {
  position: relative;
}

.image-preview {
  border-radius: 5px;
  width: 100%;
  height: 100px; /* 缩小图片预览大小 */
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  color: #ff2e4d;
  font-size: 16px; /* 调整字体大小 */
  cursor: pointer;
  padding: 4px;
}

.publish-button {
  padding: 8px;
  background-color: #ff2e4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 15px; /* 上边距 */
}

.publish-button:hover {
  background-color: #e62e4d;
}
</style>
