import axiosInstance from "./axiosInstance";

const likeStarApi = {
    //点赞或者收藏文章（评论）
    addOperation(userId, commentId, articleId, operationType) {
        return axiosInstance.post('/operation/add', {
            user_id: userId,
            comment_id: commentId,
            article_id: articleId,
            operation_type: operationType
        });
    },
    //取消点赞和收藏文章（评论）
    deleteOperation(userId, commentId, articleId, operationType) {
        return axiosInstance.post('/operation/delete', {
            user_id: userId,
            comment_id: commentId,
            article_id: articleId,
            operation_type: operationType
        });
    },
    //查询点赞和收藏文章（评论）
    searchOperation(userId, commentId, articleId, operationType) {
        return axiosInstance.post('/operation/search', {
            user_id: userId,
            comment_id: commentId,
            article_id: articleId,
            operation_type: operationType
        });
    },
    searchCount(params) {
        return axiosInstance.post('/operation/searchCount', params);
    }
};

export default likeStarApi;
