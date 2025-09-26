import { defineStore } from 'pinia';
import { ref } from 'vue';
import articleApi from '../api/articleApi';
export const articleStore = defineStore('article', () => {
  // 使用ref替代reactive来保持响应性
  const articleLists = ref([]);
  const likeCountMap = ref({}); // Dictionary to store like_count by article_id
  const starCountMap = ref({}); // Dictionary to store star_count by article_id
  const filteredArticles = ref([]); // 用于存储搜索或过滤后的文章

  // Fetch articles by category
  async function filterContent(value, page = 1, size = 20) {
    try {
      const res = await articleApi.Filtercontent(value, page, size);

      // 判断返回的数据格式，API返回的数据结构为 {code, msg, data}
      let newArticles = [];
      if (res.data && res.data.code === 1 && Array.isArray(res.data.data)) {
        newArticles = res.data.data;
      } else if (res.data && Array.isArray(res.data)) {
        newArticles = res.data;
      }

      // 如果是第一页，清空列表
      if (page === 1) {
        articleLists.value.length = 0;
      }

      // 添加新文章
      articleLists.value.push(...newArticles);

      // Populate likeCountMap and starCountMap with article_id
      newArticles.forEach((article) => {
        likeCountMap.value[article.article_id] = article.like_count;
        starCountMap.value[article.article_id] = article.star_count;
      });

      return newArticles;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  // 根据类型过滤文章并排除特定作者
  async function filterContentExcludeAuthor(type, authorId, page = 1, size = 20) {
    try {
      const res = await articleApi.FiltercontentExcludeAuthor(type, authorId, page, size);

      // 判断返回的数据格式，API返回的数据结构为 {code, msg, data}
      let newArticles = [];
      if (res.data && res.data.code === 1 && Array.isArray(res.data.data)) {
        newArticles = res.data.data;
      } else if (res.data && Array.isArray(res.data)) {
        newArticles = res.data;
      }

      // 如果是第一页，清空列表
      if (page === 1) {
        filteredArticles.value.length = 0;
      }

      // 添加新文章
      filteredArticles.value.push(...newArticles);

      // 更新点赞和收藏计数
      newArticles.forEach((article) => {
        likeCountMap.value[article.article_id] = article.like_count;
        starCountMap.value[article.article_id] = article.star_count;
      });

      return newArticles;
    } catch (error) {
      console.error("Error filtering articles:", error);
      return [];
    }
  }

  // 根据关键词搜索文章
  async function searchArticle(keyword, page = 1, size = 20) {
    try {
      const res = await articleApi.searchArticle(keyword, page, size);

      // 判断返回的数据格式，API返回的数据结构为 {code, msg, data}
      let newArticles = [];
      if (res.data && res.data.code === 1 && Array.isArray(res.data.data)) {
        newArticles = res.data.data;
      } else if (res.data && Array.isArray(res.data)) {
        newArticles = res.data;
      }

      // 如果是第一页，清空列表
      if (page === 1) {
        filteredArticles.value.length = 0;
      }

      // 添加新文章
      filteredArticles.value.push(...newArticles);

      // 更新点赞和收藏计数
      newArticles.forEach((article) => {
        likeCountMap.value[article.article_id] = article.like_count;
        starCountMap.value[article.article_id] = article.star_count;
      });

      return newArticles;
    } catch (error) {
      console.error("Error searching articles:", error);
      return [];
    }
  }

  // 根据关键词搜索文章并排除特定作者
  async function searchArticleExcludeAuthor(keyword, authorId, page = 1, size = 20) {
    try {
      const res = await articleApi.searchArticleExcludeAuthor(keyword, authorId, page, size);

      // 判断返回的数据格式，API返回的数据结构为 {code, msg, data}
      let newArticles = [];
      if (res.data && res.data.code === 1 && Array.isArray(res.data.data)) {
        newArticles = res.data.data;
      } else if (res.data && Array.isArray(res.data)) {
        newArticles = res.data;
      }

      // 如果是第一页，清空列表
      if (page === 1) {
        filteredArticles.value.length = 0;
      }

      // 添加新文章
      filteredArticles.value.push(...newArticles);

      // 更新点赞和收藏计数
      newArticles.forEach((article) => {
        likeCountMap.value[article.article_id] = article.like_count;
        starCountMap.value[article.article_id] = article.star_count;
      });

      return newArticles;
    } catch (error) {
      console.error("Error searching articles:", error);
      return [];
    }
  }

  // Function to get like_count by article_id
  function getLikeCountByArticleId(article_id) {
    return likeCountMap.value[article_id] || 0; // Return 0 if not found
  }

  // Function to get star_count by article_id
  function getStarCountByArticleId(article_id) {
    return starCountMap.value[article_id] || 0; // Return 0 if not found
  }

  // Function to increment or decrement star_count
  function updateStarCount(article_id, increment = true) {
    if (starCountMap.value[article_id] !== undefined) {
      if (increment) {
        starCountMap.value[article_id] += 1;
      } else {
        starCountMap.value[article_id] -= 1;
      }
    } else {
      starCountMap.value[article_id] = increment ? 1 : 0;
    }
  }

  // Function to delete an article
  async function deleteArticle(articleId) {
    try {
      const response = await articleApi.deleteArticle(articleId);

      if (response.data && response.data.code === 1) {
        // Remove the article from articleLists
        const index = articleLists.value.findIndex(article => article.article_id === articleId);
        if (index !== -1) {
          articleLists.value.splice(index, 1);
        }

        // Remove from like and star count maps
        delete likeCountMap.value[articleId];
        delete starCountMap.value[articleId];

        return { success: true, message: response.data.data || '文章删除成功' };
      } else {
        return { success: false, message: response.data?.data || '删除文章失败' };
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      return { success: false, message: '删除文章时发生错误' };
    }
  }

  return {
    articleLists,
    filteredArticles,
    filterContent,
    filterContentExcludeAuthor,
    searchArticle,
    searchArticleExcludeAuthor,
    getLikeCountByArticleId,
    getStarCountByArticleId,
    updateStarCount,
    deleteArticle,
    likeCountMap,
    starCountMap,
  };
});
