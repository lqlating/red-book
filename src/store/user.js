import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import axios from 'axios';
import { ElMessage } from "element-plus";

export const userInfoStore = defineStore('user', () => {
    const account = ref('');
    const password = ref('');
    let isLogin = ref(!!localStorage.getItem('userInfo'));
    let showLogin = ref(false);
    const userThing = reactive({
        username: '',
        email: '',
        id: '',
        avatar: '',
        subscript: '',
        introduction: '',
        gender: '',
        fans: ''
    });

    // 从 localStorage 恢复用户信息
    if (isLogin.value) {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        Object.assign(userThing, storedUserInfo);
    }

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
                    ElMessage.success("登录成功");
                    // 更新 userThing 对象的属性并保存到 localStorage
                    const { username, email, id, avatar, gender, introduction, fans, subscript } = data.data;
                    Object.assign(userThing, { username, email, id, avatar, gender, introduction, fans, subscript });
                    localStorage.setItem('userInfo', JSON.stringify(userThing));
                    account.value = '';
                    password.value = '';
                    isLogin.value = true;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                ElMessage.error("密码或者账号错误，请重新输入");
                account.value = '';
                password.value = '';
            });
    };

    const logout = () => {
        isLogin.value = false;
        Object.assign(userThing, {
            username: '',
            email: '',
            id: '',
            avatar: '',
            subscript: '',
            introduction: '',
            gender: '',
            fans: ''
        });
        localStorage.removeItem('userInfo');
        ElMessage.success("登出成功");
    };

    return { password, account, submitLogin, userThing, isLogin, showLogin, logout };
});
