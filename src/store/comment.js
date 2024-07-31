import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export const commentInfoStore = defineStore('comment', () => {
    // 存储根评论的数据
    const commentsByArticleId = reactive({});

    // 存储子评论的数据
    const subCommentsByParentId = reactive({});

    // 临时子评论对象
    const tempSubComment = reactive({
        content: '',
        article_id: null,
        user_id: null,
        parent_id: null,
    });

    // 临时grandparent_id
    let grandparent_id = ref(null);

    // 加载根评论
    async function getComments(article_id) {
        try {
            const res = await axios.get(`http://localhost:8080/getCommentBylikeCount/${article_id}`);

            if (!commentsByArticleId[article_id]) {
                commentsByArticleId[article_id] = [];
            }

            commentsByArticleId[article_id].length = 0; // 清空数组
            commentsByArticleId[article_id].push(...res.data.data); // 推入新数据
        } catch (error) {
            console.error('获取评论失败:', error);
        }
    }

    // 加载子评论
    async function getSubComments(parent_id) {
        try {
            const res = await axios.get(`http://localhost:8080/getCommentsByParentId/${parent_id}`);

            if (!subCommentsByParentId[parent_id]) {
                subCommentsByParentId[parent_id] = [];
            }

            subCommentsByParentId[parent_id].length = 0; // 清空数组
            subCommentsByParentId[parent_id].push(...res.data.data); // 推入新数据
        } catch (error) {
            console.error('获取子评论失败:', error);
        }
    }

    // 获取子评论数量
    async function getSubCommentCount(parent_id) {
        try {
            const res = await axios.get(`http://localhost:8080/getCommentCountByParentId/${parent_id}`);
            return res.data.data;
        } catch (error) {
            console.error('加载子评论数量失败:', error);
            return 0;
        }
    }

    // 回复根评论
    async function submitComment(comment) {
        try {
            const response = await axios.post('http://localhost:8080/addComment', comment);
            if (response.data.code === 1) {
                ElMessage.success('评论添加成功');
                await getComments(comment.article_id);
            } else {
                ElMessage.error(`评论添加失败: ${response.data.msg}`);
            }
        } catch (error) {
            console.error('评论添加失败:', error);
            ElMessage.error('评论添加失败，请稍后重试');
        }
    }

    // 回复子评论
    async function submitSubComment() {
        try {
            const response = await axios.post('http://localhost:8080/addComment', tempSubComment);
            if (response.data.code === 1) {
                ElMessage.success('评论添加成功');
                await getSubComments(grandparent_id.value);
                // 清空临时子评论对象和 grandparent_id
                tempSubComment.content = '';
                tempSubComment.article_id = null;
                tempSubComment.user_id = null;
                tempSubComment.parent_id = null;
                grandparent_id.value = null;
            } else {
                ElMessage.error(`评论添加失败: ${response.data.msg}`);
            }
        } catch (error) {
            console.error('评论添加失败:', error);
            ElMessage.error('评论添加失败，请稍后重试');
        }
    }

    return {
        submitComment,
        getComments,
        commentsByArticleId,
        getSubComments,
        subCommentsByParentId,
        submitSubComment,
        getSubCommentCount,
        tempSubComment,
        grandparent_id,
    };
});
