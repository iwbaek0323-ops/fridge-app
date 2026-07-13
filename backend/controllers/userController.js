const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// ==================== 회원가입 ====================
const signup = async (req, res) => {

    const { name, email, password, nickname } = req.body;

    if (!name || !email || !password || !nickname) {
        return res.status(400).json({
            message: "모든 항목을 입력해주세요."
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "올바른 이메일 형식이 아닙니다."
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "비밀번호는 8자 이상이어야 합니다."
        });
    }

    userModel.findByEmail(email, async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "DB 오류"
            });
        }

        if (result.length > 0) {
            return res.status(400).json({
                message: "이미 사용 중인 이메일입니다."
            });
        }

        userModel.findByNickname(nickname, async (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "DB 오류"
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "이미 사용 중인 닉네임입니다."
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            userModel.createUser(
                name,
                email,
                hashedPassword,
                nickname,
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: "회원가입 실패"
                        });
                    }

                    res.status(201).json({
                        message: "회원가입 성공!"
                    });

                }
            );

        });

    });

};

// ==================== 로그인 ====================
const login = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "이메일과 비밀번호를 입력해주세요."
        });
    }

    userModel.findByEmail(email, async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "DB 오류"
            });
        }

        if (result.length === 0) {
            return res.status(400).json({
                message: "존재하지 않는 이메일입니다."
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "비밀번호가 일치하지 않습니다."
            });
        }

        // JWT 생성
        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "로그인 성공!",
            token: token
        });

    });

};

module.exports = {
    signup,
    login
};