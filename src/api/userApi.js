import axiosInstance from "./aixosInstance";
const userApi = {
    SearchUserById(authorId){
        return axiosInstance.get(`/SearchUserById/${authorId}`)
    }
}

export default userApi;