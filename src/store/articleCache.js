import { defineStore } from 'pinia';
import { ref } from 'vue';

export const articleCacheStore = defineStore('articleCache', () => {
  // 缓存各分类的前40条文章数据
  const categoryCache = ref(new Map());
  
  // 缓存配置
  const CACHE_SIZE = 40; // 每个分类缓存前40条数据
  
  // 获取分类缓存
  function getCategoryCache(categoryType) {
    return categoryCache.value.get(categoryType) || {
      data: [],
      timestamp: 0,
      hasMore: true,
      currentPage: 1
    };
  }
  
  // 设置分类缓存
  function setCategoryCache(categoryType, data, hasMore = true, currentPage = 1) {
    const cacheData = {
      data: data.slice(0, CACHE_SIZE), // 只缓存前40条
      timestamp: Date.now(),
      hasMore,
      currentPage
    };
    categoryCache.value.set(categoryType, cacheData);
  }
  
  // 检查分类是否有缓存
  function hasCategoryCache(categoryType) {
    const cache = categoryCache.value.get(categoryType);
    return !!(cache && cache.data.length > 0);
  }
  
  // 获取缓存的文章数据
  function getCachedArticles(categoryType) {
    const cache = getCategoryCache(categoryType);
    return cache.data;
  }
  
  // 更新缓存的hasMore状态
  function updateCacheHasMore(categoryType, hasMore) {
    const cache = categoryCache.value.get(categoryType);
    if (cache) {
      cache.hasMore = hasMore;
    }
  }
  
  // 更新缓存的当前页码
  function updateCacheCurrentPage(categoryType, currentPage) {
    const cache = categoryCache.value.get(categoryType);
    if (cache) {
      cache.currentPage = currentPage;
    }
  }
  
  // 清除特定分类的缓存
  function clearCategoryCache(categoryType) {
    categoryCache.value.delete(categoryType);
  }
  
  // 清除所有缓存
  function clearAllCache() {
    categoryCache.value.clear();
  }
  
  // 获取缓存统计信息
  function getCacheStats() {
    const stats = {
      totalCategories: categoryCache.value.size,
      categories: []
    };
    
    for (const [categoryType, cache] of categoryCache.value.entries()) {
      stats.categories.push({
        categoryType,
        dataCount: cache.data.length,
        hasMore: cache.hasMore,
        currentPage: cache.currentPage,
        timestamp: cache.timestamp
      });
    }
    
    return stats;
  }
  
  // 检查缓存是否过期（可选功能，这里设置为不过期）
  function isCacheExpired(categoryType, maxAge = 30 * 60 * 1000) { // 30分钟过期
    const cache = categoryCache.value.get(categoryType);
    if (!cache) return true;
    
    return Date.now() - cache.timestamp > maxAge;
  }
  
  // 为搜索模式添加缓存支持
  const searchCache = ref(new Map());
  
  // 设置搜索缓存
  function setSearchCache(keyword, data, hasMore = true, currentPage = 1) {
    const cacheData = {
      data: data.slice(0, CACHE_SIZE),
      timestamp: Date.now(),
      hasMore,
      currentPage
    };
    searchCache.value.set(keyword, cacheData);
  }
  
  // 检查搜索是否有缓存
  function hasSearchCache(keyword) {
    const cache = searchCache.value.get(keyword);
    return !!(cache && cache.data.length > 0);
  }
  
  // 获取搜索缓存数据
  function getSearchCache(keyword) {
    const cache = searchCache.value.get(keyword);
    return cache ? cache.data : [];
  }
  
  // 更新搜索缓存的hasMore状态
  function updateSearchCacheHasMore(keyword, hasMore) {
    const cache = searchCache.value.get(keyword);
    if (cache) {
      cache.hasMore = hasMore;
    }
  }
  
  // 更新搜索缓存的当前页码
  function updateSearchCacheCurrentPage(keyword, currentPage) {
    const cache = searchCache.value.get(keyword);
    if (cache) {
      cache.currentPage = currentPage;
    }
  }
  
  // 清除搜索缓存
  function clearSearchCache(keyword) {
    searchCache.value.delete(keyword);
  }
  
  // 清除所有搜索缓存
  function clearAllSearchCache() {
    searchCache.value.clear();
  }
  
  return {
    categoryCache,
    searchCache,
    getCategoryCache,
    setCategoryCache,
    hasCategoryCache,
    getCachedArticles,
    updateCacheHasMore,
    updateCacheCurrentPage,
    clearCategoryCache,
    clearAllCache,
    getCacheStats,
    isCacheExpired,
    // 搜索缓存相关方法
    setSearchCache,
    hasSearchCache,
    getSearchCache,
    updateSearchCacheHasMore,
    updateSearchCacheCurrentPage,
    clearSearchCache,
    clearAllSearchCache
  };
});
