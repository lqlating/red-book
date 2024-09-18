import axiosInstance from "./axiosInstance";

const articleApi = {
    Filtercontent(value) {
        return axiosInstance.get(`/FilterContent/${value}`);
    },
    getArticlesByIds(articleIds) {
        return axiosInstance.post('/getArticlesByIds', articleIds);
    },
    getArticlesByAuthorId(authorId) {  // 新增的接口
        return axiosInstance.get(`/getArticlesByAuthorId/${authorId}`);
    }
};

export default articleApi;
