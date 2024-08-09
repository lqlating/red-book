<script setup>
import { ref } from 'vue';
const props = defineProps(['isComment', 'replyComment']);
const isComment = props.isComment;
const isLiked = ref(false);

function toggleLike() {
    isLiked.value = !isLiked.value;
}
</script>

<template>
    <div class="main-body">
        <span class="avatar"><img class="avatar-inner" :src="props.replyComment.avatar" alt=""></span>

        <span class="txt-area">
            <div class="reply_name"><slot name="reply_name"></slot></div>
            <div class="reply_date">
                <span v-if="isComment">回复</span>
                <span v-if="!isComment">赞</span>了你的评论 <span><slot name="date"></slot></span>
            </div>
            <div class="reply_txt"><slot name="reply_txt"></slot></div>
            <div class="bereplyed_txt"><span class="blank"></span><slot name="bereplyed_txt"></slot></div>
            <div class="two_button">
                <div class="reply_button">
                    <i class="fa-regular fa-comment" style="font-size: 20px;"></i> 回复
                </div>
                <div class="like_button" @click="toggleLike">
                    <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
                </div>
            </div>
        </span>

        <span class="article-face"><img class="article-inner" :src="props.replyComment.article_bark" alt=""></span>
    </div>
</template>

<style scoped>
.reply_name, .reply_date, .reply_txt, .bereplyed_txt {
    margin-bottom: 5px;
}
.main-body {
    width: 100%;
    /* background-color: aqua; */
    display: flex;
    align-items: flex-start; /* 顶端对齐 */
}

.avatar {
    overflow: hidden;
    height: 48px;
    width: 48px;
    border-radius: 50%;
    background-color: rgb(136, 120, 120);
}
.avatar-inner {
    width: 100%;
    height: 100%;
}
.reply_date {
    font-size: 14px;
    color: #33333399;
}
.txt-area {
    width: auto;
    height: 148.5px;
    /* background-color: #bfa; */
    flex-grow: 1; /* 占据剩余的空间 */
    margin: 0 23px; /* 设置两侧的留白 */
}
.reply_txt {
    font-size: 14px;
    color: #333333;
}
.article-face {
    height: auto;
    width: 48px;
    border-radius: 5px;
    background-color: bisque;
    overflow: hidden;
}
.article-inner {
    width: 100%;
    height: 100%;
}
.reply_name {
    font-size: 16px;
    color: #333333;
    font-weight: 600;
}
.blank {
    display: inline-block;
    height: 17px;
    width: 4px;
    background-color: #00000014;
    border-radius: 8px;
    margin-right: 4px;
}
.bereplyed_txt {
    font-size: 12px;
    color: #33333399;
    display: flex;
    align-items: center; /* 使内容在垂直方向居中 */
}
.two_button {
    display: flex;
    gap: 10px; /* 控制按钮之间的间距 */
}
.reply_button {
    color: #000000cc;
    font-size: 16px;
    width: 88px;
    height: 40px;
    background-color: white;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #333333;
    border: 0.1px solid rgb(216, 205, 205);
}

.like_button {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 0.1px solid rgb(216, 205, 205);
    
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: red;
    font-size: 16px;
}
.fa-regular{
    margin-right: 5px;
}
</style>
