import axiosInstance from "./aixosInstance";
const articleApi = {
    Filtercontent(value){
        return axiosInstance.get(`/FilterContent/${value}`)
    }
}
export default articleApi