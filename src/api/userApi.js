import axiosInstance from "./axiosInstance";
const userApi = {
    SearchUserById(authorId){
        return axiosInstance.get(`/SearchUserById/${authorId}`)
    }
}

export default userApi;