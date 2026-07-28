const ocrService = require("../services/ocrService");

exports.extractText = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "이미지를 업로드하세요."
            });
        }

    const text = await ocrService.extractText(req.file.path);

    const result = await ocrService.extractIngredients(text);

    //console.log(result);

    res.json(result);

    } catch (err) {

    console.error(err);

    res.status(500).json({
        message: "OCR 실패",
        error: err.message
    });

}
};