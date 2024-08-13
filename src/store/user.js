// src/stores/userStore.js
import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import axios from 'axios';
import { ElMessage } from "element-plus";
import subscriptApi from "../api/subscriptApi";

export const userInfoStore = defineStore('user', () => {
    // 用户输入的账号和密码
    const account = ref('');
    const password = ref('');

    // 用户是否已登录以及是否显示登录框
    let isLogin = ref(!!localStorage.getItem('userInfo'));
    let showLogin = ref(false);

    // 用户目标 ID 列表
    let targetIds = ref([]);

    // 用户信息对象，包含各种用户属性
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

    // 提交登录信息
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

                    // 在登录成功后获取 targetIds
                    fetchTargetIds(userThing.id);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                ElMessage.error("密码或者账号错误，请重新输入");
                account.value = '';
                password.value = '';
            });
    };

    // 退出登录
    const logout = () => {
        // 重置所有状态
        isLogin.value = false;
        showLogin.value = false;
        account.value = '';
        password.value = '';
        targetIds.value = [];
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

    // 获取目标 ID 列表
    const fetchTargetIds = async (userId) => {
        try {
            const response = await subscriptApi.getTargetId(userId);
            targetIds.value = response.data.data; // 直接将响应结果赋值给 targetIds
        } catch (error) {
            console.error('请求失败:', error);
        }
    };

    // 仅当 userThing.id 有值时才调用
    if (userThing.id) {
        fetchTargetIds(userThing.id);
    }

    return {
        account,
        password,
        isLogin,
        showLogin,
        targetIds,
        userThing,
        submitLogin,
        logout
    };
});
