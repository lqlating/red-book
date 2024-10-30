<template>
  <div class="publish-wrapper">
    <h1 class="publish-title">发布文章</h1>
    <form @submit.prevent="submitArticle" class="publish-form">
      <div class="form-group">
        <label for="title">标题</label>
        <input v-model="title" type="text" id="title" placeholder="输入文章标题" required />
      </div>

      <div class="form-group">
        <label for="image">选择图片</label>
        <div class="image-upload" v-if="!imagePreview" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
          <input type="file" id="image" @change="handleImageUpload" accept="image/*" required ref="fileInput" />
          <div class="upload-area">
            <span class="upload-icon">+</span>
            <span class="upload-text">点击或拖拽文件上传</span>
          </div>
        </div>
        
        <div class="uploaded-image" v-if="imagePreview">
          <img :src="imagePreview" alt="Image Preview" class="image-preview" />
          <button class="remove-image" @click="clearImage">×</button>
        </div>
      </div>

      <div class="form-group">
        <label for="category">文章种类</label>
        <div class="select-wrapper">
          <select v-model="txtType" id="category" required>
            <option value="" disabled>请选择文章种类</option>
            <option value="Dressing">穿搭</option>
            <option value="Gastronomy">美食</option>
            <option value="MakeUp">彩妆</option>
            <option value="Filmtelevision">影视</option>
            <option value="Workplace">职场</option>
            <option value="Emotion">情感</option>
            <option value="Shome">家居</option>
            <option value="Game">游戏</option>
            <option value="Travel">旅行</option>
            <option value="Fitness">健身</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="content">文章内容</label>
        <textarea v-model="content" id="content" placeholder="输入文章内容" rows="6" required></textarea>
      </div>

      <button type="submit" class="publish-button">发布</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { userInfoStore } from '../../store/user';
import { ElMessage } from 'element-plus'; // 引入elemessage
import articleApi from '../../api/articleApi';

const userStore = userInfoStore();
const title = ref('');
const image = ref(''); // 这个将会是文件对象
const imagePreview = ref(''); // 添加预览的状态
const txtType = ref(''); // 修改为 txtType
const content = ref('');

// 引用文件输入
const fileInput = ref(null);

// 处理图片上传
const handleImageUpload = (event) => {
  const file = event.target.files[0]; // 获取用户选择的文件
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      image.value = e.target.result; // 将文件内容设置为 image
      imagePreview.value = e.target.result; // 设置预览图像
    };
    reader.readAsDataURL(file); // 将文件读取为 Data URL
  }
};

// 处理文件拖放
const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]; // 获取拖放的文件
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      image.value = e.target.result; // 将文件内容设置为 image
      imagePreview.value = e.target.result; // 设置预览图像
    };
    reader.readAsDataURL(file); // 将文件读取为 Data URL
  }
};

// 点击触发文件输入
const triggerFileInput = () => {
  fileInput.value.click(); // 触发文件输入点击事件
};

// 清除已上传的图片
const clearImage = () => {
  image.value = '';
  imagePreview.value = ''; // 清除预览图像
};

// 重置表单函数
const resetForm = () => {
  title.value = '';
  image.value = '';
  imagePreview.value = ''; // 清除预览图像
  txtType.value = ''; // 重置 txtType
  content.value = '';
};

const submitArticle = async () => {
  // 检查所有必填项是否填写
  if (!title.value || !image.value || !txtType.value || !content.value) {
    ElMessage({
      message: '请填写所有必填项',
      type: 'warning',
    });
    return;
  }

  const articleData = {
    title: title.value,
    img: image.value.split(',')[1], // 仅取出base64部分
    txtType: txtType.value,
    content: content.value,
    authorId: userStore.userThing.id, // 传入用户ID
  };

  try {
    await articleApi.addArticle(articleData); // 调用API提交数据
    ElMessage({
      message: '文章发布成功！',
      type: 'success',
    });
    resetForm(); // 成功发布后重置表单
  } catch (error) {
    ElMessage({
      message: '发布失败，请重试',
      type: 'error',
    });
  }
};
</script>

<style scoped>
.publish-wrapper {
  background-color: white;
  padding: 15px; /* 缩小内边距 */
  margin-left: 120px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 60%;
}

.publish-title {
  color: #ff2e4d;
  text-align: center;
  margin-bottom: 15px; /* 缩小标题下边距 */
  font-size: 22px; /* 缩小字体大小 */
}

.publish-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 10px; /* 缩小表单组的下边距 */
}

label {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px; /* 缩小标签下边距 */
  display: block;
}

input[type="text"],
select,
textarea {
  width: 100%;
  padding: 8px; /* 缩小内边距 */
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px; /* 缩小字体大小 */
  box-sizing: border-box;
}

input[type="file"] {
  display: none; /* 隐藏默认的文件输入 */
}

.image-upload {
  position: relative;
}

.upload-area {
  border: 2px dashed #ff2e4d;
  border-radius: 5px;
  height: 120px; /* 缩小上传区域的高度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.upload-icon {
  font-size: 25px; /* 缩小图标大小 */
  color: #ff2e4d;
}

.upload-text {
  margin-top: 8px; /* 缩小文字与图标之间的间距 */
  color: #333;
}

.uploaded-image {
  position: relative;
}

.image-preview {
  border-radius: 5px;
  width: 100%;
  height: 120px; /* 缩小预览图像的高度 */
  object-fit: cover; /* 适应容器 */
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  color: #ff2e4d;
  font-size: 18px; /* 缩小叉号大小 */
  cursor: pointer;
  padding: 4px;
}

.publish-button {
  padding: 10px;
  background-color: #ff2e4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px; /* 缩小字体大小 */
}

.publish-button:hover {
  background-color: #e62e4d;
}
</style>
