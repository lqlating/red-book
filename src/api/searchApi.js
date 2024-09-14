import axiosInstance from "./axiosInstance";

const searchApi = {
    // 搜索文章，通过 title 或 content
    searchArticle(keyword) {
        return axiosInstance.get(`/SearchArticle?keyword=${keyword}`);
    },

    // 搜索用户，通过 username
    searchUserByUsername(username) {
        return axiosInstance.get(`/SearchUserByUsername?username=${username}`);
    }
}

export default searchApi;
