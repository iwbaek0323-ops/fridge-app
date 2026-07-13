const db = require("../config/db");

// ==================== 알림 조회 ====================
const getNotifications = (user_id, callback) => {

    const sql = `
        SELECT
            ui.user_ingredient_id,
            im.name,
            ui.storage_type,
            DATE(ui.expiration_date) AS expiration_date
        FROM user_ingredients ui
        JOIN ingredients_master im
            ON ui.ingredient_master_id = im.ingredient_master_id
        WHERE ui.user_id = ?
        ORDER BY ui.expiration_date ASC
    `;

    db.query(sql, [user_id], callback);

};

module.exports = {
    getNotifications
};