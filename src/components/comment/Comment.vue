<script setup>
import axios from 'axios';
import { ref, onMounted, reactive } from 'vue';

let props = defineProps(['comment','article_id']);
let userName = ref('');
let avatar = ref('');
let subCommentCount = ref('')
const { publish_time: publish_time, like_count: like_count, content: comment_content, user_id: userId,comment_id:comment_id } = props.comment;
// const {article_id:aritcle_id} = props.article_id
let userInfo = reactive({});
let isLiked = ref(false);
let localLikeCount = ref(like_count);

async function getsubCommentCount(commentid){
  let res = await axios.get(`http://localhost:8080/getReplyCountByCommentId/${commentid}`);
  subCommentCount.value = res.data.data;
}
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

function toggleLike() {
  isLiked.value = !isLiked.value;
  localLikeCount.value += isLiked.value ? 1 : -1;
}

function reply() {
  // 处理回复逻辑
}

onMounted(() => {
  searchUserById(userId);
  getsubCommentCount(comment_id);
  console.log(comment_id,props.article_id)
});
</script>

<template>
  <div class="main-area">
    <div class="img-wrapper"><img :src="avatar" alt=""></div>
    <div class="content-wrapper">
      <div class="username">{{ userName }}</div>
      <div class="content">{{ comment_content }}</div>
      <div class="publish_date">{{ publish_time }}</div>
      <div class="icons">
        <button class="like" @click="toggleLike">
          <img v-show="!isLiked" class="heart" src="../../assets/img/heart.png" alt="未点赞">
          <img v-show="isLiked" class="heart" src="../../assets/img/red_heart.png" alt="已点赞">
          <span v-show="localLikeCount != 0">{{ localLikeCount }}</span>
          <span v-show="localLikeCount==0">赞</span>
          
        </button>
        <button class="reply-part" @click="reply">
          <img class="reply" src="../../assets/img/_ico_reply.png" alt="回复">
          <span class="commentCount" v-show="subCommentCount!=0">{{subCommentCount}}</span>
          <span class="commentCount" v-show="subCommentCount==0">评论
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-area {
  display: flex;
  align-items: flex-start;
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
  text-align: justify;
  word-break: break-all;
  hyphens: auto;
  margin-bottom: 4px;
}

.publish_date {
  font-size: 12px;
  color: #33333399;
}

.main-area {
  margin-bottom: 20px;
}

.icons {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 10px;
}

button img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.like{
  color: #333333cc;
  font-weight: 500;
  font-size: 12px;
}
.heart{
  
  width: 15px;
  height: 15px;
}
.reply{
  width: 16px;
  height: 16px;
}
.reply-part{
  margin-left: -10px;
  font-weight: 500;
  color: #333333cc;
  font-size: 12px;
}
.commentCount{
  margin-left: -3px
}
</style>
