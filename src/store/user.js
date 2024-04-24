import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import axios from 'axios';
import { ElMessage } from "element-plus";

export const userInfoStore = defineStore('user', () => {
    const account = ref('');
    const password = ref('');
    const isLogin = ref('false')
    const userThing = reactive({
        user: '',
        email: '',
        id: '',
        avatar: '',
    });

    const submitLogin = () => {
        const loginRequest = {
            account: account.value,
            password: password.value
        };

        axios.post('http://localhost:8080/login', loginRequest)
            .then(({ data }) => {
                if (data && data.code === 0) {
                    console.error('Error:', data.msg);
                    ElMessage.error("密码或者账号错误，请重新输入");
                    account.value = '';
                    password.value = '';
                } else {
                    console.log(data.data);
                    ElMessage.success("登录成功");

                    // 使用Vue.set或者Object.assign修改userThing对象的属性
                    const { user, email, id, avatar } = data.data;
                    Object.assign(userThing, { user, email, id, avatar });
                    console.log("test--", userThing);
                    account.value = '';
                    password.value = '';
                    isLogin.value = !isLogin.value;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                ElMessage.error("密码或者账号错误，请重新输入");
                account.value = '';
                password.value = '';
            });
    };

    return { password, account, submitLogin, userThing };
});
