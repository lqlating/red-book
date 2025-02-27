import axiosInstance from "./axiosInstance";

const bookApi = {
    // 获取所有书籍列表
    listBooks() {
        return axiosInstance.get('/books/list');
    },
    // 根据书籍ID获取书籍信息
    getBookById(bookId) {
        return axiosInstance.get(`/books/${bookId}`);
    },
    // 添加书籍
    addBook(book) {
        return axiosInstance.post('/books/add', book);
    },
    // 更新书籍信息
    updateBook(book) {
        return axiosInstance.put('/books/update', book);
    },
    // 删除书籍
    deleteBook(bookId) {
        return axiosInstance.delete(`/books/delete/${bookId}`);
    },
    // 根据书籍类型获取书籍列表
    getBooksByType(bookType) {
        return axiosInstance.get(`/books/type/${bookType}`);
    }
};

export default bookApi;
