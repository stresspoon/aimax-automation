# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정 생성/로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `aimax-v2`
   - Database Password: 강력한 비밀번호 설정
   - Region: `Northeast Asia (Seoul)` 선택

## 2. 환경변수 설정

프로젝트 생성 후 Settings > API 에서 다음 정보를 복사:

1. `.env.local` 파일 생성 (`.env.local.example` 참고)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## 3. 데이터베이스 스키마 적용

### 방법 1: Supabase Dashboard에서 직접 실행
1. SQL Editor 탭으로 이동
2. `supabase/migrations/001_initial_schema.sql` 내용 복사
3. 붙여넣기 후 실행

### 방법 2: Supabase CLI 사용 (선택사항)
```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref [your-project-ref]

# 마이그레이션 실행
supabase db push
```

## 4. Authentication 설정

1. Authentication > Providers 에서 이메일 인증 활성화 확인
2. Authentication > Email Templates 에서 템플릿 커스터마이징 (선택사항)
3. Authentication > URL Configuration 에서 리다이렉트 URL 설정:
   - Site URL: `http://localhost:3001` (개발)
   - Redirect URLs: `http://localhost:3001/auth/callback`

## 5. Storage 설정 (추후 필요시)

1. Storage 탭에서 버킷 생성:
   - `avatars` - 사용자 프로필 이미지
   - `campaign-assets` - 캠페인 관련 파일
   - `generated-content` - AI 생성 콘텐츠

## 6. 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
http://localhost:3001
```

## 주요 테이블 구조

### profiles
- 사용자 프로필 정보
- Supabase Auth와 연동

### campaigns
- 마케팅 캠페인 정보
- 상태 관리 (draft, active, paused, completed)

### projects
- 자동화 프로젝트 (고객모집, 상세페이지, 영상)
- 캠페인과 연결

### orders
- 주문 정보
- 결제 상태 관리

### tool_purchases
- 개별 도구 구매 기록

## Row Level Security (RLS)

모든 테이블에 RLS가 적용되어 있어 사용자는 자신의 데이터만 접근 가능합니다.

## 트러블슈팅

### CORS 에러
- Supabase Dashboard > Settings > API > CORS에서 도메인 추가

### 인증 에러
- 환경변수가 올바르게 설정되었는지 확인
- `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인

### 마이그레이션 에러
- SQL Editor에서 에러 메시지 확인
- 기존 테이블과 충돌 시 DROP TABLE 후 재실행