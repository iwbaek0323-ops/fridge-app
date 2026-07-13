const notificationModel = require("../models/notificationModel");

// ==================== 알림 조회 ====================
const getNotifications = (req, res) => {

    const user_id = req.user.user_id;

    notificationModel.getNotifications(user_id, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "DB 오류"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const notifications = [];

        result.forEach(item => {

            const expiration = new Date(item.expiration_date);
            expiration.setHours(0, 0, 0, 0);

            const diff = Math.ceil(
                (expiration.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            if (diff === 3) {

                notifications.push({
                    ingredient: item.name,
                    storage_type: item.storage_type,
                    expiration_date: item.expiration_date,
                    content: "유통기한이 3일 남았습니다."
                });

            } else if (diff === 1) {

                notifications.push({
                    ingredient: item.name,
                    storage_type: item.storage_type,
                    expiration_date: item.expiration_date,
                    content: "유통기한이 1일 남았습니다."
                });

            }

        });

        res.status(200).json({
            message: "알림 조회 성공",
            notifications
        });

    });

};

module.exports = {
    getNotifications
};