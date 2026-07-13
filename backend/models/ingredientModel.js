const db = require("../config/db");

// ==================== 카테고리 조회 ====================
const getCategories = (callback) => {

    const sql = `
        SELECT DISTINCT category
        FROM ingredients_master
        ORDER BY category;
    `;

    db.query(sql, callback);

};

// ==================== 카테고리별 재료 조회 ====================
const getIngredientsByCategory = (category, callback) => {

    const sql = `
        SELECT ingredient_master_id, name
        FROM ingredients_master
        WHERE category = ?
        ORDER BY name;
    `;

    db.query(sql, [category], callback);

};

// ==================== 재료 정보 조회 ====================
const findIngredientById = (ingredient_master_id, callback) => {

    const sql = `
        SELECT *
        FROM ingredients_master
        WHERE ingredient_master_id = ?
    `;

    db.query(sql, [ingredient_master_id], callback);

};

// ==================== 재료 등록 ====================
const addIngredient = (data, callback) => {

    const sql = `
        INSERT INTO user_ingredients
        (
            user_id,
            ingredient_master_id,
            storage_type,
            quantity,
            expiration_date
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.user_id,
            data.ingredient_master_id,
            data.storage_type,
            data.quantity,
            data.expiration_date
        ],
        callback
    );

};

// ==================== 내 재료 조회 ====================
const getUserIngredients = (user_id, callback) => {

    const sql = `
        SELECT
            ui.user_ingredient_id,
            im.name,
            im.category,
            ui.storage_type,
            ui.quantity,
            DATE_FORMAT(ui.expiration_date, '%Y-%m-%d') AS expiration_date
        FROM user_ingredients ui
        JOIN ingredients_master im
            ON ui.ingredient_master_id = im.ingredient_master_id
        WHERE ui.user_id = ?
        ORDER BY ui.expiration_date ASC;
    `;

    db.query(sql, [user_id], callback);

};

// ==================== 사용자 재료 조회 ====================
const findUserIngredient = (user_ingredient_id, user_id, callback) => {

    const sql = `
        SELECT *
        FROM user_ingredients
        WHERE user_ingredient_id = ?
        AND user_id = ?
    `;

    db.query(sql, [user_ingredient_id, user_id], callback);

};

// ==================== 재료 수정 ====================
const updateIngredient = (data, callback) => {

    const sql = `
        UPDATE user_ingredients
        SET
            storage_type = ?,
            quantity = ?,
            expiration_date = ?
        WHERE
            user_ingredient_id = ?
        AND
            user_id = ?
    `;

    db.query(
        sql,
        [
            data.storage_type,
            data.quantity,
            data.expiration_date,
            data.user_ingredient_id,
            data.user_id
        ],
        callback
    );

};

// ==================== 재료 삭제 ====================
const deleteIngredient = (user_ingredient_id, user_id, callback) => {

    const sql = `
        DELETE
        FROM user_ingredients
        WHERE user_ingredient_id = ?
        AND user_id = ?
    `;

    db.query(sql, [user_ingredient_id, user_id], callback);

};

module.exports = {
    getCategories,
    getIngredientsByCategory,
    findIngredientById,
    addIngredient,
    getUserIngredients,
    findUserIngredient,
    updateIngredient,
    deleteIngredient
};