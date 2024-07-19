<template>
    <div class="publish_thing">
        <div><img class="no_publish" src="../../../assets/img/head.png" alt=""></div>
        <div class="no_publish_txt">你暂未发布任何笔记</div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.publish_thing {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%; /* 保持内容在容器内部 */
    width: 100%; /* 保持内容在容器内部 */
}

.no_publish {
    height: 90px;
    width: 90px;
    border-radius: 50%;
    border: 1px solid #f0f0f0;
    margin-bottom: 16px; /* 在图片和文字之间添加间距 */
}

.no_publish_txt {
    font-size: 16px;
    color: #33333399;
}
</style>
