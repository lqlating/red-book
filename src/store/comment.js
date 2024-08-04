// comment.js store
import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export const commentInfoStore = defineStore('comment', () => {
    const commentsByArticleId = reactive({});
    const subCommentsByParentId = reactive({});
    const tempSubComment = reactive({
        content: '',
        article_id: null,
        user_id: null,
        parent_id: null,
    });
    const grandparent_id = ref(null);

    async function getComments(article_id) {
        try {
            const res = await axios.get(`http://localhost:8080/getCommentBylikeCount/${article_id}`);
            if (!commentsByArticleId[article_id]) {
                commentsByArticleId[article_id] = [];
            }
            commentsByArticleId[article_id].length = 0;
            commentsByArticleId[article_id].push(...res.data.data);
        } catch (error) {
            console.error('获取评论失败:', error);
        }
    }

    async function getSubComments(parent_id) {
        try {
            const res = await axios.get(`http://localhost:8080/getCommentsByParentId/${parent_id}`);
            if (!subCommentsByParentId[parent_id]) {
                subCommentsByParentId[parent_id] = [];
            }
            subCommentsByParentId[parent_id].length = 0;
            subCommentsByParentId[parent_id].push(...res.data.data);
        } catch (error) {
            console.error('获取子评论失败:', error);
        }
    }

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

    async function submitSubComment() {
        try {
            const response = await axios.post('http://localhost:8080/addComment', tempSubComment);
            if (response.data.code === 1) {
                ElMessage.success('评论添加成功');
                await getSubComments(grandparent_id.value);
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
        tempSubComment,
        grandparent_id,
    };
});
