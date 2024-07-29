<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { userInfoStore } from '../../store/user';
import { ElMessage } from 'element-plus';  // 引入 Element UI 的消息提示组件
import { commentInfoStore } from '../../store/comment';

const commentStore = commentInfoStore();
const { submitComment } = commentStore;
const userStore = userInfoStore();
const user_id = ref(userStore.userThing.id);
const props = defineProps(['commentCount', 'like_count', 'star_count', 'article_id', 'like', 'comments']);
const like = ref(props.like);
const star_result = ref(false);
const like_count = ref(props.like_count);
const star_count = ref(props.star_count);
const article_id = props.article_id;
const isEditing = ref(false); // 控制输入框状态
const commentText = ref(''); // 绑定输入框内容
const comment = reactive({}); // 定义为空对象

async function newsubmitComment() {
  Object.assign(comment, {
    content: commentText.value,
    article_id: article_id,
    user_id: user_id.value,
    parent_id: null
  });

  await submitComment(comment);
  commentText.value = '';
  isEditing.value = false; // 切换回初始状态
}

function addLike() {
  axios.post(`http://localhost:8080/addLike/${article_id}`)
    .then(() => {
      like_count.value++;
      like.value = !like.value;
    })
    .catch(error => {
      console.error('点赞失败：', error);
    });
}

function subLike() {
  axios.post(`http://localhost:8080/subLike/${article_id}`)
    .then(() => {
      like_count.value--;
      like.value = !like.value;
    })
    .catch(error => {
      console.error('取消点赞失败：', error);
    });
}

function addStar() {
  axios.post(`http://localhost:8080/addStar/${article_id}`)
    .then(() => {
      star_count.value++;
      star_result.value = !star_result.value;
    })
    .catch(error => {
      console.error('收藏失败：', error);
    });
}

function subStar() {
  axios.post(`http://localhost:8080/subStar/${article_id}`)
    .then(() => {
      star_count.value--;
      star_result.value = !star_result.value;
    })
    .catch(error => {
      console.error('取消收藏失败：', error);
    });
}

function toggleEdit() {
  isEditing.value = !isEditing.value;
}

function cancelEdit() {
  isEditing.value = false;
}
</script>

<template>
  <div class="post-comment">
    <input 
      class="comment_place" 
      placeholder="说点什么" 
      type="text" 
      v-model="commentText"
      @click="toggleEdit"
    >
    <transition name="fade">
      <div v-if="!isEditing" class="icon-container">
        <div>
          <img v-show="!like" @click="addLike" class="heart" src="../../assets/img/heart.png" alt="">
          <img v-show="like" @click="subLike" class="red_heart" src="../../assets/img/red_heart.png" alt="">
          <span class="down_thing">{{ like_count }}</span>
        </div>
        <div>
          <img v-show="!star_result" @click="addStar" class="star" src="../../assets/img/star.png" alt="">
          <img v-show="star_result" @click="subStar" class="star" src="../../assets/img/star_1.png" alt="">
          <span class="down_thing">{{ star_count }}</span>
        </div>
        <div>
          <img class="reply" @click="toggleEdit" src="../../assets/img/_ico_reply.png" alt="">
          <span class="down_thing">{{ props.commentCount }}</span>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="isEditing" class="edit-container">
        <span class="aite">@</span>
        <button 
          @click="newsubmitComment(comment)" 
          :class="{'disabled': commentText.length === 0}" 
          class="go"
        >
          发送
        </button>
        <button @click="cancelEdit" class="cancel">取消</button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.post-comment {
  border-top: 0.1px solid rgb(232, 223, 223);
  height: 72.8px;
  padding: 0px 0px 0px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.comment_place {
  border-radius: 20px;
  width: 165.7px;
  height: 40px;
  background-color: #f3f3f3;
  border: none;
}

.down_thing {
  font-weight: 500;
  margin-left: 4px;
  vertical-align: 5px;
  font-size: 14px;
  color: #333333;
}

.comment_place:focus {
  outline: none;
}

.icon-container {
  right: 33px;
}

.icon-container,
.edit-container {
  display: flex;
  align-items: center;
  position: absolute;
  right: 16px;
}

.icon-container div,
.edit-container span,
.edit-container button {
  margin-left: 8px;
}

.heart,
.red_heart,
.reply,
.star {
  width: 22px;
  height: 20px;
  margin-top: 10px;
  cursor: pointer;
}

.aite {
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.go,
.cancel {
  width: 64px;
  height: 40px;
  margin-right: 15px;
  border-radius: 44px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.go {
  font-weight: bold;
  color: white;
  background-color: #ff2442;
  border: none;
  font-size: 16px;
}

.go.disabled {
  background-color: #ffd5db;
}

.cancel {
  font-weight: bold;
  font-size: 16px;
  border: 0.5px solid #a8a5a5;
  background-color: white;
}

/* 定义 fade 过渡效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 全局样式 */
:deep(.el-message) {
  z-index: 9999 !important;
}
</style>
