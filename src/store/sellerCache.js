import { defineStore } from 'pinia';
import { ref } from 'vue';

export const sellerCacheStore = defineStore('sellerCache', () => {
    // 缓存卖家信息
    const sellerCache = ref(new Map());

    // 缓存配置
    const CACHE_EXPIRY_TIME = 30 * 60 * 1000; // 30分钟过期

    // 获取卖家缓存
    function getSellerCache(sellerId) {
        return sellerCache.value.get(sellerId) || null;
    }

    // 设置卖家缓存
    function setSellerCache(sellerId, sellerData) {
        const cacheData = {
            data: sellerData,
            timestamp: Date.now()
        };
        sellerCache.value.set(sellerId, cacheData);
    }

    // 检查卖家是否有缓存
    function hasSellerCache(sellerId) {
        const cache = sellerCache.value.get(sellerId);
        if (!cache) return false;

        // 检查是否过期
        const isExpired = Date.now() - cache.timestamp > CACHE_EXPIRY_TIME;
        if (isExpired) {
            // 清除过期缓存
            sellerCache.value.delete(sellerId);
            return false;
        }

        return true;
    }

    // 获取缓存的卖家数据
    function getCachedSeller(sellerId) {
        const cache = getSellerCache(sellerId);
        return cache ? cache.data : null;
    }

    // 清除特定卖家的缓存
    function clearSellerCache(sellerId) {
        sellerCache.value.delete(sellerId);
    }

    // 清除所有卖家缓存
    function clearAllSellerCache() {
        sellerCache.value.clear();
    }

    // 获取缓存统计信息
    function getCacheStats() {
        const stats = {
            totalSellers: sellerCache.value.size,
            sellers: []
        };

        for (const [sellerId, cache] of sellerCache.value.entries()) {
            const isExpired = Date.now() - cache.timestamp > CACHE_EXPIRY_TIME;
            stats.sellers.push({
                sellerId,
                username: cache.data?.username || 'Unknown',
                timestamp: cache.timestamp,
                isExpired
            });
        }

        return stats;
    }

    // 清理过期缓存
    function cleanExpiredCache() {
        const now = Date.now();
        for (const [sellerId, cache] of sellerCache.value.entries()) {
            if (now - cache.timestamp > CACHE_EXPIRY_TIME) {
                sellerCache.value.delete(sellerId);
            }
        }
    }

    // 检查缓存是否过期
    function isCacheExpired(sellerId) {
        const cache = sellerCache.value.get(sellerId);
        if (!cache) return true;

        return Date.now() - cache.timestamp > CACHE_EXPIRY_TIME;
    }

    // 更新卖家信息（如果缓存存在）
    function updateSellerCache(sellerId, updatedData) {
        const cache = sellerCache.value.get(sellerId);
        if (cache) {
            cache.data = { ...cache.data, ...updatedData };
            cache.timestamp = Date.now();
        }
    }

    return {
        sellerCache,
        getSellerCache,
        setSellerCache,
        hasSellerCache,
        getCachedSeller,
        clearSellerCache,
        clearAllSellerCache,
        getCacheStats,
        cleanExpiredCache,
        isCacheExpired,
        updateSellerCache
    };
});

