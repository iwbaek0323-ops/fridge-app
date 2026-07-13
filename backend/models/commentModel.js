const db = require("../config/db");

// ==================== 댓글 작성 ====================
const createComment = (data, callback) => {

    const sql = `
        INSERT INTO comments
        (
            post_id,
            user_id,
            content
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.post_id,
            data.user_id,
            data.content
        ],
        callback
    );

};

// ==================== 댓글 조회 ====================
const getComments = (post_id, callback) => {

    const sql = `
        SELECT
            c.comment_id,
            u.nickname AS author,
            c.content,
            DATE_FORMAT(c.created_at, '%Y-%m-%d') AS created_at
        FROM comments c
        JOIN users u
            ON c.user_id = u.user_id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
    `;

    db.query(sql, [post_id], callback);

};

// ==================== 게시글 존재 확인 ====================
const findPostById = (post_id, callback) => {

    const sql = `
        SELECT post_id
        FROM posts
        WHERE post_id = ?
    `;

    db.query(sql, [post_id], callback);

};

// ==================== 댓글 작성자 확인 ====================
const getCommentOwner = (comment_id, callback) => {

    const sql = `
        SELECT user_id
        FROM comments
        WHERE comment_id = ?
    `;

    db.query(sql, [comment_id], callback);

};

// ==================== 댓글 수정 ====================
const updateComment = (data, callback) => {

    const sql = `
        UPDATE comments
        SET
            content = ?
        WHERE comment_id = ?
    `;

    db.query(
        sql,
        [
            data.content,
            data.comment_id
        ],
        callback
    );

};

// ==================== 댓글 삭제 ====================
const deleteComment = (comment_id, callback) => {

    const sql = `
        DELETE FROM comments
        WHERE comment_id = ?
    `;

    db.query(sql, [comment_id], callback);

};

module.exports = {
    createComment,
    findPostById,
    getComments,
    getCommentOwner,
    updateComment,
    deleteComment
};