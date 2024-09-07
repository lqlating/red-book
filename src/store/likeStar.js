// src/stores/likeStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import likeStarApi from '../api/likeStarApi';

export const useLikeStore = defineStore('like', () => {
  let likedArticleIds = ref([]);  // 用户点赞的文章ID列表
  let starredArticleIds = ref([]); // 用户收藏的文章ID列表

  // 获取用户点赞的文章ID列表
  const fetchLikedArticleIds = async (userId) => {
    try {
      const response = await likeStarApi.searchOperation(userId, 'article', 'like');
      if (response.data.code === 1) {
        likedArticleIds.value = response.data.data.map(item => item.target_id);
      }
    } catch (error) {
      console.error('获取点赞数据失败:', error);
    }
  };

  // 获取用户收藏的文章ID列表
  const fetchStarredArticleIds = async (userId) => {
    try {
      const response = await likeStarApi.searchOperation(userId, 'article', 'star');
      if (response.data.code === 1) {
        starredArticleIds.value = response.data.data.map(item => item.target_id);
        console.log(starredArticleIds.value)
      }
    } catch (error) {
      console.error('获取收藏数据失败:', error);
    }
  };

  // 添加点赞
  const addLike = async (userId, articleId) => {
    try {
      const response = await likeStarApi.addOperation(userId, null, articleId, 'like');
      if (response.data.code === 1) {
        likedArticleIds.value.push(articleId);
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  // 删除点赞
  const removeLike = async (userId, articleId) => {
    try {
      const response = await likeStarApi.deleteOperation(userId, null, articleId, 'like');
      if (response.data.code === 1) {
        likedArticleIds.value = likedArticleIds.value.filter(id => id !== articleId);
      }
    } catch (error) {
      console.error('取消点赞失败:', error);
    }
  };

  // 添加收藏
  const addStar = async (userId, articleId) => {
    try {
      const response = await likeStarApi.addOperation(userId, null, articleId, 'star');
      if (response.data.code === 1) {
        starredArticleIds.value.push(articleId);
      }
    } catch (error) {
      console.error('收藏失败:', error);
    }
  };

  // 删除收藏
  const removeStar = async (userId, articleId) => {
    try {
      const response = await likeStarApi.deleteOperation(userId, null, articleId, 'star');
      if (response.data.code === 1) {
        starredArticleIds.value = starredArticleIds.value.filter(id => id !== articleId);
      }
    } catch (error) {
      console.error('取消收藏失败:', error);
    }
  };

  return {
    likedArticleIds,
    starredArticleIds,
    fetchLikedArticleIds,
    fetchStarredArticleIds,  // 获取用户收藏文章ID列表的方法
    addLike,
    removeLike,
    addStar,
    removeStar,
  };
});
