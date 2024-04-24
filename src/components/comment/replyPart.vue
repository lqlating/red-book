<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps(['commentCount', 'like_count', 'star_count', 'article_id','like']);
// 使用 ref 创建响应式对象
const like = ref(props.like)
let star_result = ref(false)

const like_count = ref(props.like_count);
const star_count = ref(props.star_count);
const article_id = props.article_id;
function addLike() {
  axios.post(`http://localhost:8080/addLike/${article_id}`)
    .then(() => {
      like_count.value++; // 更新 like_count 的值，触发响应式更新
      like.value = !like.value
    })
    .catch(error => {
      console.error('点赞失败：', error);
    });
}

function subLike() {
  axios.post(`http://localhost:8080/subLike/${article_id}`)
    .then(() => {
      like_count.value--; // 更新 like_count 的值，触发响应式更新
      like.value = !like.value
    })
    .catch(error => {
      console.error('点赞失败：', error);
    });;
}
function addStar() {
  axios.post(`http://localhost:8080/addStar/${article_id}`)
    .then(() => {
      // 更新 ref 对象的值
      star_count.value++; // 更新 star_count 的值，触发响应式更新
      star_result.value = !star_result.value
    })
    .catch(error => {
      console.error('点赞失败：', error);
    });
}

function subStar() {
  axios.post(`http://localhost:8080/subStar/${article_id}`)
    .then(() => {
      // 更新 ref 对象的值
      star_count.value--; // 更新 star_count 的值，触发响应式更新
      star_result.value = !star_result.value
    })
    .catch(error => {
      console.error('点赞失败：', error);
    });
}
// onMounted(()=>{
//   console.log(props)
// })
</script>

<template>
  <div class="post-comment">
    <input class="comment_place" type="text">
    <div>
      <img v-show="!like" @click="addLike" class="heart" src="../../assets/img/heart.png" alt="">
      <img v-show="like" @click="subLike" class="red_heart" src="../../assets/img/red_heart.png" alt="">
      <!-- <img v-show="!star_result" class="heart" src="../../assets/img/red_heart.png" alt=""> -->
      <span class="down_thing">{{ like_count }}</span>
    </div>
    <div><img class="reply" src="../../assets/img/_ico_reply.png" alt=""><span class="down_thing">{{ props.commentCount
        }}</span></div>
    <div>
      <img v-show="!star_result" @click="addStar" class="star" src="../../assets/img/star.png" alt="">
      <img v-show="star_result" @click="subStar" class="star" src="../../assets/img/star_1.png" alt="">
      <span class="down_thing">{{ star_count }}</span>
    </div>
  </div>
</template>

<style scoped>
.post-comment {
  border-top: 0.1px solid rgb(232, 223, 223);
  height: 72.8px;
  padding: 16px 16px 16px 0px;
  display: flex;
  justify-content: space-around;
}

.comment_place {
  border-radius: 20px;
  width: 165.7px;
  height: 40px;
  background-color: #f3f3f3;
  border: none;
}

.down_thing {
  margin-left: 4px;
  vertical-align: 5px;
  font-size: 14px;
  color: #333333;
}

.comment_place:focus {
  outline: none;
}
.heart{
  width: 22px;
  height: 20px;
  margin-top: 10px;
  margin-left: -40px;
}
.red_heart {
  width: 22px;
  height: 20px;
  margin-top: 10px;
  margin-left: -40px;
}

.reply,
.star {
  margin-left: -40px;
  margin-top: 8px;
  width: 22px;
  height: 22px;
}
</style>
