<template>
  <div class="main-body">
    <div class="left">
      <img class="avatar" :src="avatar" />
      <span class="username">{{ username }}</span>
    </div>
    <div class="right">
      <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'" @click="toggleLike" class="like-icon"></i>
      <span v-show="likeCount > 0" class="like_count">{{ likeCount }}</span>
      <span v-show="likeCount == 0" class="like_count">赞</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useLikeStore } from '../../store/likeStar';
import { userInfoStore } from '../../store/user';
import { storeToRefs } from 'pinia';
import userApi from '../../api/userApi';
import { articleStore } from '../../store/article'; // 引入articleStore

// 获取store实例
const userStore = userInfoStore();
const { userThing } = userStore;

const likeStore = useLikeStore();
const { fetchLikedArticleIds, addLike, removeLike } = likeStore;
const { likedArticleIds } = storeToRefs(likeStore);

// 获取文章store实例
const articleStores = articleStore();
const { getLikeCountByArticleId, likeCountMap } = articleStores;

// props
const props = defineProps(['item']);
const { article_id } = props.item;

// 定义响应式变量
const username = ref('');
const avatar = ref('');

// 计算是否已点赞
const isLiked = computed(() => likedArticleIds.value.includes(article_id));

// 从store中获取当前文章的点赞数
const likeCount = computed(() => getLikeCountByArticleId(article_id));

// 获取作者信息
async function getAuthorThing() {
  const res = await userApi.SearchUserById(props.item.author_id);
  username.value = res.data.data[0].username;
  avatar.value = res.data.data[0].avatar;
}

// 点赞/取消点赞功能
async function toggleLike() {
  if (isLiked.value) {
    // 取消点赞操作
    await removeLike(userThing.id, article_id);
    // 更新store中的like_count
    if (likeCountMap[article_id] > 0) {
      likeCountMap[article_id] -= 1;
    }
  } else {
    // 点赞操作
    await addLike(userThing.id, article_id);
    // 更新store中的like_count
    likeCountMap[article_id] += 1;
  }
}

// 页面挂载时执行
onMounted(async () => {
  await fetchLikedArticleIds(userThing.id); // 加载用户点赞数据
  await getAuthorThing(); // 加载作者信息
});

</script>

<style scoped>
.username {
  color: #333333cc;
  font-size: 12px;
  width: 75px;
  max-width: 80px; /* 设定最大宽度 */
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 使用省略号显示超出部分 */
}

.main-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
}

.left {
  display: flex;
  align-items: center;
  margin-left: -49px;
}

.avatar {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  overflow: hidden;
  margin-right: 8px;
}

.like_count,
.username {
  color: #333333cc;
  font-size: 12px;
}

html .right .like_count {
  margin-top: -2px;
  margin-left: 3px;
}

.right {
  display: flex;
  align-items: center;
  margin-right: -49px;
}

.like-icon {
  font-size: 12px;
  margin-left: 8px;
  cursor: pointer;
  color: red;
}
</style>
