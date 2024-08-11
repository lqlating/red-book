<script setup>
import { ref } from 'vue';
import { commentInfoStore } from '../../../store/comment';
const commentStore = commentInfoStore()
const {submitSubComment,tempSubComment} = commentStore
const props = defineProps(['isComment', 'replyComment','user_id']);
const isComment = props.isComment;
const isLiked = ref(false);
const isReplying = ref(false);
const replyText = ref("");
const {article_id,comment_id} = props.replyComment
console.log(props.user_id,article_id)
// 切换点赞状态
function toggleLike() {
  isLiked.value = !isLiked.value;
}

// 开始回复
function startReply() {
  isReplying.value = true;
}

// 取消回复
function cancelReply() {
  isReplying.value = false;
  replyText.value = "";
}
function submitcomment(){
    Object.assign(tempSubComment,{
        content:replyText.value,
        user_id:props.user_id,
        article_id:article_id,
        parent_id:comment_id
    }),
    submitSubComment()
    replyText.value = '',
    isReplying.value = false
}
// 处理输入框内容变化
function handleInput(event) {
  replyText.value = event.target.value;
}
</script>

<template>
  <div class="main-body">
    <span class="avatar">
      <img class="avatar-inner" :src="props.replyComment.avatar" alt="">
    </span>

    <span class="txt-area">
      <div class="reply_name">
        <slot name="reply_name"></slot>
      </div>
      <div class="reply_date">
        <span v-if="isComment">回复</span>
        <span v-if="!isComment">赞</span>了你的评论 <span><slot name="date"></slot></span>
      </div>
      <div class="reply_txt">
        <slot name="reply_txt"></slot>
      </div>
      <div class="bereplyed_txt">
        <span class="blank"></span><slot name="bereplyed_txt"></slot>
      </div>
      <div class="two_button">
        <!-- 无过渡动画 -->
        <div v-if="!isReplying" class="reply_button" @click="startReply">
          <i class="fa-regular fa-comment" style="font-size: 20px; margin-right: 8px;"></i>
          回复
        </div>
        <div v-if="!isReplying" class="like_button" @click="toggleLike">
          <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
        </div>
        <!-- 无过渡动画 -->
        <div v-if="isReplying" class="reply_input_area">
          <input class="reply_input" v-model="replyText" @input="handleInput" :placeholder="'回复 ' + props.replyComment.username" />
          <button 
            @click="submitcomment"
            :class="['send_button', { active: replyText }]" 
            :disabled="!replyText"
          >
            发送
          </button>
          <button @click="cancelReply" class="cancel_button">取消</button>
        </div>
      </div>
    </span>

    <span class="article-face">
      <img class="article-inner" :src="props.replyComment.article_bark" alt="">
    </span>
  </div>
  
  <div class="separator"></div>
</template>

<style scoped>
.reply_name, .reply_date, .reply_txt, .bereplyed_txt {
  margin-bottom: 5px;
}

.main-body {
  padding-top: 20px;
  width: 100%;
  display: flex;
  align-items: flex-start;
}

.avatar {
  overflow: hidden;
  height: 48px;
  width: 48px;
  border-radius: 50%;
  background-color: rgb(136, 120, 120);
}

.avatar-inner {
  width: 100%;
  height: 100%;
}

.reply_date {
  font-size: 14px;
  color: #33333399;
}

.txt-area {
  width: auto;
  height: 148.5px;
  flex-grow: 1;
  margin: 0 23px;
}

.reply_txt {
  font-size: 14px;
  color: #333333;
}

.article-face {
  height: auto;
  width: 48px;
  border-radius: 5px;
  background-color: bisque;
  overflow: hidden;
}

.article-inner {
  width: 100%;
  height: 100%;
}

.reply_name {
  font-size: 16px;
  color: #333333;
  font-weight: 600;
}

.blank {
  display: inline-block;
  height: 17px;
  width: 4px;
  background-color: #00000014;
  border-radius: 8px;
  margin-right: 4px;
}

.bereplyed_txt {
  margin-bottom: 12px;
  font-size: 12px;
  color: #33333399;
  display: flex;
  align-items: center;
}

.two_button {
  display: flex;
  gap: 10px;
}

.reply_button {
  color: #000000cc;
  font-size: 16px;
  width: 88px;
  height: 40px;
  background-color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333333;
  border: 0.1px solid rgb(216, 205, 205);
  cursor: pointer;
}

.like_button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 0.1px solid rgb(216, 205, 205);
  cursor: pointer;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  font-size: 16px;
}

.reply_input_area {
  display: flex;
  align-items: center;
  width: 100%;
}

.reply_input {
    outline: none;
  flex-grow: 1;
  border: 0.1px solid rgb(216, 205, 205);
  border-radius: 18px;
  padding: 0 10px;
  height: 40px; /* 高度与回复按钮一致 */
}

.send_button, .cancel_button {
  margin-left: 10px;
  padding: 6px 12px;
  width: 60px;
  font-size: 16px;
  height: 40px; /* 高度与回复按钮一致 */
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send_button {
  font-weight: 600;
  background-color: #ff2442;
  color: white;
  border: none;
}

.send_button:disabled {
  background-color: #ffd5db;
  cursor: not-allowed;
}

.cancel_button {
  background-color: #ffffff;
  border: 1px solid #d7d2d3;
  color: #333333cc;
}

/* 去除 fade 过渡效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
