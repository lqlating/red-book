<template>
  <div class="publish-wrapper">
    <h1 class="publish-title">发布文章</h1>
    <form @submit.prevent="submitArticle" class="publish-form">
      <div class="form-group">
        <label for="title">标题</label>
        <input v-model="title" type="text" id="title" placeholder="输入文章标题" required>
      </div>

      <div class="form-group">
        <label for="image">图片链接</label>
        <input v-model="image" type="text" id="image" placeholder="输入图片链接" required>
      </div>

      <div class="form-group">
        <label for="category">文章种类</label>
        <div class="select-wrapper">
          <select v-model="category" id="category" required>
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
const image = ref('');
const category = ref('');
const content = ref('');

// 重置表单函数
const resetForm = () => {
  title.value = '';
  image.value = '';
  category.value = '';
  content.value = '';
};

const submitArticle = async () => {
  // 检查所有必填项是否填写
  if (!title.value || !image.value || !category.value || !content.value) {
    ElMessage({
      message: '请填写所有必填项',
      type: 'warning',
    });
    return;
  }

  const articleData = {
    title: title.value,
    imgUrl: image.value,
    txtType: category.value,
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
/* 保持样式不变 */
.publish-wrapper {
  background-color: white;
  padding: 20px;
  margin-left: 120px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 60%;
}

.publish-title {
  color: #ff2e4d;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.publish-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #ff2e4d;
}

.select-wrapper {
  max-height: 200px;
  overflow-y: auto;
  position: relative;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.select-wrapper::-webkit-scrollbar {
  display: none;
}

.publish-button {
  background-color: #ff2e4d;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.publish-button:hover {
  background-color: #e02640;
}
</style>
