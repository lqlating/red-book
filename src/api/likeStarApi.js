import axiosInstance from "./axiosInstance";

const likeStarApi = {
    addOperation(userId, commentId, articleId, operationType) {
        return axiosInstance.post('/api/operation/add', {
            userId: userId,
            commentId: commentId,
            articleId: articleId,
            operationType: operationType
        });
    }
};

export default likeStarApi;
