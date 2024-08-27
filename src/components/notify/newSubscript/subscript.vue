<template>
    <div class="main-area">
        <span class="avatar-area">
            <img class="avatar-inner" :src="subscriptList.avatar" alt="">
        </span>
        <span class="use-area"> 
            <div class="username-inner">{{ subscriptList.username }}</div>
            <div class="less-area">Ta关注了你，期待你的回关</div>
        </span>
        <div v-show="!subscriptList.interaction" class="subscript-area" @click="newSubscript">
            回关
        </div>
        <div v-show="subscriptList.interaction" class="inter-subscript" @click="deleteSubscript">
            互相关注
        </div>
    </div>
</template>

<script setup>
import { userInfoStore } from '../../../store/user';
import subscriptApi from '../../../api/subscriptApi';
const userStore = userInfoStore()
const { userThing } = userStore
const props = defineProps(['subscriptList'])

async function newSubscript() {
    await subscriptApi.insertSubscript(userThing.id, props.subscriptList.id)
    console.log("subscript successful")
    // 创建一个局部副本来处理 UI 状态更新
    props.subscriptList = { ...props.subscriptList, interaction: !props.subscriptList.interaction }
}

async function deleteSubscript() {
    await subscriptApi.deleteSubscript(userThing.id, props.subscriptList.id)
    console.log("delete subscript successful")
    // 创建一个局部副本来处理 UI 状态更新
    props.subscriptList = { ...props.subscriptList, interaction: !props.subscriptList.interaction }
}
</script>

<style scoped>
.main-area {
    height: 88.8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
}

.avatar-area {
    height: 48px;
    width: 48px;
    border-radius: 50%;
    overflow: hidden;
    display: inline-block;
    margin-right: 10px;
}

.avatar-inner {
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.use-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.username-inner {
    font-size: 16px;
    color: #333333;
    font-weight: 600;
}

.less-area {
    font-size: 14px;
    color: #33333399;
}

.inter-subscript,
.subscript-area {
    cursor: pointer;
    width: 96px;
    height: 40px;
    border-radius: 100px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
}

.subscript-area {
    background-color: #ff2e4d;
    color: white;
}

.inter-subscript {
    border: 0.1px solid rgb(219, 211, 211);
}
</style>
