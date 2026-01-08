# ⚖️ Banban — 밸런스 게임 소셜 미디어 웹 앱

> 사용자 간 밸런스 게임을 기반으로 토론하고 소통하는 커뮤니티 웹 서비스

## 🚀 Demo

- https://www.banban.today

## ✨ Features

- 밸런스 게임 투표 + 의견 작성
- 댓글/좋아요 기반 피드
- 피드 정렬 (최신순 / 좋아요순 / 댓글순)
- 실시간 알림 (웹소켓 기반)
- 핫 피드 랭킹
- 투표 결과 Recharts 시각화
- 무한 스크롤 기반 피드 탐색
- 사용자 세션/토큰 관리


## 🧰 Tech Stack

**Frontend**
- Next.js (App Router)
- React + TypeScript
- Zustand (Client State)
- React Query (Server State)
- Recharts (Data Visualization)


## 🧱 Architecture

Frontend
├── Next.js (App Router)
├── React Query ---- server state (피드, 댓글, 투표, 핫 피드, 알림 목록)
├── Zustand -------- client state (세션, 토큰, UI 상태)
├── apiFetch ------- 토큰/401 핸들링 + 에러 규격 일원화
├── WebSocket ------ 알림 실시간 수신 + 캐시 무효화
└── Recharts ------- 투표 결과 PieChart 시각화


## Auth & API Strategy

- 모든 API 요청은 `apiFetch` 래퍼로 통일
  - 액세스 토큰 자동 첨부
  - 401 발생 시 리프레시 재시도
  - 결과를 `ApiError` 포맷으로 일원화
- React Query로 인증된 API 데이터 관리
- Zustand로 세션(`checkAuth`, `refreshToken`, `expireSession`) 및 UI 상태 관리


## Feed & Query Caching

- 정렬 옵션별 Query Key 분리 → 캐시 충돌 없이 상태 보존
- 무한 스크롤: `pageParam` 기반 커서 방식
- 핫 피드 순위: 주기적 `refetchInterval` 적용


## 🧩 Technical Challenges

### 1. 401 토큰 만료 시 세션 일관성 유지

**문제**
- 여러 API 요청이 동시에 401을 받아 각각 리프레시 호출
- 중복 실행 + 오래된 토큰 사용 → 세션 불일치 발생

**접근**
- 전역 `refreshPromise` 공유로 리프레시 직렬화

**결과**
- 세션 일관성 확보 및 인증 에러 감소

---

### 2. 이미지 404 시 무한 요청 루프 방지

**문제**
- DOM 기반 `onError()`에서 직접 `src` 교체 → React 렌더와 충돌

**접근**
- 직접 DOM 조작 제거, `hasError` 상태 기반 렌더링으로 전환

**결과**
- 무한 루프 제거 + 안정적 폴백 제공

---

### 3. Recharts PieChart 커스터마이징

**문제**
- 투표 결과를 디자인 스펙에 맞게 시각화 필요
- 기본 Pie 라벨/하이라이트 기능만으로는 UX 요구 충족 어려움

**접근**
- `percentage → angle → (x, y)` 변환으로 라벨 좌표 매핑
- highlight 효과는 stroke 기반 방식으로 UX 향상
- gradient(`defs`) 및 shadow 필터로 시각 강조 적용

**결과**
- 퍼센트 라벨 가독성 및 선택 하이라이트 개선
- 디자인 스펙에 가까운 결과물 구현


## 🛠 Development

npm install
npm run dev


## 📌 To-Do

- Web Share + 모바일 UX 강화
- 접근성 개선 (ARIA, 키보드 내비게이션)
- 정교한 피드 추천/노출 로직

## 🔗 Links

- Demo: https://www.banban.today
