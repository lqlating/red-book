import axiosInstance from "./aixosInstance";
const articleApi = {
    Filtercontent(value){
        return axiosInstance.get(`/FilterContent/${value}`)
    },
    getArticleById(article_id){
        return axiosInstance.get(`/getArticleById/${article_id}`)
    }
}
export default articleApi