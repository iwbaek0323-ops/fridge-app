const postModel = require("../models/postModel");

// ==================== 게시글 작성 ====================
const createPost = (req, res) => {

    const user_id = req.user.user_id;

    const {
        category,
        title,
        content
    } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "제목과 내용을 입력해주세요."
        });
    }

    postModel.createPost(
        {
            user_id,
            category: category || null,
            title,
            content
        },
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "DB 오류"
                });
            }

            res.status(201).json({
                message: "게시글 작성 성공!",
                post_id: result.insertId
            });

        }
    );

};

// ==================== 게시글 목록 조회 ====================
const getPosts = (req, res) => {

    postModel.getPosts((err, result) => {

        if (err) {

            return res.status(500).json({
                message: "DB 오류"
            });

        }

        res.status(200).json({
            message: "게시글 목록 조회 성공!",
            posts: result
        });

    });

};

// ==================== 게시글 상세 조회 ====================
const getPostById = (req, res) => {

    const post_id = req.params.id;

    postModel.getPostById(post_id, (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "DB 오류"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "게시글을 찾을 수 없습니다."
            });

        }

        const post = result[0];

        // 로그인 안 한 사용자
        if (!req.user) {

            return res.status(200).json({
                message: "게시글 조회 성공!",
                post,
                liked: false
            });

        }

        // 로그인한 사용자
        postModel.findLike(
            post_id,
            req.user.user_id,
            (err, likeResult) => {

                if (err) {

                    return res.status(500).json({
                        message: "DB 오류"
                    });

                }

                res.status(200).json({
                    message: "게시글 조회 성공!",
                    post,
                    liked: likeResult.length > 0
                });

            }
        );

    });

};

// ==================== 게시글 수정 ====================
const updatePost = (req, res) => {

    const post_id = req.params.id;
    const loginUserId = req.user.user_id;

    const {
        category,
        title,
        content
    } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "제목과 내용을 입력해주세요."
        });
    }

    // 게시글 작성자 확인
    postModel.getPostOwner(post_id, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "DB 오류"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "게시글을 찾을 수 없습니다."
            });
        }

        // 작성자가 아니면 수정 불가
        if (result[0].user_id !== loginUserId) {
            return res.status(403).json({
                message: "본인이 작성한 게시글만 수정할 수 있습니다."
            });
        }

        // 수정
        postModel.updatePost(
            {
                post_id,
                category: category || null,
                title,
                content
            },
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "DB 오류"
                    });
                }

                res.status(200).json({
                    message: "게시글 수정 성공!"
                });

            }
        );

    });

};

// ==================== 게시글 삭제 ====================
const deletePost = (req, res) => {

    const post_id = req.params.id;
    const loginUserId = req.user.user_id;

    // 게시글 작성자 확인
    postModel.getPostOwner(post_id, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "DB 오류"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "게시글을 찾을 수 없습니다."
            });
        }

        // 작성자가 아니면 삭제 불가
        if (result[0].user_id !== loginUserId) {
            return res.status(403).json({
                message: "본인이 작성한 게시글만 삭제할 수 있습니다."
            });
        }

        // 삭제
        postModel.deletePost(post_id, (err) => {

            if (err) {
                return res.status(500).json({
                    message: "DB 오류"
                });
            }

            res.status(200).json({
                message: "게시글 삭제 성공!"
            });

        });

    });

};

// ==================== 좋아요 토글 ====================
const toggleLike = (req, res) => {

    const post_id = req.params.id;
    const user_id = req.user.user_id;

    // 게시글 존재 확인
    postModel.findPostById(post_id, (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "DB 오류"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "게시글을 찾을 수 없습니다."
            });

        }

        // 좋아요 여부 확인
        postModel.findLike(post_id, user_id, (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "DB 오류"
                });

            }

            // ==================== 좋아요 취소 ====================
            if (result.length > 0) {

                postModel.removeLike(post_id, user_id, (err) => {

                    if (err) {

                        return res.status(500).json({
                            message: "DB 오류"
                        });

                    }

                    postModel.decreaseLikeCount(post_id, (err) => {

                        if (err) {

                            return res.status(500).json({
                                message: "DB 오류"
                            });

                        }

                        res.status(200).json({
                            message: "좋아요 취소!"
                        });

                    });

                });

            }

            // ==================== 좋아요 추가 ====================
            else {

                postModel.addLike(post_id, user_id, (err) => {

                    if (err) {

                        return res.status(500).json({
                            message: "DB 오류"
                        });

                    }

                    postModel.increaseLikeCount(post_id, (err) => {

                        if (err) {

                            return res.status(500).json({
                                message: "DB 오류"
                            });

                        }

                        res.status(200).json({
                            message: "좋아요!"
                        });

                    });

                });

            }

        });

    });

};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleLike
};