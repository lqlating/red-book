<template>
    <div class="main-body">
        <div class="left">
            <img class="avatar" :src="avatar">
            <span class="username">{{ username }}</span>
        </div>
        <div class="right">
            <span class="like_count">{{ props.item.like_count }}</span>
            <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'" @click="toggleLike" class="like-icon"></i>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import userApi from '../../api/userApi';

let username = ref('');
let avatar = ref('');
const props = defineProps(['item']);
const isLiked = ref(false);

async function getAuhtorThing() {
    const res = await userApi.SearchUserById(props.item.author_id);
    username.value = res.data.data[0].username;
    avatar.value = res.data.data[0].avatar;

}

function toggleLike() {
    isLiked.value = !isLiked.value;
}

onMounted(() => {
    getAuhtorThing();
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

.right {
    display: flex;
    align-items: center;
    margin-right: -49px;
}

.like-icon {
    font-size: 15px;
    margin-left: 8px;
    cursor: pointer;
    color: red;
}
</style>
