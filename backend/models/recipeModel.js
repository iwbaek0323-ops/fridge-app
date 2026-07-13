const db = require("../config/db");

// ==================== 사용자 재료 조회 ====================
const getUserIngredients = (user_id, callback) => {

    const sql = `
        SELECT
            im.name
        FROM user_ingredients ui
        JOIN ingredients_master im
            ON ui.ingredient_master_id = im.ingredient_master_id
        WHERE ui.user_id = ?
    `;

    db.query(sql, [user_id], callback);

};

module.exports = {
    getUserIngredients
};