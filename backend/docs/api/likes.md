# Likes API

로그인이 필요한 API는 Header에 JWT를 포함해야 합니다.

Authorization

Bearer JWT_TOKEN

------------------------------------------------------------------------

## 좋아요 토글

### URL

POST http://localhost:3000/api/posts/:id/like

### Header

Authorization

Bearer JWT_TOKEN

### Body

없음

### 첫 번째 요청(Response)

``` json
{
    "message": "좋아요!"
}
```

### 다시 요청(Response)

``` json
{
    "message": "좋아요 취소!"
}
```

### 설명

-   같은 사용자가 같은 게시글에 다시 요청하면 좋아요가 취소됩니다.
-   게시글의 like_count가 자동으로 증가/감소합니다.
-   게시글 상세 조회 시 liked 값으로 현재 로그인한 사용자의 좋아요
    여부를 확인할 수 있습니다.
