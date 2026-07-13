const recipeModel = require("../models/recipeModel");

const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// ==================== AI 레시피 추천 ====================
const getRecommendedRecipes = (req, res) => {

    const user_id = req.user.user_id;

    recipeModel.getUserIngredients(user_id, async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "DB 오류"
            });
        }

        if (result.length === 0) {
            return res.status(400).json({
                message: "등록된 재료가 없습니다."
            });
        }

        const ingredients = result.map(item => item.name).join(", ");

        const prompt = `
현재 사용자의 냉장고에 있는 재료는 다음과 같습니다.

${ingredients}

다음 규칙을 반드시 지켜주세요.

1. 현재 재료만으로 만들 수 있는 레시피를 최대 3개 추천하세요.

2. 재료가 1~2개 부족하면 만들 수 있는 레시피를 최대 2개 추천하세요.

3. 부족한 재료는 최대 2개까지만 허용합니다.

4. 한국에서 일반적으로 먹는 음식만 추천하세요.

5. 너무 희귀하거나 만들기 어려운 음식은 제외하세요.

6. 조리방법은 최대 5단계까지만 작성하세요.

7. 반드시 아래 JSON 형식으로만 응답하세요.

{
  "available_recipes": [
    {
      "title": "",
      "ingredients": [],
      "recipe": []
    }
  ],
  "recommended_recipes": [
    {
      "title": "",
      "missing_ingredients": [],
      "recipe": []
    }
  ]
}

JSON 외의 설명, markdown(\`\`\`json), 추가 문장은 절대 출력하지 마세요.
`;

        try {

            const response = await groq.chat.completions.create({

                model: "llama-3.3-70b-versatile",

                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                temperature: 0.5

            });

            let text = response.choices[0].message.content;

            // 혹시 ```json 으로 감싸서 오는 경우 제거
            text = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const recipes = JSON.parse(text);

            res.status(200).json({
                message: "레시피 추천 성공",
                ...recipes
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "AI 레시피 생성 실패",
                error: error.message
            });

        }

    });

};

module.exports = {
    getRecommendedRecipes
};