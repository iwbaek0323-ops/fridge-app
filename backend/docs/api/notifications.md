# 유통기한 알림 API

로그인이 필요한 API는 Header에 JWT를 포함해야 합니다.

Authorization

Bearer JWT_TOKEN

------------------------------------------------------------------------

## 유통기한 알림 조회

### URL

GET http://localhost:3000/api/notifications

### Header

Authorization

Bearer JWT_TOKEN

### Body

없음

### Response

```json
{
    "message": "알림 조회 성공",
    "notifications": [
        {
            "ingredient": "양파",
            "storage_type": "냉장",
            "expiration_date": "2026-07-13T15:00:00.000Z",
            "content": "유통기한이 1일 남았습니다."
        },
        {
            "ingredient": "감자",
            "storage_type": "냉장",
            "expiration_date": "2026-07-15T15:00:00.000Z",
            "content": "유통기한이 3일 남았습니다."
        }
    ]
}
```

### 설명

- 로그인한 사용자의 재료를 조회합니다.
- 유통기한이 3일 이하인 재료만 반환합니다.
- 유통기한이 3일 남은 재료와 1일 남은 재료를 알림으로 제공합니다.
- 유통기한이 지난 재료는 `"유통기한이 지났습니다."`라는 내용으로 반환됩니다.
- 별도의 알림 테이블을 사용하지 않고 `user_ingredients`의 `expiration_date`를 기준으로 계산하여 반환합니다.