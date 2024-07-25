<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { userInfoStore } from '../../store/user';
import { storeToRefs } from 'pinia';
const userStore = userInfoStore()
const user_id = ref(userStore.userThing.id);
// console.log(user_id.value)
// 设置属性并定义需要的变量
const props = defineProps(['comment', 'article_id', 'grandparent_id']);
const { comment, article_id, grandparent_id} = props;
const userName = ref('');
const avatar = ref('');
const subCommentCount = ref('');
const isLiked = ref(false);
const localLikeCount = ref(comment.like_count);
const userInfo = reactive({});
const subComments = ref([]);
const subCommentUserName = ref('');

const getuserbyCommentid = async (c_id) => {
  if (grandparent_id) {
    try {
      const res = await axios.get(`http://localhost:8080/getUserByCommentId/${c_id}`);
      subCommentUserName.value = res.data.data[0].username;
      
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  }
};

const getsubCommentCount = async (p_id) => {
  if (!grandparent_id) {
    try {
      const res = await axios.get(`http://localhost:8080/getCommentCountByParentId/${p_id}`);
      subCommentCount.value = res.data.data;
    } catch (error) {
      console.error('加载子评论数量失败:', error);
    }
  }
};

const getsubComments = async (p_id) => {
  if (!grandparent_id) {
    try {
      const res = await axios.get(`http://localhost:8080/getCommentsByParentId/${p_id}`);
      subComments.value = res.data.data;
    } catch (error) {
      console.error('获取子评论失败:', error);
    }
  }
};

const searchUserById = async (userId) => {
  try {
    const res = await axios.get(`http://localhost:8080/SearchUserById/${userId}`);
    Object.assign(userInfo, res.data.data);
    userName.value = userInfo[0].username;
    avatar.value = userInfo[0].avatar;
  } catch (error) {
    console.error('搜索用户失败：', error);
  }
};

const toggleLike = () => {
  isLiked.value = !isLiked.value;
  localLikeCount.value += isLiked.value ? 1 : -1;
};

onMounted(() => {
  searchUserById(comment.user_id);
  getsubCommentCount(comment.comment_id);
  if(!grandparent_id){
    getsubComments(comment.comment_id);
    
  }
  
  if (grandparent_id) {
    getuserbyCommentid(comment.parent_id);
    // console.log(comment.parent_id,grandparent_id,props.comment)
    // console.log(subComments.value);
  }
  
});
</script>

<template>
  <div :class="['main-area', { subcomment: grandparent_id }]" v-bind="$attrs">
    <div class="img-wrapper">
      <img :src="avatar" :style="{ width: grandparent_id ? '24px' : '40px', height: grandparent_id ? '24px' : '40px' }" alt="">
    </div>
    <div class="content-wrapper">
      <div class="username">{{ userName }}</div>
      <div class="content">
        <span v-if="grandparent_id && comment.parent_id != grandparent_id">
          
          回复 
          
        <span class="subCommentUserName">{{ subCommentUserName }}</span>:

        </span>{{ comment.content }}

      </div>
      <div class="publish_date">{{ comment.publish_time }}</div>
      <div class="icons">
        <button class="like" @click="toggleLike">
          <img v-show="!isLiked" class="heart" src="../../assets/img/heart.png" alt="未点赞">
          <img v-show="isLiked" class="heart" src="../../assets/img/red_heart.png" alt="已点赞">
          <span v-show="localLikeCount != 0">{{ localLikeCount }}</span>
          <span v-show="localLikeCount == 0">赞</span>
        </button>
        <button class="reply-part" @click="reply">
          <img class="reply" src="../../assets/img/_ico_reply.png" alt="回复">
          <span class="commentCount" v-show="subCommentCount != 0">{{ subCommentCount }}</span>
          <span class="commentCount" v-show="subCommentCount == 0 || grandparent_id">回复</span>
        </button>
      </div>
    </div>
  </div>
  <div v-if="subComments.length > 0" class="sub-comments">
    <Comment
      v-for="subComment in subComments"
      :key="subComment.comment_id"
      :comment="subComment"
      :article_id="article_id"
      :grandparent_id="comment.comment_id"
      v-bind="$attrs"
    />
  </div>
</template>

<style scoped>
.main-area {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px; /* 添加底部边距 */
}

.img-wrapper {
  flex-shrink: 0;
}

.img-wrapper img {
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

.like {
  color: #333333cc;
  font-weight: 500;
  font-size: 12px;
}

.heart {
  width: 15px;
  height: 15px;
}

.reply {
  width: 16px;
  height: 16px;
}

.reply-part {
  margin-left: -10px;
  font-weight: 500;
  color: #333333cc;
  font-size: 12px;
}

.commentCount {
  margin-left: -2px;
}

.subcomment .content-wrapper {
  max-width: 90%; /* 更改为90%以确保与父评论一致 */
}

.sub-comments {
  margin-left: 40px; /* 调整为40px以匹配父评论的布局 */
  margin-top: 10px; /* 添加顶部边距 */
  margin-bottom: 20px; /* 添加底部边距 */
}

.sub-comment-item {
  margin-top: 10px; /* 添加子评论之间的边距 */
}
.subCommentUserName{
  color: #33333399;
}
</style>
