# OCR 재료 추출 API

로그인이 필요하지 않은 API입니다.

------------------------------------------------------------------------

## OCR 재료 추출

### URL

POST http://localhost:3000/api/ocr

### Header

Content-Type

multipart/form-data

### Body

| Key | Type | 설명 |
|------|------|------|
| image | File | 영수증 이미지 |

### Response

```json
{
    "message": "OCR 성공",
    "ingredients": [
        {
            "ingredient_master_id": 33,
            "name": "우유"
        },
        {
            "ingredient_master_id": 3,
            "name": "양파"
        },
        {
            "ingredient_master_id": 17,
            "name": "깻잎"
        },
        {
            "ingredient_master_id": 11,
            "name": "브로콜리"
        }
    ],
    "notFound": [
        "장아찌"
    ]
}
```

### 설명

- 영수증 이미지를 업로드하면 Google Vision OCR을 이용하여 텍스트를 추출합니다.
- 추출된 텍스트에서 Groq AI가 식재료만 선별합니다.
- DB에 등록된 재료는 표준 재료명으로 변환하여 반환합니다.
- DB에 존재하지 않는 식재료는 notFound에 반환합니다.
- OCR API는 재료를 DB에 저장하지 않습니다.
- 반환된 결과를 확인한 후 재료 등록 API를 호출하여 사용자의 냉장고에 저장합니다.

## 동작 흐름

1. 사용자가 영수증 이미지를 업로드합니다.
2. Google Vision OCR이 텍스트를 추출합니다.
3. AI(Groq)가 OCR 결과에서 재료명을 추출합니다.
4. 서버는 ingredients_master와 대조하여 등록 가능한 재료를 반환합니다.
5. 프론트엔드는 반환된 재료 목록을 사용자에게 보여줍니다.
6. 사용자가 재료를 확인·수정한 후 등록 버튼을 누릅니다.
7. 프론트엔드는 기존 재료 등록 API(POST /ingredients)를 호출하여 DB에 저장합니다.

※ OCR API는 재료를 자동으로 저장하지 않으며, 재료 인식 결과만 반환합니다.