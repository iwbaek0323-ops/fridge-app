const vision = require("@google-cloud/vision");
const Groq = require("groq-sdk");
const ocrModel = require("../models/ocrModel");

const client = new vision.ImageAnnotatorClient({
    keyFilename: "./config/vision-key.json"
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

exports.extractText = async (imagePath) => {
    try {
        const [result] = await client.textDetection(imagePath);

        const detections = result.textAnnotations;

        if (!detections || detections.length === 0) {
            return "";
        }

        return detections[0].description;

    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.extractIngredients = async (ocrText) => {

    // callback을 Promise로 감싸기
    const ingredientList = await new Promise((resolve, reject) => {

        //console.log("===== OCR TEXT =====");
        //console.log(ocrText);
        
        ocrModel.getIngredientNames((err, rows) => {

            if (err) {
                return reject(err);
            }

            resolve(rows.map(row => row.name));

        });

    });

    const prompt = `
당신은 영수증 OCR 결과를 분석하는 AI입니다.

아래는 우리 서비스에서 사용하는 재료명 목록입니다.

${ingredientList.join(", ")}

규칙

1. OCR에서 구매한 식재료만 추출하세요.

2. 반드시 위 목록 안에 있는 재료명은 해당 재료명으로 사용하세요.

3. 상품명은 가장 적절한 재료명으로 변환하세요.

예시
대패삼겹살 → 돼지고기
목살 → 돼지고기
삼겹살 → 돼지고기
서울우유 → 우유
비비고 왕교자 → 만두
달걀 -> 계란

4. 상품명이 특정 브랜드이거나 가공상품이라면 가장 대표적인 식재료명으로 변환하세요.

예시
서울우유 → 우유
매일우유 → 우유
비비고 왕교자 → 만두

5. 목록에 없는 식재료도 제외하지 말고 그대로 반환하세요.

예시
장아찌 → 장아찌
고사리 → 고사리
참나물 → 참나물

6. OCR 오타가 있더라도 문맥상 식재료라고 판단되면 가장 가까운 식재료명으로 보정하세요.

예시
브로커리 → 브로콜리
깻입 → 깻잎

7. JSON 배열만 반환하세요.

8. 설명은 절대 하지 마세요.

OCR 결과

${ocrText}
`;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.2
    });

    const content = response.choices[0].message.content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const aiIngredients = JSON.parse(content);

    console.log("===== AI RESULT =====");
    console.log(aiIngredients);

    const ingredients = [];
    const notFound = [];

    for (const name of aiIngredients) {

        const rows = await new Promise((resolve, reject) => {

            ocrModel.findIngredientByName(name, (err, rows) => {

                if (err) {
                    return reject(err);
                }

                resolve(rows);

            });

        });

        if (rows.length > 0) {

            ingredients.push({
                ingredient_master_id: rows[0].ingredient_master_id,
                name: rows[0].name
            });

        } else {

            notFound.push(name);

        }
    }
    return {
        message: "OCR 성공",
        ingredients,
        notFound
    };
};