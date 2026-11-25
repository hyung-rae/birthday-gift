# 🎂 생일 축하 페이지

HTML/CSS/JS만으로 만든 모바일용 생일 축하 페이지. 선물 상자 → 축하 → 뽑기 → 편지 순서.

## 다른 친구용으로 바꾸기

- **방법 1:** `config.js`의 `to`(받는 사람), `from`(보내는 사람), 편지, 상품을 수정
- **방법 2 (수정 없이):** 링크 뒤에 붙이기 → `https://<아이디>.github.io/birthday-gift/?to=민수&from=지영`

상품마다 `count`(판에 깔리는 칸 수)와 `weight`(실제 당첨 확률, 없으면 0)로 조절. `tease: true`면 뽑은 칸 바로 옆에 항상 깔리는 "아깝다~" 상품. `bad: true`는 꽝 칸 (확률 문구 계산용). 회차별 결과 멘트는 `rounds`에서 수정.

## 로컬에서 보기

`index.html`을 브라우저로 열면 됨.

## GitHub Pages 배포

1. GitHub에 저장소 만들고 push
2. 저장소 Settings → Pages → Branch: `main` / `/(root)` 선택 → Save
3. 1~2분 뒤 `https://<아이디>.github.io/<저장소이름>/` 에서 확인
