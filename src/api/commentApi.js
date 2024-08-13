import axiosInstance from "./axiosInstance";
const commentApi = {
    GetCommentCount(article_id) {
        return axiosInstance.get(`/getCommentCount/${article_id}`)
    },
    BeReplyComment(user_id){
        return axiosInstance.get(`/getCommentsByUserId/${user_id}`)
    },
    GetCommentById(comment_id){
        return axiosInstance.get(`/byCommentId/${comment_id}`)
    }
}
export default commentApi