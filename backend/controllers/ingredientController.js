const ingredientModel = require("../models/ingredientModel");

// ==================== 카테고리 조회 ====================
const getCategories = (req, res) => {

    ingredientModel.getCategories((err, result) => {

        if (err) {
            return res.status(500).json({
                message: "DB 오류"
            });
        }

        res.status(200).json({
            message: "카테고리 조회 성공",
            categories: result
        });

    });

};

// ==================== 카테고리별 재료 조회 ====================
const getIngredientsByCategory = (req, res) => {

    const { category } = req.query;

    if (!category) {
        return res.status(400).json({
            message: "카테고리를 입력해주세요."
        });
    }

    ingredientModel.getIngredientsByCategory(category, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "DB 오류"
            });
        }

        res.status(200).json({
            message: "재료 목록 조회 성공",
            ingredients: result
        });

    });

};



// ==================== 재료 등록 ====================
const addIngredient = (req, res) => {

    //console.log("addIngredient 실행");

    const user_id = req.user.user_id;

    const {
        ingredient_master_id,
        storage_type,
        quantity,
        expiration_date
    } = req.body;

    if (!ingredient_master_id || !storage_type || !quantity) {
        return res.status(400).json({
            message: "필수값이 누락되었습니다."
        });
    }

    ingredientModel.findIngredientById(
        ingredient_master_id,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "DB 오류"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "재료를 찾을 수 없습니다."
                });
            }

            const ingredient = result[0];

            //console.log("storage_type :", storage_type);
            //console.log("ingredient :", ingredient);

            let days = null;

            if (storage_type === "냉장") {
                days = ingredient.refrigerator_days;
            } else if (storage_type === "냉동") {
                days = ingredient.freezer_days;
            } else if (storage_type === "실온") {
                days = ingredient.room_temperature_days;
            }

            //console.log("최종 days :", days);

            // 지원하지 않는 보관방법
            if (days === null && !expiration_date) {

                const available = [];

                if (ingredient.refrigerator_days !== null)
                    available.push("냉장");

                if (ingredient.freezer_days !== null)
                    available.push("냉동");

                if (ingredient.room_temperature_days !== null)
                    available.push("실온");

                return res.status(400).json({
                    message: `${ingredient.name}는 ${available.join(", ")} 보관만 가능합니다.`
                });
            }

            let finalExpirationDate = expiration_date;

            if (!finalExpirationDate) {

                const today = new Date();

                today.setDate(today.getDate() + days);

                finalExpirationDate = today
                    .toISOString()
                    .split("T")[0];
            }

            ingredientModel.addIngredient({
                user_id,
                ingredient_master_id,
                storage_type,
                quantity,
                expiration_date: finalExpirationDate
            }, (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "DB 오류"
                    });
                }

                res.status(201).json({
                    message: "재료 등록 성공!"
                });

            });

        });

};

// ==================== 내 재료 조회 ====================
const getUserIngredients = (req, res) => {

    const user_id = req.user.user_id;

    ingredientModel.getUserIngredients(user_id, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "DB 오류"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const ingredients = result.map(item => {

            const expiration = new Date(item.expiration_date);
            expiration.setHours(0, 0, 0, 0);

            const diff = Math.ceil(
                (expiration.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return {
                ...item,
                d_day: diff >= 0 ? `D-${diff}` : `D+${Math.abs(diff)}`
            };

        });

        res.status(200).json({
            message: "내 재료 조회 성공",
            ingredients: ingredients
        });

    });

};

// ==================== 재료 수정 ====================
const updateIngredient = (req, res) => {

    const user_id = req.user.user_id;
    const user_ingredient_id = req.params.id;

    const {
        storage_type,
        quantity,
        expiration_date
    } = req.body;

    if (!storage_type || !quantity) {
        return res.status(400).json({
            message: "필수값이 누락되었습니다."
        });
    }

    ingredientModel.findUserIngredient(
        user_ingredient_id,
        user_id,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "DB 오류"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "재료를 찾을 수 없습니다."
                });
            }

            const userIngredient = result[0];

            ingredientModel.findIngredientById(
                userIngredient.ingredient_master_id,
                (err, ingredientResult) => {

                    if (err) {
                        return res.status(500).json({
                            message: "DB 오류"
                        });
                    }

                    const ingredient = ingredientResult[0];

                    let days = null;

                    if (storage_type === "냉장") {
                        days = ingredient.refrigerator_days;
                    } else if (storage_type === "냉동") {
                        days = ingredient.freezer_days;
                    } else if (storage_type === "실온") {
                        days = ingredient.room_temperature_days;
                    }

                    let finalExpirationDate = expiration_date;

                    if (!finalExpirationDate) {

                        const today = new Date();

                        today.setDate(today.getDate() + days);

                        finalExpirationDate = today.toISOString().split("T")[0];

                    }

                    ingredientModel.updateIngredient({
                        storage_type,
                        quantity,
                        expiration_date: finalExpirationDate,
                        user_ingredient_id,
                        user_id
                    }, (err) => {

                        if (err) {
                            return res.status(500).json({
                                message: "DB 오류"
                            });
                        }

                        res.status(200).json({
                            message: "재료 수정 성공!"
                        });

                    });

                });

        });

};

// ==================== 재료 삭제 ====================
const deleteIngredient = (req, res) => {

    const user_id = req.user.user_id;
    const user_ingredient_id = req.params.id;

    // 내 재료인지 먼저 확인
    ingredientModel.findUserIngredient(
        user_ingredient_id,
        user_id,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "DB 오류"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "재료를 찾을 수 없습니다."
                });
            }

            ingredientModel.deleteIngredient(
                user_ingredient_id,
                user_id,
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: "DB 오류"
                        });
                    }

                    res.status(200).json({
                        message: "재료 삭제 성공!"
                    });

                }
            );

        }
    );

};

module.exports = {
    getCategories,
    getIngredientsByCategory,
    addIngredient,
    getUserIngredients,
    updateIngredient,
    deleteIngredient
};