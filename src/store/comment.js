import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import axios from 'axios';
import { ElMessage } from "element-plus";

export const commentInfoStore = defineStore('comment', () => {
    // 回复评论（根）
    const commentsByArticleId = reactive({});

    async function submitComment(comment) {
        try {
            const response = await axios.post('http://localhost:8080/addComment', comment);
            if (response.data.code === 1) {
                ElMessage.success('评论添加成功');  
                await getComments(comment.article_id);
            } else {
                ElMessage.error(`评论添加失败: ${response.data.msg}`);  // 失败信息提示框
            }
        } catch (error) {
            console.error('评论添加失败:', error);
            ElMessage.error('评论添加失败，请稍后重试');  // 错误信息提示框
        }
    }

    // 加载根评论
    async function getComments(article_id) {
        try {
            const res = await axios.get(`http://localhost:8080/getCommentBylikeCount/${article_id}`);
            
            // 初始化 commentsByArticleId[article_id] 为一个空数组
            if (!commentsByArticleId[article_id]) {
                commentsByArticleId[article_id] = [];
            }

            // 使用 Array.prototype.push.apply 来合并数组
            commentsByArticleId[article_id].length = 0; // 清空数组
            commentsByArticleId[article_id].push(...res.data.data); // 推入新数据
            
            

        } catch (error) {
            console.error('获取评论失败:', error);
        }
    }

    return { submitComment, getComments, commentsByArticleId };
});
