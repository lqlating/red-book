// src/stores/userStore.js
import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import axios from 'axios';
import { ElMessage } from "element-plus";
import subscriptApi from "../api/subscriptApi";

// 检查存储的数据是否过期
const isDataExpired = (timestamp) => {
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
    return now - timestamp > oneDay;
};

// 从 sessionStorage 获取数据
const getStoredUserData = () => {
    const storedData = sessionStorage.getItem('userInfo');
    if (storedData) {
        const { data, timestamp } = JSON.parse(storedData);
        if (!isDataExpired(timestamp)) {
            return data;
        }
        sessionStorage.removeItem('userInfo'); // 删除过期数据
    }
    return null;
};

export const userInfoStore = defineStore('user', () => {
    // 用户输入的账号和密码
    const account = ref('');
    const password = ref('');

    // 用户是否已登录以及是否显示登录框
    let isLogin = ref(!!getStoredUserData());
    let showLogin = ref(false);

    // 用户目标 ID 列表
    let targetIds = ref([]);

    // 用户信息对象，包含各种用户属性
    const userThing = reactive({
        username: '',
        email: '',
        id: '',
        avatar_base64: '',
        subscript: 0,
        introduction: '',
        gender: '',
        fans: 0,
        is_banned: 0,
        ban_until: null
    });

    // 从 sessionStorage 恢复用户信息
    const storedUserInfo = getStoredUserData();
    if (storedUserInfo) {
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
                    const userData = {
                        username: data.data.username,
                        email: data.data.email,
                        id: data.data.id,
                        avatar_base64: data.data.avatar_base64,
                        gender: data.data.gender,
                        introduction: data.data.introduction,
                        fans: data.data.fans,
                        subscript: data.data.subscript,
                        is_banned: data.data.is_banned,
                        ban_until: data.data.ban_until
                    };

                    Object.assign(userThing, userData);
                    // 继续使用 sessionStorage
                    sessionStorage.setItem('userInfo', JSON.stringify({
                        data: userData,
                        timestamp: new Date().getTime()
                    }));

                    account.value = '';
                    password.value = '';
                    isLogin.value = true;
                    ElMessage.success("登录成功");

                    // 添加一个短暂的延时，确保数据保存后再刷新页面
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
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
            avatar_base64: '', // 清空 base64 头像数据
            subscript: 0,
            introduction: '',
            gender: '',
            fans: 0,
            is_banned: 0,
            ban_until: null
        });
        sessionStorage.removeItem('userInfo');
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
