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

        axios.post('http://localhost:8080/api/login', loginRequest)
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

// 订阅（关注）作者
const insertSubscript = async (authorId) => {
    try {
        // 防止用户关注自己
        if (authorId === userThing.id) {
            ElMessage.warning("不能关注自己！");
            return; // 退出函数，避免继续执行
        }

        const response = await subscriptApi.insertSubscript(userThing.id, authorId);
        // 根据 code 字段判断
        if (response?.data?.code === 1) {
            await fetchTargetIds(userThing.id); // 刷新 targetIds
            // ElMessage.success(response.data.data || "关注成功");
        } else {
            // 如果 code 不是 1，显示错误信息
            ElMessage.error(response.data.data || "关注失败");
        }
    } catch (error) {
        // 捕获异常并记录日志
        console.error('关注失败:', error);
        ElMessage.error(error.response?.data?.data || "关注失败");
    }
};

// 取消订阅（取消关注）作者
const deleteSubscript = async (authorId) => {
    try {
        const response = await subscriptApi.deleteSubscript(userThing.id, authorId);
        // 根据 code 字段判断
        if (response?.data?.code === 1) {
            await fetchTargetIds(userThing.id); // 刷新 targetIds
            // ElMessage.success(response.data.data || "取消关注成功");
        } else {
            // 如果 code 不是 1，显示错误信息
            ElMessage.error(response.data.data || "取消关注失败");
        }
    } catch (error) {
        // 捕获异常并记录日志
        console.error('取消关注失败:', error);
        ElMessage.error(error.response?.data?.data || "取消关注失败");
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
        logout,
        insertSubscript,
        deleteSubscript,
    };
});
