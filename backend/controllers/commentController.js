const commentModel = require("../models/commentModel");

// ==================== 댓글 작성 ====================
const createComment = (req, res) => {

    const user_id = req.user.user_id;

    const {
        post_id,
        content
    } = req.body;

    // 필수값 확인
    if (!post_id || !content) {

        return res.status(400).json({
            message: "게시글 번호와 댓글 내용을 입력해주세요."
        });

    }

    // 게시글 존재 확인
    commentModel.findPostById(post_id, (err, result) => {

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

        // 댓글 작성
        commentModel.createComment(
            {
                post_id,
                user_id,
                content
            },
            (err, result) => {

                if (err) {

                    return res.status(500).json({
                        message: "DB 오류"
                    });

                }

                res.status(201).json({
                    message: "댓글 작성 성공!",
                    comment_id: result.insertId
                });

            }
        );

    });

};

// ==================== 댓글 조회 ====================
const getComments = (req, res) => {

    const post_id = req.params.post_id;

    // 게시글 존재 확인
    commentModel.findPostById(post_id, (err, result) => {

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

        commentModel.getComments(post_id, (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "DB 오류"
                });

            }

            res.status(200).json({
                message: "댓글 조회 성공!",
                comments: result
            });

        });

    });

};

// ==================== 댓글 수정 ====================
const updateComment = (req, res) => {

    const comment_id = req.params.id;
    const loginUserId = req.user.user_id;

    const { content } = req.body;

    if (!content) {

        return res.status(400).json({
            message: "댓글 내용을 입력해주세요."
        });

    }

    // 댓글 작성자 확인
    commentModel.getCommentOwner(comment_id, (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "DB 오류"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "댓글을 찾을 수 없습니다."
            });

        }

        // 작성자 확인
        if (result[0].user_id !== loginUserId) {

            return res.status(403).json({
                message: "본인이 작성한 댓글만 수정할 수 있습니다."
            });

        }

        // 댓글 수정
        commentModel.updateComment(
            {
                comment_id,
                content
            },
            (err) => {

                if (err) {

                    return res.status(500).json({
                        message: "DB 오류"
                    });

                }

                res.status(200).json({
                    message: "댓글 수정 성공!"
                });

            }
        );

    });

};

// ==================== 댓글 삭제 ====================
const deleteComment = (req, res) => {

    const comment_id = req.params.id;
    const loginUserId = req.user.user_id;

    // 댓글 작성자 확인
    commentModel.getCommentOwner(comment_id, (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "DB 오류"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "댓글을 찾을 수 없습니다."
            });

        }

        // 작성자가 아니면 삭제 불가
        if (result[0].user_id !== loginUserId) {

            return res.status(403).json({
                message: "본인이 작성한 댓글만 삭제할 수 있습니다."
            });

        }

        // 댓글 삭제
        commentModel.deleteComment(comment_id, (err) => {

            if (err) {

                return res.status(500).json({
                    message: "DB 오류"
                });

            }

            res.status(200).json({
                message: "댓글 삭제 성공!"
            });

        });

    });

};

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment
};