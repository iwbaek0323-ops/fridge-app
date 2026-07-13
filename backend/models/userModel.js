const db = require("../config/db");

const createUser = (name, email, password, nickname, callback) => {

    const sql = `
        INSERT INTO users (name, email, password, nickname)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, email, password, nickname], callback);

};

const findByEmail = (email, callback) => {

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], callback);

};

const findByNickname = (nickname, callback) => {

    const sql = "SELECT * FROM users WHERE nickname = ?";

    db.query(sql, [nickname], callback);

};

module.exports = {
    createUser,
    findByEmail,
    findByNickname
};