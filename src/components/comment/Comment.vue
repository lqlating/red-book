<template>
  <div :class="['main-area', { subcomment: grandparent_id }]" v-bind="$attrs">
    <div class="img-wrapper">
      <img :src="`data:image/png;base64,${avatar}`"
        :style="{ width: grandparent_id ? '24px' : '40px', height: grandparent_id ? '24px' : '40px' }" alt="">
    </div>
    <div class="content-wrapper">
      <div class="username">{{ userName }}</div>
      <div class="content">
        <span v-if="grandparent_id && comment.parent_id !== grandparent_id">
          回复
          <span class="subCommentUserName">{{ subCommentUserName }}</span>:
        </span>{{ comment.content }}
      </div>
      <div class="publish_date">{{ comment.publish_time }}</div>
      <div class="icons">
        <button class="like" @click="toggleLike">
          <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'" class="heart"></i>
          <span class="like_count" v-show="localLikeCount !== 0">{{ localLikeCount }}</span>
          <span class="like_count" v-show="localLikeCount === 0">赞</span>
        </button>
        <button class="reply-part" @click="handleReplyClick">
          <img class="reply" src="../../assets/img/_ico_reply.png" alt="回复">
          <span class="commentCount" v-show="subCommentCount !== 0">{{ subCommentCount }}</span>
          <span class="commentCount" v-show="subCommentCount === 0 || grandparent_id">回复</span>
        </button>
      </div>
    </div>
  </div>

  <div v-if="visibleSubComments.length > 0" class="sub-comments">
    <Comment v-for="(subComment, index) in visibleSubComments" :key="subComment.comment_id" :comment="subComment"
      :article_id="article_id" :grandparent_id="comment.comment_id" v-bind="$attrs" />
    <button v-if="showMoreButtonText" class="show-more" @click="showMoreReplies">{{ showMoreButtonText }}</button>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { userInfoStore } from '../../store/user';
import { commentInfoStore } from '../../store/comment';
import { useLikeStore } from '../../store/likeStar';
import axios from 'axios';
import { editInfoStore } from '../../store/isEdit';

const editStore = editInfoStore();
const { isEditing } = storeToRefs(editStore);
const userStore = userInfoStore();
const commentStore = commentInfoStore();
const likeStore = useLikeStore();

const user_id = ref(userStore.userThing.id);
const likedCommentIds = storeToRefs(likeStore).likedCommentIds;
const { fetchLikedCommentIds } = likeStore;

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

// 获取用户信息
const searchUserById = async (userId) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/SearchUserById/${userId}`);
    Object.assign(userInfo, res.data.data);
    userName.value = userInfo[0].username;
    avatar.value = userInfo[0].avatar_base64;
  } catch (error) {
    console.error('搜索用户失败：', error);
  }
};

// 获取用户评论的用户信息
const getuserbyCommentid = async (c_id) => {
  if (grandparent_id) {
    try {
      const res = await axios.get(`http://localhost:8080/api/getUserByCommentId/${c_id}`);
      subCommentUserName.value = res.data.data[0].username;
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  }
};

// 加载子评论
const loadSubComments = async () => {
  if (!grandparent_id) {
    await commentStore.getSubComments(comment.comment_id);
    updateVisibleSubComments();
  }
};

// 点赞切换
const toggleLike = async () => {
  isLiked.value = !isLiked.value;
  localLikeCount.value += isLiked.value ? 1 : -1;

  if (isLiked.value) {
    await likeStore.addCommentLike(user_id.value, comment.comment_id);
    if (!likedCommentIds.value.includes(comment.comment_id)) {
      likedCommentIds.value.push(comment.comment_id);
    }
  } else {
    await likeStore.removeCommentLike(user_id.value, comment.comment_id);
    likedCommentIds.value = likedCommentIds.value.filter(id => id !== comment.comment_id);
  }
};

// 展开更多回复
const showMoreReplies = () => {
  visibleSubComments.value = subComments.value;
  showMoreButtonText.value = '';
};

// 处理回复点击事件
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

// 更新可见的子评论
const updateVisibleSubComments = () => {
  if (subCommentCount.value > 1) {
    visibleSubComments.value = subComments.value.slice(0, 1);
    showMoreButtonText.value = `展开${subCommentCount.value - 1}条回复`;
  } else {
    visibleSubComments.value = subComments.value;
    showMoreButtonText.value = '';
  }
};

// 监听 likedCommentIds 的变化
watch(() => likedCommentIds.value, (newVal) => {
  isLiked.value = newVal.includes(comment.comment_id);
});

// 组件挂载时获取用户信息和子评论
onMounted(async () => {
  await fetchLikedCommentIds(user_id.value);
  isLiked.value = likedCommentIds.value.includes(comment.comment_id);
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
  margin-bottom: 20px;
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

button img,
button .heart {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.like {
  color: #333333cc;
  font-weight: 500;
  font-size: 12px;
}

.heart {
  margin-top: 1px;
  font-size: 15px;
  color: red;
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
  max-width: 90%;
}

.sub-comments {
  margin-left: 40px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.sub-comment-item {
  margin-top: 10px;
}

.subCommentUserName {
  color: #33333399;
}

.like_count {
  margin-left: 5px;
}

.show-more {
  font-size: 14px;
  color: #13386c;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  display: block;
  margin-top: 10px;
}
</style>
