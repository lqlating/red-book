import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { cacheStore } from '../../store/cache';

describe('Cache Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('应该能够设置和获取分类缓存', () => {
        const cache = cacheStore();
        const testData = [
            { id: 1, title: '测试书籍1' },
            { id: 2, title: '测试书籍2' },
            { id: 3, title: '测试书籍3' }
        ];

        // 设置缓存
        cache.setCategoryCache('小说', testData, true, 1);

        // 检查是否有缓存
        expect(cache.hasCategoryCache('小说')).toBe(true);
        expect(cache.hasCategoryCache('科技')).toBe(false);

        // 获取缓存数据
        const cachedBooks = cache.getCachedBooks('小说');
        expect(cachedBooks).toEqual(testData);

        // 检查缓存统计
        const stats = cache.getCacheStats();
        expect(stats.totalCategories).toBe(1);
        expect(stats.categories[0].categoryType).toBe('小说');
        expect(stats.categories[0].dataCount).toBe(3);
    });

    it('应该只缓存前40条数据', () => {
        const cache = cacheStore();
        const largeData = Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            title: `测试书籍${i + 1}`
        }));

        // 设置缓存
        cache.setCategoryCache('小说', largeData, true, 1);

        // 检查缓存的数据量
        const cachedBooks = cache.getCachedBooks('小说');
        expect(cachedBooks.length).toBe(40);
        expect(cachedBooks[0].title).toBe('测试书籍1');
        expect(cachedBooks[39].title).toBe('测试书籍40');
    });

    it('应该能够更新缓存的hasMore状态', () => {
        const cache = cacheStore();
        const testData = [{ id: 1, title: '测试书籍1' }];

        cache.setCategoryCache('小说', testData, true, 1);
        expect(cache.getCategoryCache('小说').hasMore).toBe(true);

        cache.updateCacheHasMore('小说', false);
        expect(cache.getCategoryCache('小说').hasMore).toBe(false);
    });

    it('应该能够更新缓存的当前页码', () => {
        const cache = cacheStore();
        const testData = [{ id: 1, title: '测试书籍1' }];

        cache.setCategoryCache('小说', testData, true, 1);
        expect(cache.getCategoryCache('小说').currentPage).toBe(1);

        cache.updateCacheCurrentPage('小说', 3);
        expect(cache.getCategoryCache('小说').currentPage).toBe(3);
    });

    it('应该能够清除特定分类的缓存', () => {
        const cache = cacheStore();
        const testData = [{ id: 1, title: '测试书籍1' }];

        cache.setCategoryCache('小说', testData, true, 1);
        cache.setCategoryCache('科技', testData, true, 1);

        expect(cache.hasCategoryCache('小说')).toBe(true);
        expect(cache.hasCategoryCache('科技')).toBe(true);

        cache.clearCategoryCache('小说');
        expect(cache.hasCategoryCache('小说')).toBe(false);
        expect(cache.hasCategoryCache('科技')).toBe(true);
    });

    it('应该能够清除所有缓存', () => {
        const cache = cacheStore();
        const testData = [{ id: 1, title: '测试书籍1' }];

        cache.setCategoryCache('小说', testData, true, 1);
        cache.setCategoryCache('科技', testData, true, 1);

        expect(cache.getCacheStats().totalCategories).toBe(2);

        cache.clearAllCache();
        expect(cache.getCacheStats().totalCategories).toBe(0);
    });
});
