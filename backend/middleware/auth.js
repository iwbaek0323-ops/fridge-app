const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    // Authorization 헤더 가져오기
    const authHeader = req.headers.authorization;

    // 토큰이 없는 경우
    if (!authHeader) {
        return res.status(401).json({
            message: "토큰이 없습니다."
        });
    }

    // "Bearer 토큰" 형태인지 확인
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "토큰 형식이 올바르지 않습니다."
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 로그인한 사용자 정보를 저장
        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "유효하지 않은 토큰입니다."
        });

    }

};

module.exports = verifyToken;