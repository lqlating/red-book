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
        <button class="reply-part" @click="handleReplyClick">
          <img class="reply" src="../../assets/img/_ico_reply.png" alt="回复">
          <span class="commentCount" v-show="subCommentCount != 0">{{ subCommentCount }}</span>
          <span class="commentCount" v-show="subCommentCount == 0 || grandparent_id">回复</span>
        </button>
      </div>
    </div>
  </div>
  <div v-if="visibleSubComments.length > 0" class="sub-comments">
    <Comment
      v-for="(subComment, index) in visibleSubComments"
      :key="subComment.comment_id"
      :comment="subComment"
      :article_id="article_id"
      :grandparent_id="comment.comment_id"
      v-bind="$attrs"
    />
    <button v-if="showMoreButtonText" class="show-more" @click="showMoreReplies">{{ showMoreButtonText }}</button>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { userInfoStore } from '../../store/user';
import { commentInfoStore } from '../../store/comment';
import axios from 'axios';
import { editInfoStore } from '../../store/isEdit';
import { storeToRefs } from 'pinia';

const editStore = editInfoStore();
const { isEditing } = storeToRefs(editStore);
const userStore = userInfoStore();
const commentStore = commentInfoStore();
const user_id = ref(userStore.userThing.id);

const props = defineProps(['comment', 'article_id', 'grandparent_id']);
const { comment, article_id, grandparent_id } = props;

const userName = ref('');
const avatar = ref('');
const isLiked = ref(false);
const localLikeCount = ref(comment.like_count);
const userInfo = reactive({});
const subComments = computed(() => commentStore.subCommentsByParentId[comment.comment_id] || []);
const visibleSubComments = ref([]);
const showMoreButtonText = ref('');

const subCommentUserName = ref('');

const subCommentCount = computed(() => subComments.value.length);

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

const loadSubComments = async () => {
  if (!grandparent_id) {
    await commentStore.getSubComments(comment.comment_id);
    updateVisibleSubComments();
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

const showMoreReplies = () => {
  visibleSubComments.value = subComments.value;
  showMoreButtonText.value = '';
};

const handleReplyClick = () => {
  isEditing.value = !isEditing.value;
  if (grandparent_id) {
    commentStore.grandparent_id = grandparent_id;
  } else {
    commentStore.grandparent_id = props.comment.comment_id;
  }
  if (!commentStore.parent_id) {
    commentStore.tempSubComment.parent_id = comment.comment_id;
  } else {
    commentStore.tempSubComment.parent_id = null;
  }
};

const updateVisibleSubComments = () => {
  if (subCommentCount.value > 1) {
    visibleSubComments.value = subComments.value.slice(0, 1);
    showMoreButtonText.value = `展开${subCommentCount.value - 1}条回复`;
  } else {
    visibleSubComments.value = subComments.value;
    showMoreButtonText.value = '';
  }
};

watch(subComments, () => {
  updateVisibleSubComments();
});

onMounted(() => {
  searchUserById(comment.user_id);
  loadSubComments();
  if (grandparent_id) {
    getuserbyCommentid(comment.parent_id);
  }
});
</script>

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
  max-width: 90%; /* 更改为90%以确保与父评论一致。 */
}

.sub-comments {
  margin-left: 40px; /* 调整为40px以匹配父评论的布局 */
  margin-top: 10px; /* 添加顶部边距 */
  margin-bottom: 20px; /* 添加底部边距 */
}

.sub-comment-item {
  margin-top: 10px; /* 添加子评论之间的边距 */
}

.subCommentUserName {
  color: #33333399;
}

.show-more {
  font-size: 14px;
  color: #13386c;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left; /* 更改为left，以使其与点赞按钮左端对齐 */
  display: block;
  margin-left: 32px; /* 确保与点赞按钮左端对齐 */
}
</style>
