const db = require("../config/db");

// ==================== 게시글 작성 ====================
const createPost = (data, callback) => {

    const sql = `
        INSERT INTO posts
        (
            user_id,
            category,
            title,
            content
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.user_id,
            data.category,
            data.title,
            data.content
        ],
        callback
    );

};

// ==================== 게시글 목록 조회 ====================
const getPosts = (callback) => {

    const sql = `
    SELECT
        p.post_id,
        p.category,
        p.title,
        u.nickname AS author,
        p.like_count,
        COUNT(c.comment_id) AS comment_count,
        DATE_FORMAT(p.created_at, '%Y-%m-%d') AS created_at
    FROM posts p

    JOIN users u
        ON p.user_id = u.user_id

    LEFT JOIN comments c
        ON p.post_id = c.post_id

    GROUP BY
        p.post_id,
        p.category,
        p.title,
        u.nickname,
        p.like_count,
        p.created_at

    ORDER BY p.created_at DESC
`;

    db.query(sql, callback);

};

// ==================== 게시글 상세 조회 ====================
const getPostById = (post_id, callback) => {

    const sql = `
        SELECT
            p.post_id,
            p.category,
            p.title,
            p.content,
            u.nickname AS author,
            p.like_count,
            DATE_FORMAT(p.created_at, '%Y-%m-%d') AS created_at,
            DATE_FORMAT(p.updated_at, '%Y-%m-%d') AS updated_at
        FROM posts p
        JOIN users u
            ON p.user_id = u.user_id
        WHERE p.post_id = ?
    `;

    db.query(sql, [post_id], callback);

};

// ==================== 게시글 작성자 확인 ====================
const getPostOwner = (post_id, callback) => {

    const sql = `
        SELECT user_id
        FROM posts
        WHERE post_id = ?
    `;

    db.query(sql, [post_id], callback);

};

// ==================== 게시글 수정 ====================
const updatePost = (data, callback) => {

    const sql = `
        UPDATE posts
        SET
            category = ?,
            title = ?,
            content = ?
        WHERE post_id = ?
    `;

    db.query(
        sql,
        [
            data.category,
            data.title,
            data.content,
            data.post_id
        ],
        callback
    );

};

// ==================== 게시글 삭제 ====================
const deletePost = (post_id, callback) => {

    const sql = `
        DELETE FROM posts
        WHERE post_id = ?
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

// ==================== 좋아요 확인 ====================
const findLike = (post_id, user_id, callback) => {

    const sql = `
        SELECT like_id
        FROM post_likes
        WHERE post_id = ?
        AND user_id = ?
    `;

    db.query(sql, [post_id, user_id], callback);

};

// ==================== 좋아요 추가 ====================
const addLike = (post_id, user_id, callback) => {

    const sql = `
        INSERT INTO post_likes
        (
            post_id,
            user_id
        )
        VALUES (?, ?)
    `;

    db.query(sql, [post_id, user_id], callback);

};

// ==================== 좋아요 삭제 ====================
const removeLike = (post_id, user_id, callback) => {

    const sql = `
        DELETE FROM post_likes
        WHERE post_id = ?
        AND user_id = ?
    `;

    db.query(sql, [post_id, user_id], callback);

};

// ==================== 좋아요 증가 ====================
const increaseLikeCount = (post_id, callback) => {

    const sql = `
        UPDATE posts
        SET like_count = like_count + 1
        WHERE post_id = ?
    `;

    db.query(sql, [post_id], callback);

};

// ==================== 좋아요 감소 ====================
const decreaseLikeCount = (post_id, callback) => {

    const sql = `
        UPDATE posts
        SET like_count = like_count - 1
        WHERE post_id = ?
    `;

    db.query(sql, [post_id], callback);

};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    getPostOwner,
    updatePost,
    deletePost,
    findPostById,
    findLike,
    addLike,
    removeLike,
    increaseLikeCount,
    decreaseLikeCount
};