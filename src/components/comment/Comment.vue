<script setup>
import axios from 'axios';
import { ref, onMounted, reactive } from 'vue';

let props = defineProps(['comment']);
let userName = ref('');
let avatar = ref('');
const { publish_time:publish_time} = props.comment
const { content: comment_content } = props.comment;
const { user_id: userId } = props.comment;


let userInfo = reactive({});

async function searchUserById(Author_id) {
  try {
    let res = await axios.get(`http://localhost:8080/SearchUserById/${Author_id}`);
    Object.assign(userInfo, res.data.data);
    userName.value = userInfo[0].username;
    avatar.value = userInfo[0].avatar;

  } catch (error) {
    console.error('搜索用户失败：', error);
  }
}

onMounted(() => {
  searchUserById(userId);
});
</script>
<template>
  <div class="main-area">
    <div class="img-wrapper"><img :src="avatar" alt=""></div>
    <div class="content-wrapper">
      <div class="username">{{ userName }}</div>
      <div class="content">{{ comment_content }}</div>
      <div class="publish_date">{{publish_time}}</div>
    </div>
  </div>
</template>

<style scoped>
.main-area {
  display: flex;
  align-items: flex-start;
  /* 将项目顶部对齐 */
  gap: 10px;
}

.img-wrapper {
  width: 40px;
}

.img-wrapper img {
  width: 100%;
  height: auto;
  border-radius: 50%;
}

.content-wrapper {
  flex: 1;
}

.username {
  color: #33333399;
  font-size: 14px;
  margin-bottom: 4px;
}

.content {
  font-size: 14px;
  color: #333333;
  text-align: justify; /* 两端对齐 */
  word-break: break-all; /* 单词截断 */
  hyphens: auto; /* 自动添加连字符 */
  margin-bottom: 4px;
}
.publish_date{
  font-size: 12px;
  color: #33333399;
}
.main-area {
  margin-bottom: 20px;
}
</style>
