// stores/searchStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import searchApi from '../api/searchApi'; // 假设 api 路径为 ../api/searchApi
import { articleStore } from './article'; // 导入 articleStore

export const searchStore = defineStore('search', () => {
  // 获取 articleStore 实例
  const articles = articleStore();
  let searchArticle = ref(true);
  let isSearch = ref(false);
  // 使用 articleStore 中的 articleLists
  let articleLists = articles.articleLists;

  // 用于存储搜索的用户列表
  const userList = ref([]);

  // 根据标题或内容搜索文章
  async function searchArticleByTitleOrContent(keyword) {
    try {
      // 在搜索前清空 articleLists
      articleLists.splice(0, articleLists.length); // 清空 articleLists

      const res = await searchApi.searchArticle(keyword);
      // 如果搜索结果不为空，更新 articleLists
      if (res.data.data && res.data.data.length > 0) {
        Object.assign(articleLists, res.data.data);
      }
      if (isSearch) {
        isSearch = false;
      }
    } catch (error) {
      console.error('Error searching articles:', error);
      // 如果发生错误，仍然确保清空 articleLists
      articleLists.splice(0, articleLists.length);
    }
  }

  // 根据用户名搜索用户
  async function searchUserByUsername(username) {
    try {
      // 在搜索前清空 userList
      userList.value.splice(0, userList.value.length); // 清空 userList

      const res = await searchApi.searchUserByUsername(username);
      // 如果搜索结果不为空，更新 userList
      if (res.data.data && res.data.data.length > 0) {
        Object.assign(userList.value, res.data.data);
      }
      if (isSearch) {
        isSearch = false;
      }
    } catch (error) {
      console.error('Error searching users:', error);
      // 如果发生错误，仍然确保清空 userList
      userList.value.splice(0, userList.value.length);
    }
  }

  // 获取指定标题或内容的文章
  function getArticleByTitleOrContent(keyword) {
    return articleLists.find(article => article.title.includes(keyword) || article.content.includes(keyword)) || null;
  }

  // 获取指定用户名的用户
  function getUserByUsername(username) {
    return userList.value.find(user => user.username === username) || null;
  }

  return {
    isSearch,
    articleLists, // 共享的 articleLists
    userList,
    searchArticle,
    searchArticleByTitleOrContent,
    searchUserByUsername,
    getArticleByTitleOrContent,
    getUserByUsername,
  };
});
