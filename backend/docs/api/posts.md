# Posts API

로그인이 필요한 API는 Header에 JWT를 포함해야 합니다.

Authorization

Bearer JWT_TOKEN

------------------------------------------------------------------------

## 1. 게시글 작성

### URL

POST http://localhost:3000/api/posts

### Header

Authorization

Bearer JWT_TOKEN

### Request

``` json
{
    "category": "질문",
    "title": "감자전 질문입니다.",
    "content": "감자전 반죽이 너무 묽어요."
}
```

### Response

``` json
{
    "message": "게시글 작성 성공!"
}
```

------------------------------------------------------------------------

## 2. 게시글 목록 조회

### URL

GET http://localhost:3000/api/posts

### Response

``` json
{
    "message": "게시글 목록 조회 성공!",
    "posts": [
        {
            "post_id": 1,
            "category": "질문",
            "title": "감자전 질문입니다.",
            "author": "감자왕",
            "like_count": 3,
            "comment_count": 2,
            "created_at": "2026-07-08"
        }
    ]
}
```

------------------------------------------------------------------------

## 3. 게시글 상세 조회

### URL

GET http://localhost:3000/api/posts/:id

### Header (선택)

Authorization

Bearer JWT_TOKEN

### Response

``` json
{
    "message": "게시글 조회 성공!",
    "post": {
        "post_id": 1,
        "category": "질문",
        "title": "감자전 질문입니다.",
        "content": "감자전 반죽이 너무 묽어요.",
        "author": "감자왕",
        "like_count": 3,
        "created_at": "2026-07-08"
    },
    "liked": true
}
```

※ JWT가 없으면 liked는 false를 반환합니다.

------------------------------------------------------------------------

## 4. 게시글 수정

### URL

PUT http://localhost:3000/api/posts/:id

### Header

Authorization

Bearer JWT_TOKEN

### Request

``` json
{
    "category": "질문",
    "title": "수정된 제목",
    "content": "수정된 내용"
}
```

### Response

``` json
{
    "message": "게시글 수정 성공!"
}
```

------------------------------------------------------------------------

## 5. 게시글 삭제

### URL

DELETE http://localhost:3000/api/posts/:id

### Header

Authorization

Bearer JWT_TOKEN

### Response

``` json
{
    "message": "게시글 삭제 성공!"
}
```
