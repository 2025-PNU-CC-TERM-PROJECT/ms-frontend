# MS Serving - Frontend

AI 모델 서빙 플랫폼의 사용자 인터페이스를 제공하는 프론트엔드 애플리케이션 
**Next.js + TypeScript + Tailwind CSS** 기반으로 개발되었으며, 
사용자 로그인 이후 **마이페이지, 대시보드, 이미지 분류 및 텍스트 요약 기능**을 제공

---

## 기술 스택

- **프레임워크:** Next.js (App Router)
- **언어:** TypeScript
- **스타일링:** Tailwind CSS
- **상태관리:** React Hooks + Context 일부
- **요청 처리:** Fetch API / Axios

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 사용자 로그인 | JWT 기반 인증 시스템 연동 (백엔드 `/api/auth/login`) |
| 마이페이지 | 사용자 정보 조회 및 표시 (`/mypage`) |
| 대시보드 | 모델 사용 이력 시각화 (`/dashboard`) |
| 이미지 분류 | 이미지 업로드 → 추론 결과 시각화 (FastAPI 연동) |
| 텍스트 요약 | 텍스트 입력 → 요약 결과 출력 (FastAPI 연동) |

---

