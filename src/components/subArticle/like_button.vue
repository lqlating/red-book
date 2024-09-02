<template>
    <div class="main-body">
        <div class="left">
            <img class="avatar" :src="avatar">
            <span class="username">{{ username }}</span>
        </div>
        <div class="right">
            <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'" @click="toggleLike" class="like-icon"></i>
            <span v-show="props.item.like_count > 0" class="like_count">{{ props.item.like_count }}</span>
            <span v-show="props.item.like_count == 0" class="like_count">赞</span>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import userApi from '../../api/userApi';
import { userInfoStore } from '../../store/user';
import likeStarApi from '../../api/likeStarApi';

const userStore = userInfoStore();
const { userThing } = userStore;

let username = ref('');
let avatar = ref('');
const props = defineProps(['item', 'likedTargetIds']);
const { article_id } = props.item;

const operation_type = 'like';
const content_type = 'article';
const isLiked = ref(false);

async function getAuthorThing() {
    const res = await userApi.SearchUserById(props.item.author_id);
    username.value = res.data.data[0].username;
    avatar.value = res.data.data[0].avatar;
}

async function toggleLike() {
    if (isLiked.value) {
        // 已经点赞，执行取消点赞操作
        await likeStarApi.deleteOperation(userThing.id, null, article_id, operation_type);
        props.item.like_count = props.item.like_count - 1;
    } else {
        // 还未点赞，执行点赞操作
        await likeStarApi.addOperation(userThing.id, null, article_id, operation_type);
        props.item.like_count = props.item.like_count + 1;
    }
    // 切换点赞状态
    isLiked.value = !isLiked.value;
}

onMounted(() => {
    getAuthorThing();
    // 判断 article_id 是否在 likedTargetIds 中
    isLiked.value = props.likedTargetIds.includes(article_id);
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
html .right .like_count{
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
