<script setup>
import axios from 'axios';
import { onMounted, reactive, ref, computed, watch } from 'vue';
import object from 'lodash-es/object';
import Comment from '../comment/Comment.vue';
import ReplyPart from '../comment/replyPart.vue';
import { userInfoStore } from '../../store/user';
import { storeToRefs } from 'pinia';
import { commentInfoStore } from '../../store/comment';

const commentStore = commentInfoStore();
const { getComments, commentsByArticleId } = commentStore;

const userStore = userInfoStore();
const userThing = storeToRefs(userStore);
const { showLogin } = storeToRefs(userStore);
let props = defineProps(['article']);
let isHover = ref(false);
let commentCount = ref();
const title = ref(props.article.title);
const img_url = ref(props.article.img_url);
let like_count = ref(props.article.like_count);
let star_count = ref(props.article.star_count);
const author_id = ref(props.article.author_id);
const content = ref(props.article.content);
const article_id = ref(props.article.article_id);
var publication_time = ref(props.article.publication_time);
const address = ref(props.article.address);
let like = ref(false);
let userInfo = reactive({});
let userName = ref('');
let avatar = ref('');
let article_inner = ref(false);
publication_time = publication_time.value.substring(0, 10);

const comment_content = computed(() => commentsByArticleId[article_id.value] || []);

async function newgetComment() {
  await getComments(article_id.value);
}

async function searchUserById(Author_id) {
  let res = await axios.get(`http://localhost:8080/SearchUserById/${Author_id}`);
  object.assign(userInfo, res.data.data);
  
  userName.value = userInfo[0].username;
  avatar.value = userInfo[0].avatar;
}

async function getCommentCount() {
  try {
    const res = await axios.get(`http://localhost:8080/getCommentCount/${article_id.value}`);
    commentCount.value = res.data;
  } catch (error) {
    console.error('获取评论数量失败：', error);
  }
}

function addLike() {
  axios.post(`http://localhost:8080/addLike/${article_id.value}`)
    .then(() => {
      like_count.value++;
    })
    .catch(error => {
      console.error('点赞失败：', error);
    });
}

function subLike() {
  axios.post(`http://localhost:8080/subLike/${article_id.value}`)
    .then(() => {
      like_count.value--;
    })
    .catch(error => {
      console.error('点赞失败：', error);
    });
}

function likeThing() {
  like.value = !like.value;
}

function unlikeThing() {
  like.value = !like.value;
}

async function getCommentThing() {
  await newgetComment();
  await getCommentCount();
  article_inner.value = true;
}

function subscribe(isLogin) {
  if (!showLogin.value) {
    showLogin.value = true;
  } else {
    console.log('sub');
  }
}

onMounted(() => {
  searchUserById(author_id.value);
});

// 监听 commentsByArticleId 中指定 article_id 的变化

</script>

<template>
  <div class="article-inner" v-show="article_inner">
    <span class="article_img_inner"><img :src="img_url" alt=""></span>
    <span>
      <div class="user-inner">
        <img :src="avatar" alt="">
        <span class="username-info">{{ userName }}</span>
        <span class="subscribe" @click="subscribe(userThing.isLogin.value)">关注</span>
      </div>
      <div class="article-comment">
        <div class="articleContent">
          <div class="inner-title">{{ title }}</div>
          <div class="inner-content">{{ content }}</div>
          <div class="date">{{ publication_time }}  {{ address }}</div>
          <hr class="article-comment-hr">
          <div class="comment_count">共 <span>{{ commentCount }}</span> 条评论</div>
          <Comment class="subcomment" :comment="comment" v-for="comment in comment_content" :article_id="article_id"></Comment>
          <div class="end"> -THE END-</div>
        </div>
      </div>
      <ReplyPart :commentCount="commentCount" :like_count="like_count" :star_count="star_count" :article_id="article_id" :like="like"></ReplyPart>
    </span>
  </div>
  <div class="mask" v-show="article_inner" @click="article_inner = false"></div>
  <div class="content-item article-container">
    <div class="main-area" @click="getCommentThing()">
      <img class="img-area" :src="img_url" alt="">
      <div class="txt-area">{{ title }}</div>
    </div>
    <div class="article-bottom">
      <div>
        <span class="userthing">
          <span class="avatar"><img class="userAvatar" :src="avatar"></span>
          <span class="username">{{ userName }}</span>
          <span v-show="!like" @click="addLike"><img class="heart" @click="likeThing(like)" src="../../assets/img/heart.png" alt=""></span>
          <span v-show="like" @click="subLike"><img class="red_heart" @click="unlikeThing(like)" src="../../assets/img/red_heart.png" alt=""></span>
          <span class="likeCount">{{ like_count }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-item {
  width: 17%;
  margin: 5px;
  height: auto;
  display: inline-block;
  justify-content: center;
  margin-bottom: 20px;
}

.date {
  font-size: 14px;
  color: #33333399;
  font-weight: 520;
}

.article-inner {
  display: flex;
  position: fixed;
  background-color: white;
  width: 880px;
  height: 600px;
  z-index: 999999;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  overflow: hidden;
}

.comment_count {
  margin-bottom: 10px;
  font-size: 14px;
  color: #33333399;
}

.article-inner .article_img_inner {
  width: 53%;
  height: 100%;
  border-right: 1px solid #f1eeee;
}

.article_img_inner + span {
  width: 47%;
}

.article-inner img {
  width: 100%;
  height: 100%;
}

.articleContent {
  padding: 24px;
}

.articleContent .inner-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.inner-content {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 24px;
}

.user-inner {
  border-bottom: 0.1px solid rgb(232, 223, 223);
  box-sizing: border-box;
  height: 88.8px;
  padding: 24px;
  width: 100%;
}

.user-inner img {
  margin-right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgb(205, 189, 189);
}

.username-info {
  color: #666666cc;
  height: 40px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.article-comment-hr {
  border: 0.0001px solid rgb(236, 233, 233);
}

.article-comment::-webkit-scrollbar {
  display: none;
}

.article-comment {
  height: 439.2px;
  overflow: auto;
}

.user-inner {
  display: flex;
  align-items: center;
}

.subscribe {
  font-weight: bold;
  margin-left: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #FF2E4D;
  cursor: pointer;
  border-radius: 100px;
  width: 96px;
  height: 40px;
}

.mask {
  height: 706.8px;
  width: 1920px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(31, 29, 29, 0.5);
  z-index: 9999;
}

.main-area {
  cursor: pointer;
}

.txt-area {
  height: 40px;
  width: 188px;
  margin-top: 10px;
  padding: 0 20px;
  font-size: 14px;
  margin-left: -12px;
  margin-bottom: 5px;
  color: #555555;
}

.img-area {
  border-radius: 25px;
  height: 280px;
}

.article-bottom {
  border: 10px 14px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.userthing {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-size: 13.8px;
  justify-content: space-between;
}

.username {
  max-width: 118px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
  width: 100px;
}

.userAvatar {
  margin-top: 2.5px;
  width: 20px;
  height: 20px;
  border: 0.5px solid slategray;
  border-radius: 50%;
  margin-right: 7px;
}

.heart {
  margin-top: 5px;
  width: 13px;
  height: 12px;
  margin-right: 5px;
  cursor: pointer;
}

.red_heart {
  margin-top: 5px;
  width: 13px;
  height: 15px;
  margin-right: 5px;
  cursor: pointer;
}

.likeCount {
  font-size: 13.8px;
}

.backImg {
  height: 100%;
  width: 100%;
}

.end {
  color: #33333399;
  font-size: 12px;
  margin: 10px 150px;
}
</style>
