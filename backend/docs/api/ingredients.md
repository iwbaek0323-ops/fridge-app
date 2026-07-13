# Ingredients API

로그인이 필요한 API는 Header에 JWT를 포함해야 합니다.

Authorization

Bearer JWT_TOKEN

---

# 1. 카테고리 조회

## URL

GET http://localhost:3000/api/ingredients/categories

## Response

```json
{
    "message": "카테고리 조회 성공",
    "categories": [
        {
            "category": "채소"
        }
    ]
}
```

---

# 2. 카테고리별 재료 조회

## URL

GET http://localhost:3000/api/ingredients/master?category=채소

## Response

```json
{
    "message": "재료 목록 조회 성공",
    "ingredients": [
        {
            "ingredient_master_id": 1,
            "name": "감자"
        }
    ]
}
```

---

# 3. 재료 등록

## URL

POST http://localhost:3000/api/ingredients

## Header

Authorization

Bearer JWT_TOKEN

## Request (자동 소비기한 계산)

```json
{
    "ingredient_master_id": 1,
    "storage_type": "실온",
    "quantity": "2개"
}
```

## Request (직접 소비기한 지정)

```json
{
    "ingredient_master_id": 1,
    "storage_type": "실온",
    "quantity": "2개",
    "expiration_date": "2026-08-06"
}
```

## Response

```json
{
    "message": "재료 등록 성공!"
}
```

## Error Response (지원하지 않는 보관방법)

```json
{
    "message": "감자는 실온 보관만 가능합니다."
}
```

### 참고

- 카테고리는 사용자가 직접 입력하지 않습니다.
- ingredient_master_id를 기준으로 카테고리가 자동으로 결정됩니다.
- expiration_date를 입력하지 않으면 평균 소비기한을 기준으로 자동 계산됩니다.
- 지원하지 않는 보관방법을 선택하면 가능한 보관방법을 안내합니다.

예시

- 감자 → 감자는 실온 보관만 가능합니다.
- 당근 → 당근은 냉장, 냉동 보관만 가능합니다.
- 사과 → 사과는 냉장, 실온 보관만 가능합니다.

---

# 4. 내 재료 조회

## URL

GET http://localhost:3000/api/ingredients

## Header

Authorization

Bearer JWT_TOKEN

## Response

```json
{
    "message": "내 재료 조회 성공",
    "ingredients": [
        {
            "user_ingredient_id": 1,
            "name": "감자",
            "category": "채소",
            "storage_type": "실온",
            "quantity": "2개",
            "expiration_date": "2026-08-06",
            "d_day": "D-30"
        }
    ]
}
```

### d_day 설명

| 값 | 의미 |
|-----|------|
| D-30 | 유통기한까지 30일 남음 |
| D-7 | 유통기한까지 7일 남음 |
| D-1 | 유통기한까지 1일 남음 |
| D-Day | 오늘이 유통기한 |
| D+3 | 유통기한이 3일 지남 |

---

# 5. 재료 수정

## URL

PUT http://localhost:3000/api/ingredients/:id

:id = user_ingredient_id

예시

```text
PUT http://localhost:3000/api/ingredients/1
```

## Header

Authorization

Bearer JWT_TOKEN

## Request (자동 소비기한 계산)

```json
{
    "storage_type": "냉동",
    "quantity": "5개"
}
```

## Request (직접 소비기한 지정)

```json
{
    "storage_type": "냉동",
    "quantity": "5개",
    "expiration_date": "2026-12-31"
}
```

## Response

```json
{
    "message": "재료 수정 성공!"
}
```

---

# 6. 재료 삭제

## URL

DELETE http://localhost:3000/api/ingredients/:id

:id = user_ingredient_id

예시

```text
DELETE http://localhost:3000/api/ingredients/1
```

## Header

Authorization

Bearer JWT_TOKEN

## Response

```json
{
    "message": "재료 삭제 성공!"
}
```