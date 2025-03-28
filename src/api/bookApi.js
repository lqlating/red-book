// src/api/bookApi.js

import axiosInstance from "./axiosInstance";

const bookApi = {
    // 获取所有书籍列表
    listBooks() {
        return axiosInstance.get('/list');
    },

    // 根据书籍 ID 获取书籍详情
    getBookById(bookId) {
        return axiosInstance.get(`/${bookId}`);
    },

    // 添加新书籍
    addBook(book) {
        return axiosInstance.post('/addBook', book);
    },

    // 更新书籍信息
    updateBook(book) {
        return axiosInstance.put('/update', book);
    },

    // 根据书籍 ID 删除书籍
    deleteBook(bookId) {
        return axiosInstance.delete(`/delete/${bookId}`);
    },

    // 根据书籍类型获取书籍列表
    getBooksByType(bookType) {
        return axiosInstance.get(`/type/${bookType}`);
    },

    // 根据书名搜索书籍（精确匹配）
    getBooksByTitle(title) {
        return axiosInstance.get(`/search`, { params: { title } });
    },

    // 根据书名搜索书籍（模糊匹配）
    getBooksByTitleContaining(title) {
        return axiosInstance.get(`/search/title`, { params: { title } });
    },

    // 根据书名精确搜索书籍
    getBooksByExactTitle(title) {
        return axiosInstance.get(`/search`, { params: { title } });
    }
};

export default bookApi;
