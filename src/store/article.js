import { defineStore } from 'pinia';
import { reactive } from 'vue';
import articleApi from '../api/articleApi';

export const articleStore = defineStore('article', () => {
  // Reactive state to hold article lists, like_count map, and star_count map
  const articleLists = reactive([]);
  const likeCountMap = reactive({}); // Dictionary to store like_count by article_id
  const starCountMap = reactive({}); // Dictionary to store star_count by article_id

  // Fetch articles by category
  async function filterContent(value) {
    try {
      const res = await articleApi.Filtercontent(value);
      Object.assign(articleLists, res.data.data);

      // Populate likeCountMap and starCountMap with article_id
      articleLists.forEach((article) => {
        likeCountMap[article.article_id] = article.like_count;
        starCountMap[article.article_id] = article.star_count; // Store star_count
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Function to get like_count by article_id
  function getLikeCountByArticleId(article_id) {
    return likeCountMap[article_id] || 0; // Return 0 if not found
  }

  // Function to get star_count by article_id
  function getStarCountByArticleId(article_id) {
    return starCountMap[article_id] || 0; // Return 0 if not found
  }

  // Function to increment or decrement star_count
  function updateStarCount(article_id, increment = true) {
    if (starCountMap[article_id] !== undefined) {
      if (increment) {
        starCountMap[article_id] += 1;
      } else {
        starCountMap[article_id] -= 1;
      }
    } else {
      starCountMap[article_id] = increment ? 1 : 0;
    }
  }

  return {
    articleLists,
    filterContent,
    getLikeCountByArticleId,
    getStarCountByArticleId,
    updateStarCount,
    likeCountMap,
    starCountMap,
  };
});
