<template>
  <div class="article-inner" v-if="localArticleInner">
    <span class="article_img_inner"><img :src="img_url" alt="" /></span>
    <span>
      <div class="user-inner">
        <img v-if="avatar" :src="avatar" alt="" />
        <span class="username-info" v-if="userName">{{ userName }}</span>
        <span class="subscribe" @click="subscribe()" v-show="!is_subscript">
          关注
        </span>
        <span class="no_subscribe" @click="subscribe()" v-show="is_subscript && isLogin">
          已关注
        </span>
      </div>
      <div class="article-comment">
        <div class="articleContent">
          <div class="inner-title">{{ articleTitle }}</div>
          <div class="inner-content">{{ content }}</div>
          <div class="date">{{ publication_time }} {{ address }}</div>
          <hr class="article-comment-hr" />
          <div class="comment_count">共 <span>{{ commentCount }}</span> 条评论</div>
          <Comment class="subcomment" :comment="comment" v-for="comment in comment_content" :key="comment.id"
            :article_id="article_id"></Comment>
          <div class="end"> -THE END-</div>
        </div>
      </div>
      <ReplyPart :commentCount="commentCount" :like_count="like_count" :star_count="star_count"
        :article_id="article_id" :like="like"></ReplyPart>
    </span>
  </div>
  <div class="mask" v-if="localArticleInner" @click="closeArticleInner"></div>
</template>




  
  <script setup>
  import { ref, computed, watch, onMounted } from "vue";
  import Comment from "../comment/Comment.vue";
  import ReplyPart from "../comment/replyPart.vue";
  import { userInfoStore } from "../../store/user";
  import { storeToRefs } from "pinia";
  import { commentInfoStore } from "../../store/comment";
  import userApi from "../../api/userApi";
  import subscriptApi from "../../api/subscriptApi";
  const props = defineProps(["article", "article_inner", "close"]);
  
  let {
    title: articleTitle,
    img_url,
    like_count,
    star_count,
    author_id,
    content,
    article_id,
    publication_time,
    address,
  } = props.article;
  
  const commentStore = commentInfoStore();
  const { getComments, getCommentCount, commentsByArticleId, commentCountByArticleId,tempSubComment } = commentStore;
  
  const userStore = userInfoStore();
  const { showLogin, isLogin, targetIds, userThing } = storeToRefs(userStore);
  
  const like = ref(false);
  const userInfo = ref({});
  const userName = ref("");
  const avatar = ref("");
  const commentCount = computed(() => commentCountByArticleId[article_id] || 0);
  const comment_content = computed(() => commentsByArticleId[article_id] || []);
  const is_subscript = computed(() => targetIds.value.includes(author_id));
  
  async function loadArticleData() {
    // 隐藏用户名和头像以避免切换不自然
    userName.value = "";
    avatar.value = "";
  
    // 获取用户信息
    const result = await userApi.SearchUserById(author_id);
    userInfo.value = result.data.data[0];
    userName.value = userInfo.value.username;
    avatar.value = userInfo.value.avatar;
  
    // 获取评论和评论数量
    await getComments(article_id);
    await getCommentCount(article_id);
  }
  
  onMounted(()=>{
    tempSubComment.article_id = article_id
    tempSubComment.user_id = userThing.value.id
    loadArticleData()
  });
  
  watch(
    () => props.article,
    async (newValue) => {
      articleTitle = newValue.title;
      img_url = newValue.img_url;
      like_count = newValue.like_count;
      star_count = newValue.star_count;
      author_id = newValue.author_id;
      content = newValue.content;
      article_id = newValue.article_id;
      publication_time = newValue.publication_time;
      address = newValue.address;
  
      await loadArticleData();
    }
  );
  
  let localArticleInner = computed(() => props.article_inner);
  
  function subscribe() {
    if (!isLogin.value) {
      showLogin.value = true;
    } else {
      if (is_subscript.value) {
        subscriptApi.deleteSubscript(userThing.value.id, author_id);
        targetIds.value = targetIds.value.filter((id) => id !== author_id);
      } else {
        subscriptApi.insertSubscript(userThing.value.id, author_id);
        targetIds.value.push(author_id);
      }
    }
  }
  
  function closeArticleInner() {
    props.close();
    
  }
  </script>
  
  <style scoped>
  /* 样式保持不变 */
  .article-inner {
    display: flex;
    position: fixed;
    background-color: white;
    width: 880px;
    height: 600px;
    z-index: 999999;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    overflow: hidden;
  }
  
  .article-inner .article_img_inner {
    width: 53%;
    height: 100%;
    border-right: 1px solid #f1eeee;
  }
  
  .article_img_inner+span {
    width: 47%;
  }
  
  .article-inner img {
    width: 100%;
    height: 100%;
  }
  
  .user-inner {
    border-bottom: 0.1px solid rgb(232, 223, 223);
    box-sizing: border-box;
    height: 88.8px;
    padding: 24px;
    width: 100%;
    display: flex;
    align-items: center;
  }
  
  .user-inner img {
    margin-right: 12px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgb(205, 189, 189);
  }
  
  .username-info {
    color: #666666cc;
    height: 40px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
  
  .subscribe,
  .no_subscribe {
    font-weight: 600;
    margin-left: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 100px;
    width: 96px;
    height: 40px;
  }
  
  .subscribe {
    color: white;
    background-color: #FF2E4D;
  }
  
  .no_subscribe {
    color: #333333;
    border: 1px solid rgb(238, 231, 231);
  }
  
  .article-comment {
    height: 439.2px;
    overflow: auto;
  }
  
  .article-comment::-webkit-scrollbar {
    display: none;
  }
  
  .articleContent {
    padding: 24px;
  }
  
  .articleContent .inner-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .inner-content {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    margin-bottom: 24px;
  }
  
  .article-comment-hr {
    border: 0.0001px solid rgb(236, 233, 233);
  }
  
  .comment_count {
    margin-bottom: 10px;
    font-size: 14px;
    color: #33333399;
  }
  
  .mask {
    height: 706.8px;
    width: 1920px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(31, 29, 29, 0.5);
    z-index: 9999;
  }
  
  .end {
    color: #33333399;
    font-size: 12px;
    margin: 10px 150px;
  }
  .date {
    font-size: 14px;
    color: #33333399;
    font-weight: 520;
  }
  </style>
  