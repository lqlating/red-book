import axiosInstance from "./aixosInstance";
const commentApi = {
    GetCommentCount(article_id) {
        return axiosInstance.get(`/getCommentCount/${article_id}`)
    }
}
export default commentApi