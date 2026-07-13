const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // 토큰이 없으면 그냥 통과
    if (!authHeader) {
        return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return next();
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

    } catch (err) {

        // 토큰이 이상해도 게시글은 볼 수 있도록 그냥 통과
    }

    next();

};

module.exports = optionalAuth;