<template>
  <div class="post-comment">
    <input 
      class="comment_place" 
      placeholder="说点什么..." 
      type="text" 
      v-model="commentText"
      @click="openEdit()"
    >
    <transition name="fade">
      <div v-if="!isEditing" class="icon-container">
        <div class="like-container">
          <i id="iMid" :class="[ like ? 'fas fa-heart red-heart' : 'far fa-heart']" @click="toggleLike"></i>
          <span class="down_thing">{{ like_count }}</span>
        </div>
        <div class="star-container">
          <img v-show="!star_result" @click="addStar" class="star mid" src="../../assets/img/star.png" alt="">
          <img v-show="star_result" @click="subStar" class="star mid" src="../../assets/img/star_1.png" alt="">
          <span class="down_thing">{{ star_count }}</span>
        </div>
        <div class="reply-container">
          <img class="reply mid" @click="toggleEdit" src="../../assets/img/_ico_reply.png" alt="">
          <span class="down_thing">{{ props.commentCount }}</span>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="isEditing" class="edit-container">
        <span class="aite">@</span>
        <button 
          @click="tempSubComment.parent_id ? newSubmitSubComment() : newsubmitComment()" 
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

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { userInfoStore } from '../../store/user';
import { commentInfoStore } from '../../store/comment';
import { editInfoStore } from '../../store/isEdit';
import { storeToRefs } from 'pinia';

const editStore = editInfoStore();
const { isEditing } = storeToRefs(editStore);
const commentStore = commentInfoStore();
const { submitComment, submitSubComment, tempSubComment, grandparent_id } = commentStore;
const userStore = userInfoStore();
const user_id = ref(userStore.userThing.id);
const props = defineProps(['commentCount', 'like_count', 'star_count', 'article_id', 'like', 'comments']);
const like = ref(props.like);
const star_result = ref(false);
const like_count = ref(props.like_count);
const star_count = ref(props.star_count);
const article_id = props.article_id;
const commentText = ref('');

async function newsubmitComment() {
  await submitComment({
    content: commentText.value,
    article_id,
    user_id: user_id.value,
  });
  commentText.value = '';
  isEditing.value = false;
}

async function newSubmitSubComment() {
  Object.assign(tempSubComment, {
    content: commentText.value,
    article_id: article_id,
    user_id: user_id.value,
    // parent_id: props.parent_id,
  });
  await submitSubComment();
  commentText.value = '';
  isEditing.value = false;
}

function toggleLike() {
  if (like.value) {
    subLike();
  } else {
    addLike();
  }
}

function addLike() {
  axios.post(`http://localhost:8080/addLike/${article_id}`)
    .then(() => {
      like_count.value++;
      like.value = true;
    })
    .catch(error => {
      console.error('点赞失败：', error);
    });
}

function subLike() {
  axios.post(`http://localhost:8080/subLike/${article_id}`)
    .then(() => {
      like_count.value--;
      like.value = false;
    })
    .catch(error => {
      console.error('取消点赞失败：', error);
    });
}

function addStar() {
  axios.post(`http://localhost:8080/addStar/${article_id}`)
    .then(() => {
      star_count.value++;
      star_result.value = true;
    })
    .catch(error => {
      console.error('收藏失败：', error);
    });
}

function subStar() {
  axios.post(`http://localhost:8080/subStar/${article_id}`)
    .then(() => {
      star_count.value--;
      star_result.value = false;
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

function openEdit() {
  isEditing.value = true;
}
</script>

<style scoped>
.post-comment {
  border-top: 0.1px solid rgb(232, 223, 223);
  height: 72.8px;
  padding: 0 0 0 16px;
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
  text-indent: 16px;
}

.comment_place:focus {
  outline: none;
}

.icon-container{
  display: flex;
  align-items: center;
  position: absolute;
  right: 35px;
}
.edit-container {
  display: flex;
  align-items: center;
  position: absolute;
  right: 11px;
  
}

.icon-container div,
.edit-container span,
.edit-container button {
  margin-left: 8px;
}

.like-container,
.star-container,
.reply-container {
  display: flex;
  align-items: center;
}

.like-container .fas.fa-heart.red-heart {
  color: #FF0000;
}

.down_thing {
  font-weight: 500;
  margin-left: 4px;
  font-size: 14px;
  color: #333333;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  height: 20px; /* 与图标的高度一致 */
}

.fas.fa-heart,
.far.fa-heart,
.reply,
.star {
  width: 22px;
  height: 20px;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.mid{
  margin-top: -1px;
}
html  #iMid{
  margin-top: -1px;
  margin-right: -3px;
  
}
</style>
