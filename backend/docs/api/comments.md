# Comments API

로그인이 필요한 API는 Header에 JWT를 포함해야 합니다.

Authorization

Bearer JWT_TOKEN

------------------------------------------------------------------------

## 1. 댓글 작성

### URL

POST http://localhost:3000/api/comments

### Request

``` json
{
    "post_id": 1,
    "content": "좋은 정보 감사합니다."
}
```

### Response

``` json
{
    "message": "댓글 작성 성공!",
    "comment_id": 1
}
```

------------------------------------------------------------------------

## 2. 댓글 조회

### URL

GET http://localhost:3000/api/comments/:post_id

### Response

``` json
{
    "message": "댓글 조회 성공!",
    "comments": [
        {
            "comment_id": 1,
            "author": "감자왕",
            "content": "좋은 정보 감사합니다.",
            "created_at": "2026-07-08"
        }
    ]
}
```

------------------------------------------------------------------------

## 3. 댓글 수정

### URL

PUT http://localhost:3000/api/comments/:id

### Header

Authorization

Bearer JWT_TOKEN

### Request

``` json
{
    "content": "수정된 댓글입니다."
}
```

### Response

``` json
{
    "message": "댓글 수정 성공!"
}
```

------------------------------------------------------------------------

## 4. 댓글 삭제

### URL

DELETE http://localhost:3000/api/comments/:id

### Header

Authorization

Bearer JWT_TOKEN

### Response

``` json
{
    "message": "댓글 삭제 성공!"
}
```
