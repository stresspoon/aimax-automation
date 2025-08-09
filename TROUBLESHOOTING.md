# AI Max Automation - 트러블슈팅 가이드

## 목차
1. [Vercel 배포 오류](#1-vercel-배포-오류)
2. [로컬 개발 환경 스타일 깨짐](#2-로컬-개발-환경-스타일-깨짐)
3. [macOS 방화벽 차단 문제](#3-macos-방화벽-차단-문제)
4. [Git Push 권한 오류](#4-git-push-권한-오류)

---

## 1. Vercel 배포 오류

### 문제
Vercel 배포 시 ESLint 오류로 빌드 실패

### 오류 메시지
```
Failed to compile.

./app/automation/marketing/[projectId]/page.tsx
33:16  Error: A `require()` style import is forbidden.  @typescript-eslint/no-require-imports

./app/api/projects/rules/route.ts
21:12  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars

./components/marketing/project-stats.tsx
38:6  Warning: React Hook useEffect has a missing dependency: 'refresh'.
```

### 원인
1. Import 문이 컴포넌트 함수 아래에 위치
2. catch 블록에서 error 변수를 사용하지 않음
3. useEffect 의존성 배열 누락

### 해결 방법

#### 1. Import 문 순서 수정
```typescript
// ❌ 잘못된 코드
export default function Component() {
  return <div>...</div>;
}
import Something from "./something";

// ✅ 올바른 코드
import Something from "./something";

export default function Component() {
  return <div>...</div>;
}
```

#### 2. catch 블록 error 변수 사용
```typescript
// ❌ 잘못된 코드
try {
  // ...
} catch {
  return NextResponse.json({ fallback: true });
}

// ✅ 올바른 코드
try {
  // ...
} catch (err) {
  console.error("Error:", err);
  return NextResponse.json({ fallback: true });
}
```

#### 3. useEffect 의존성 경고 처리
```typescript
// ESLint 경고 무시 (의도적인 경우)
useEffect(() => {
  // ...
}, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps
```

---

## 2. 로컬 개발 환경 스타일 깨짐

### 문제
로컬에서 개발 서버 실행 시 CSS 스타일이 적용되지 않음

### 원인
Tailwind CSS v4와 v3의 설정 방식 차이

### 해결 방법

#### Tailwind CSS v4 설정 (권장)

1. **globals.css**
```css
@import "tailwindcss";
@import url("https://...pretendard...min.css");

:root {
  --bg: #f2f1ef;
  --fg: #131313;
  /* ... */
}
```

2. **postcss.config.mjs**
```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};
export default config;
```

3. **tailwind.config.ts 삭제** (v4에서는 불필요)

#### 필요한 패키지
```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4"
  }
}
```

---

## 3. macOS 방화벽 차단 문제

### 문제
localhost:3000 접속 시 "프록시 방화벽 설정 중" 메시지 표시

### 원인
macOS 방화벽이 Node.js의 수신 연결을 차단

### 해결 방법

#### 방법 1: 시스템 설정에서 허용
1. **시스템 설정** → **개인정보 보호 및 보안** → **방화벽**
2. **옵션...** 클릭
3. Node.js 찾기 또는 **+** 버튼으로 추가
   - M1/M2 Mac: `/opt/homebrew/bin/node`
   - Intel Mac: `/usr/local/bin/node`
4. "수신 연결 허용" 체크

#### 방법 2: Node.js 위치 확인
```bash
# Node.js 설치 위치 확인
which node
# 출력: /opt/homebrew/bin/node
```

#### 방법 3: 개발 서버 포트 확인
```bash
# 포트 사용 확인
lsof -i :3000

# 프로세스 확인
ps aux | grep "next dev"
```

---

## 4. Git Push 권한 오류

### 문제
GitHub에 push 시 SSH 인증 실패

### 오류 메시지
```
git@github.com: Permission denied (publickey).
fatal: 리모트 저장소에서 읽을 수 없습니다
```

### 해결 방법

#### 방법 1: HTTPS로 변경
```bash
# SSH에서 HTTPS로 변경
git remote set-url origin https://github.com/username/repo.git

# 확인
git remote -v

# Push
git push origin main
```

#### 방법 2: SSH 키 설정 (영구적 해결)
```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your-email@example.com"

# SSH 에이전트 시작
eval "$(ssh-agent -s)"

# SSH 키 추가
ssh-add ~/.ssh/id_ed25519

# 공개 키 복사 (GitHub에 추가)
cat ~/.ssh/id_ed25519.pub
```

---

## 일반적인 개발 명령어

### 개발 서버 관리
```bash
# 개발 서버 시작
npm run dev

# 백그라운드 실행
npm run dev > /dev/null 2>&1 &

# 프로세스 종료
kill [PID]

# 포트 확인
lsof -i :3000
```

### 빌드 및 배포
```bash
# 로컬 빌드 테스트
npm run build

# 프로덕션 실행
npm run start

# Vercel 배포 (자동)
git push origin main
```

### 의존성 관리
```bash
# 패키지 설치
npm install

# 캐시 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 추가 팁

### 브라우저 캐시 문제
- **강제 새로고침**: Cmd+Shift+R (Mac) / Ctrl+Shift+F5 (Windows)
- **개발자 도구**: F12 → Network 탭 → "Disable cache" 체크

### 환경 변수 설정
`.env.local` 파일 생성:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### TypeScript 오류 무시
```typescript
// @ts-ignore - 다음 줄만 무시
// @ts-nocheck - 파일 전체 무시
```

---

## 문제 해결 체크리스트

- [ ] Node.js 버전 확인 (`node -v`)
- [ ] npm 패키지 최신화 (`npm update`)
- [ ] 캐시 삭제 (`rm -rf .next`)
- [ ] 포트 충돌 확인 (`lsof -i :3000`)
- [ ] 환경 변수 설정 확인
- [ ] 브라우저 캐시 삭제
- [ ] 방화벽 설정 확인

---

## 도움이 필요한 경우

1. [Next.js 공식 문서](https://nextjs.org/docs)
2. [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
3. [Vercel 배포 가이드](https://vercel.com/docs)
4. GitHub Issues: [프로젝트 이슈 페이지]