// ocrModel.js
const db = require("../config/db");

const getIngredientNames = (callback) => {

    const sql = `
        SELECT name
        FROM ingredients_master
    `;

    db.query(sql, callback);

};

// 재료 이름으로 ingredient_master 조회
const findIngredientByName = (name, callback) => {

    const sql = `
        SELECT ingredient_master_id, name
        FROM ingredients_master
        WHERE name = ?
    `;

    db.query(sql, [name], callback);

};

module.exports = {
    getIngredientNames,
    findIngredientByName
};