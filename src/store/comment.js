// store/comment.js
import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export const commentInfoStore = defineStore('comment', () => {
    const commentsByArticleId = reactive({});
    const subCommentsByParentId = reactive({});
    const commentCountByArticleId = reactive({});
    const tempSubComment = reactive({
        content: '',
        article_id: null,
        user_id: null,
        parent_id: null,
    });
    const grandparent_id = ref(null);

    // 加载根评论
    async function getComments(article_id) {
        try {
            const res = await axios.get(`http://localhost:8080/api/getCommentBylikeCount/${article_id}`);
            if (!commentsByArticleId[article_id]) {
                commentsByArticleId[article_id] = [];
            }
            commentsByArticleId[article_id].length = 0;
            commentsByArticleId[article_id].push(...res.data.data);
        } catch (error) {
            console.error('获取评论失败:', error);
        }
    }

    // 获取评论数量
    async function getCommentCount(article_id) {
        try {
            const res = await axios.get(`http://localhost:8080/api/getCommentCount/${article_id}`);
            commentCountByArticleId[article_id] = res.data;
        } catch (error) {
            console.error('获取评论数量失败:', error);
        }
    }

    // 加载子评论
    async function getSubComments(parent_id) {
        try {
            const res = await axios.get(`http://localhost:8080/api/getCommentsByParentId/${parent_id}`);
            if (!subCommentsByParentId[parent_id]) {
                subCommentsByParentId[parent_id] = [];
            }
            subCommentsByParentId[parent_id].length = 0;
            subCommentsByParentId[parent_id].push(...res.data.data);
        } catch (error) {
            console.error('获取子评论失败:', error);
        }
    }

    // 回复根评论
    async function submitComment(comment) {
        try {
            const response = await axios.post('http://localhost:8080/api/addComment', comment);
            if (response.data.code === 1) {
                ElMessage.success('评论添加成功');
                await getComments(comment.article_id);
                await getCommentCount(comment.article_id); // 更新评论数量
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
            const response = await axios.post('http://localhost:8080/api/addComment', tempSubComment);
            if (response.data.code === 1) {
                ElMessage.success('评论添加成功');
                
                await getSubComments(grandparent_id.value);
                await getCommentCount(tempSubComment.article_id); // 更新评论数量
                tempSubComment.content = '';
                // tempSubComment.article_id = null;
                // tempSubComment.user_id = null;
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
        getCommentCount,
        commentsByArticleId,
        commentCountByArticleId,
        getSubComments,
        subCommentsByParentId,
        submitSubComment,
        tempSubComment,
        grandparent_id,
    };
});
