import axiosInstance from "./axiosInstance";

const subscriptApi = {
    // 根据用户 ID 获取已订阅的用户的 ID 列表
    getTargetId(userId) {
        return axiosInstance.get(`/getTargetIds/${userId}`);
    },

    // 添加订阅
    addSubscription(userId, targetId) {
        return axiosInstance.post('/addSubscription', null, {
            params: {
                userId,
                targetId,
            },
        });
    },

    // 删除订阅
    deleteSubscript(userId, targetId) {
        return axiosInstance.delete(`/deleteSubscript/${userId}/${targetId}`);
    },
};

export default subscriptApi;
