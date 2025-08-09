## AIMAX Admin – Troubleshooting Log

본 문서는 개발/배포 중 발생했던 주요 오류와 해결 방법을 요약합니다.

### 1) Yarn 미설치로 CRA 생성 중단 (spawn yarn ENOENT)
- 증상: `create-next-app` 실행 중 `spawn yarn ENOENT`로 중단
- 원인: Yarn 미활성화
- 해결:
  - Corepack 활성화 및 Yarn 설치 확인
  - 명령어:
    - `corepack enable && corepack prepare yarn@stable --activate && yarn -v`
    - 설치 후 `yarn install`

### 2) shadcn/ui 초기화 실패 (Tailwind v4)
- 증상: `shadcn init` → `Validation failed: tailwind: Required`
- 원인: Tailwind v4 환경에서 CLI 검증 실패
- 해결: Radix UI + Sonner 기반으로 Button/Card/Input/Dialog/Badge/Toast를 수동 구현

### 3) Turbopack 패닉/Next.js package not found
- 증상: `TurbopackInternalError: Next.js package not found`
- 원인: 로컬 환경/캐시 이슈 + 상위 디렉터리 lockfile 간섭
- 해결:
  - `package.json`의 dev 스크립트를 `next dev`로 변경하여 Turbopack 비활성화
  - 상위 디렉터리 `package-lock.json` 제거로 lockfile 경고 제거
  - 필요 시 `.next` 삭제 후 재기동

### 4) ESLint 플러그인 누락
- 증상: `eslint-plugin-react-hooks`, `@next/eslint-plugin-next` 미존재로 빌드 실패
- 해결: `yarn add -D eslint-plugin-react eslint-plugin-react-hooks @next/eslint-plugin-next`

### 5) App Router 파라미터 타입 변화(Next 15)
- 증상: 동적 라우트 `params` 타입 불일치
- 원인: Next 15에서 `params: Promise<...>` 형태 사용
- 해결: 페이지 시그니처를 `params: Promise<{ id: string }>`로 수정 후 `await` 사용

### 6) Hydration 경고 (브라우저 확장 주입 속성)
- 증상: `<html>`에 확장프로그램이 속성 주입 → SSR/CSR 불일치 경고
- 해결: `app/layout.tsx`의 `<html>`/`<body>`에 `suppressHydrationWarning` 추가

### 7) useState 사용 컴포넌트의 클라이언트 지시어 누락
- 증상: `useState` 사용 페이지에서 "use client" 미지정으로 500/컴파일 오류
- 해결: 파일 상단에 `"use client";` 추가

### 8) Server Component에서 require() 금지
- 증상: Vercel 빌드 에러 – `@typescript-eslint/no-require-imports`
- 해결: client wrapper 컴포넌트를 별도 파일(`*-client.tsx`)로 생성하여 import

### 9) Supabase 환경변수 미설정으로 빌드 실패
- 증상: `supabaseUrl is required`
- 원인: 모듈 로드 시 즉시 클라이언트 생성 → 빌드 타임에 ENV 필요
- 해결: `getSupabase()`로 런타임 지연 생성(모듈 최상단 생성 금지)

### 10) ESLint 일반 경고/오류 모음
- any 사용/빈 인터페이스: 명시 타입으로 개선 (예: `type InputProps = React.InputHTMLAttributes<HTMLInputElement>`) 
- useEffect deps: `useCallback`으로 래핑 후 deps에 등록
- 미사용 import/변수: 제거 또는 주석 처리

### 11) .next 캐시 불일치로 로컬 500 (Qualified path resolution failed)
- 증상: `.next/server/xxx.js`를 찾지 못해 500
- 해결: dev 서버 종료 → `.next` 폴더 삭제 → 재기동

### 12) Pretendard 폰트 적용
- 조치: `app/globals.css`에 Pretendard Variable CDN @import 추가, `--font-sans`를 Pretendard 우선으로 설정

### 13) API/기능 연동 관련 주의
- Edge 런타임(route handlers) 사용 시 SSG 비활성 경고는 정상 동작에 영향 없음
- Supabase 관련 API: ENV 필요 시 로컬 `.env.local`/Vercel 환경변수 설정 필요

### 유틸 명령어 모음
- dev 재기동 + 캐시 초기화:
  - `pkill -f "next dev" || true`
  - `rm -rf .next`
  - `yarn dev -p 3000`
- ESLint 플러그인 설치: `yarn add -D eslint-plugin-react eslint-plugin-react-hooks @next/eslint-plugin-next`

### 환경변수 템플릿 (.env)
프로젝트 루트에 `.env`를 생성하고 아래 키를 설정하세요.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_WEBHOOK_SECRET=
TOSS_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```


