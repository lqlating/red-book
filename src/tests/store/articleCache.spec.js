import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { articleCacheStore } from '../../store/articleCache';

describe('Article Cache Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('应该能够设置和获取分类缓存', () => {
    const cache = articleCacheStore();
    const testArticles = [
      { article_id: 1, title: '测试文章1', img_url: 'test1.jpg' },
      { article_id: 2, title: '测试文章2', img_url: 'test2.jpg' },
      { article_id: 3, title: '测试文章3', img_url: 'test3.jpg' }
    ];

    // 设置缓存
    cache.setCategoryCache('Romance', testArticles, true, 1);

    // 检查是否有缓存
    expect(cache.hasCategoryCache('Romance')).toBe(true);
    expect(cache.hasCategoryCache('Tech')).toBe(false);

    // 获取缓存数据
    const cachedArticles = cache.getCachedArticles('Romance');
    expect(cachedArticles).toEqual(testArticles);

    // 检查缓存统计
    const stats = cache.getCacheStats();
    expect(stats.totalCategories).toBe(1);
    expect(stats.categories[0].categoryType).toBe('Romance');
    expect(stats.categories[0].dataCount).toBe(3);
  });

  it('应该只缓存前40条数据', () => {
    const cache = articleCacheStore();
    const largeData = Array.from({ length: 50 }, (_, i) => ({
      article_id: i + 1,
      title: `测试文章${i + 1}`,
      img_url: `test${i + 1}.jpg`
    }));

    // 设置缓存
    cache.setCategoryCache('Romance', largeData, true, 1);

    // 检查缓存的数据量
    const cachedArticles = cache.getCachedArticles('Romance');
    expect(cachedArticles.length).toBe(40);
    expect(cachedArticles[0].title).toBe('测试文章1');
    expect(cachedArticles[39].title).toBe('测试文章40');
  });

  it('应该能够设置和获取搜索缓存', () => {
    const cache = articleCacheStore();
    const testArticles = [
      { article_id: 1, title: '搜索文章1', img_url: 'search1.jpg' },
      { article_id: 2, title: '搜索文章2', img_url: 'search2.jpg' }
    ];

    // 设置搜索缓存
    cache.setSearchCache('测试关键词', testArticles, true, 1);

    // 检查是否有搜索缓存
    expect(cache.hasSearchCache('测试关键词')).toBe(true);
    expect(cache.hasSearchCache('其他关键词')).toBe(false);

    // 获取搜索缓存数据
    const cachedArticles = cache.getSearchCache('测试关键词');
    expect(cachedArticles).toEqual(testArticles);
  });

  it('应该能够更新缓存的hasMore状态', () => {
    const cache = articleCacheStore();
    const testArticles = [{ article_id: 1, title: '测试文章1' }];

    cache.setCategoryCache('Romance', testArticles, true, 1);
    expect(cache.getCategoryCache('Romance').hasMore).toBe(true);

    cache.updateCacheHasMore('Romance', false);
    expect(cache.getCategoryCache('Romance').hasMore).toBe(false);
  });

  it('应该能够更新缓存的当前页码', () => {
    const cache = articleCacheStore();
    const testArticles = [{ article_id: 1, title: '测试文章1' }];

    cache.setCategoryCache('Romance', testArticles, true, 1);
    expect(cache.getCategoryCache('Romance').currentPage).toBe(1);

    cache.updateCacheCurrentPage('Romance', 3);
    expect(cache.getCategoryCache('Romance').currentPage).toBe(3);
  });

  it('应该能够清除特定分类的缓存', () => {
    const cache = articleCacheStore();
    const testArticles = [{ article_id: 1, title: '测试文章1' }];

    cache.setCategoryCache('Romance', testArticles, true, 1);
    cache.setCategoryCache('Tech', testArticles, true, 1);

    expect(cache.hasCategoryCache('Romance')).toBe(true);
    expect(cache.hasCategoryCache('Tech')).toBe(true);

    cache.clearCategoryCache('Romance');
    expect(cache.hasCategoryCache('Romance')).toBe(false);
    expect(cache.hasCategoryCache('Tech')).toBe(true);
  });

  it('应该能够清除所有缓存', () => {
    const cache = articleCacheStore();
    const testArticles = [{ article_id: 1, title: '测试文章1' }];

    cache.setCategoryCache('Romance', testArticles, true, 1);
    cache.setSearchCache('关键词', testArticles, true, 1);

    expect(cache.getCacheStats().totalCategories).toBe(1);

    cache.clearAllCache();
    cache.clearAllSearchCache();
    expect(cache.getCacheStats().totalCategories).toBe(0);
  });

  it('应该能够检查缓存是否过期', () => {
    const cache = articleCacheStore();
    const testArticles = [{ article_id: 1, title: '测试文章1' }];

    cache.setCategoryCache('Romance', testArticles, true, 1);
    
    // 新创建的缓存不应该过期
    expect(cache.isCacheExpired('Romance', 1000)).toBe(false);
    
    // 不存在的缓存应该过期
    expect(cache.isCacheExpired('NonExistent')).toBe(true);
  });
});
