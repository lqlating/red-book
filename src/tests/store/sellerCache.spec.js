import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { sellerCacheStore } from '../../store/sellerCache';

describe('Seller Cache Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('应该能够设置和获取卖家缓存', () => {
        const cache = sellerCacheStore();
        const testSeller = {
            id: 1,
            username: '测试卖家',
            avatar_base64: 'test_avatar_data',
            email: 'test@example.com'
        };

        // 设置缓存
        cache.setSellerCache(1, testSeller);

        // 检查是否有缓存
        expect(cache.hasSellerCache(1)).toBe(true);
        expect(cache.hasSellerCache(2)).toBe(false);

        // 获取缓存数据
        const cachedSeller = cache.getCachedSeller(1);
        expect(cachedSeller).toEqual(testSeller);
    });

    it('应该能够检查缓存是否过期', () => {
        const cache = sellerCacheStore();
        const testSeller = {
            id: 1,
            username: '测试卖家'
        };

        // 设置缓存
        cache.setSellerCache(1, testSeller);

        // 新创建的缓存不应该过期
        expect(cache.isCacheExpired(1)).toBe(false);

        // 不存在的缓存应该过期
        expect(cache.isCacheExpired(999)).toBe(true);
    });

    it('应该能够更新卖家缓存', () => {
        const cache = sellerCacheStore();
        const originalSeller = {
            id: 1,
            username: '原始卖家',
            email: 'original@example.com'
        };

        const updatedSeller = {
            id: 1,
            username: '更新后的卖家',
            email: 'updated@example.com'
        };

        // 设置原始缓存
        cache.setSellerCache(1, originalSeller);

        // 更新缓存
        cache.updateSellerCache(1, updatedSeller);

        // 检查更新后的数据
        const cachedSeller = cache.getCachedSeller(1);
        expect(cachedSeller.username).toBe('更新后的卖家');
        expect(cachedSeller.email).toBe('updated@example.com');
    });

    it('应该能够清除特定卖家的缓存', () => {
        const cache = sellerCacheStore();
        const testSeller1 = { id: 1, username: '卖家1' };
        const testSeller2 = { id: 2, username: '卖家2' };

        cache.setSellerCache(1, testSeller1);
        cache.setSellerCache(2, testSeller2);

        expect(cache.hasSellerCache(1)).toBe(true);
        expect(cache.hasSellerCache(2)).toBe(true);

        cache.clearSellerCache(1);
        expect(cache.hasSellerCache(1)).toBe(false);
        expect(cache.hasSellerCache(2)).toBe(true);
    });

    it('应该能够清除所有卖家缓存', () => {
        const cache = sellerCacheStore();
        const testSeller1 = { id: 1, username: '卖家1' };
        const testSeller2 = { id: 2, username: '卖家2' };

        cache.setSellerCache(1, testSeller1);
        cache.setSellerCache(2, testSeller2);

        expect(cache.getCacheStats().totalSellers).toBe(2);

        cache.clearAllSellerCache();
        expect(cache.getCacheStats().totalSellers).toBe(0);
    });

    it('应该能够获取缓存统计信息', () => {
        const cache = sellerCacheStore();
        const testSeller1 = { id: 1, username: '卖家1' };
        const testSeller2 = { id: 2, username: '卖家2' };

        cache.setSellerCache(1, testSeller1);
        cache.setSellerCache(2, testSeller2);

        const stats = cache.getCacheStats();
        expect(stats.totalSellers).toBe(2);
        expect(stats.sellers).toHaveLength(2);
        expect(stats.sellers[0].sellerId).toBe(1);
        expect(stats.sellers[0].username).toBe('卖家1');
        expect(stats.sellers[0].isExpired).toBe(false);
    });

    it('应该能够清理过期缓存', () => {
        const cache = sellerCacheStore();
        const testSeller = { id: 1, username: '测试卖家' };

        // 设置缓存
        cache.setSellerCache(1, testSeller);

        // 模拟时间过去，使缓存过期
        const originalNow = Date.now;
        const mockNow = vi.fn(() => originalNow() + 31 * 60 * 1000); // 31分钟后
        vi.stubGlobal('Date', { now: mockNow });

        // 清理过期缓存
        cache.cleanExpiredCache();

        // 检查缓存是否被清理
        expect(cache.hasSellerCache(1)).toBe(false);
        expect(cache.getCacheStats().totalSellers).toBe(0);

        // 恢复原始时间函数
        vi.unstubAllGlobals();
    });
});

