# **AIMAX 작동 순서 & 개발 프롬프트**

## **전체 플로우 요약**

사용자 구글 로그인 → 대시보드 진입 → “마케팅 자동화” 카드 → 구글 시트 링크로 새 프로젝트 생성(컬럼 매핑 저장) → 기준치/메일 템플릿 저장 → 자동화 시작 → A(서버)가 수집 잡 큐 생성 → B(로컬 워커)가 잡 pull → 각 URL 크롤링(인스타/스레드/네이버 블로그) → 팔로워/이웃수 정규화 → 결과 콜백 → A가 기준치 비교 → 선정자 즉시 메일 발송, 미선정은 수동 발송 또는 스케줄 발송 → 실패는 지수 백오프 3회 → 검수대기 → 운영자 수동 처리.

## **단계별 개발 순서(프론트부터 붙이기)**

### **단계 1: 인증 & 기본 레이아웃**

목표: 구글 로그인(OAuth)으로 진입, 베이스 레이아웃/네비/카드 UI.  
 요구:

* 구글 OAuth로 로그인(동의 범위: 기본 프로필, 이메일).

* 대시보드에 3개 카드 노출: 마케팅 자동화, 모집 글쓰기 자동화, 상세페이지 자동화(비활성 표기).

* 컬러 토큰 적용(배경 \#f2f1ef, 글자 \#131313, 포인트 \#ff3d00).

AI 프롬프트:  
 “Next.js(또는 Remix) \+ TypeScript \+ React로 구글 OAuth 로그인과 기본 대시보드 레이아웃을 구현해줘. 레이아웃은 상단 AppBar, 좌측 미니 사이드, 본문 카드 3개. 색상은 CSS 변수로 \--bg:\#f2f1ef, \--fg:\#131313, \--accent:\#ff3d00. 로그인 성공 시 /dashboard로 리다이렉트.”

수용 기준:

* 로그인/로그아웃 동작.

* 반응형 카드 3개, 라이트 테마 고정.

* 접근성: 대비 4.5:1 이상.

### **단계 2: 프로젝트 생성(시트 연결 & 컬럼 매핑)**

목표: “마케팅 자동화” 상세 페이지에서 시트 링크로 프로젝트 생성.  
 요구:

* 구글 시트 링크 입력 → “새 프로젝트+” → 시트 헤더 읽어오고 매핑 마법사 표시.

* 기본 매핑(프로젝트 저장용):

  * timestamp ↔ 타임스탬프

  * name ↔ 성함

  * phone ↔ 연락처

  * email ↔ 메일주소

  * source ↔ 어디에서 신청주셨나요?

  * url\_threads ↔ 후기 작성할 스레드 URL

  * url\_instagram ↔ 후기 작성할 인스타그램 URL

  * url\_blog ↔ 후기 작성할 블로그 URL

  * video\_agree ↔ 영상 촬영은 필수입니다. 가능하시죠?

  * privacy\_consent ↔ 개인정보 활용 동의

AI 프롬프트:  
 “구글 시트 링크를 받아 서버로 보내면 시트 헤더를 읽어오는 API를 만들고, 프론트에서 드래그-드롭 매핑 UI를 제공해. 위의 기본 매핑을 자동 제안하고, 저장 버튼을 누르면 project \+ mapping이 DB에 저장되게 해줘.”

수용 기준:

* 잘못된 링크 처리, 중복 프로젝트 방지.

* 매핑 저장 후 프로젝트 카드 생성(프로젝트명=시트 제목).

### **단계 3: 규칙/템플릿 설정 & 집계 UI**

목표: 기준치/메일 템플릿 저장, 상단에 집계 숫자 및 액션 버튼.  
 요구:

* 기준치 기본값: blog≥300, instagram≥1000, threads≥500 (채널별 override 가능).

* 선정자 메일/미선정자 메일 템플릿 저장 및 미리보기.

* 상단 집계: 총 신청/선정/미선정/검수대기/실패.

* 액션: 자동화 시작/일시정지/삭제/미선정자 메일 발송.

AI 프롬프트:  
 “프로젝트 상세 화면에 기준치 폼과 메일 템플릿 폼을 만들고, 저장/미리보기/테스트 발송 버튼을 구현해. 상단에 통계 배너와 액션 버튼을 배치해.”

수용 기준:

* 템플릿에 {{name}}, {{project}} 치환.

* 테스트 발송은 관리자 자기 메일로 송신.

### **단계 4: 큐 & 워커 통신(A↔B)**

목표: A가 잡 생성, B가 폴링으로 가져가 처리 후 콜백.  
 요구:

* 잡 JSON 스키마:  
   id, project\_id, channel\_type(instagram|threads|naver\_blog), url, rules({min\_followers}), priority, attempt, created\_at

* 결과 콜백: result, follower\_count(int), raw\_text, checked\_at, status(success|fail), fail\_reason

* 실패 3회 초과 시 status=pending\_review

AI 프롬프트:  
 “Redis(또는 DB) 기반 큐를 만들고, /jobs/pull(인증 필요)에서 B가 batch로 가져가게 해. /jobs/callback으로 결과 수신. 지수 백오프/attempt 증가/검수대기 전환 로직을 구현해.”

수용 기준:

* 동시성 제어, 중복 처리 방지.

* 콜백 인증(JWT) 필수.

### **단계 5: SNS 파서(v1)**

목표: 텍스트 앵커 기반 크롤링으로 카운트 추출.  
 요구:

* 인스타: “팔로워” 텍스트 근처 숫자(span/title) 파싱, “만/천/콤마/공백” 정규화.

* 스레드: “팔로워 …명” 패턴 파싱. v2에서 API 라우팅 공간 남김.

* 네이버 블로그: iframe(main frame) 전환 후 \#widget-stat \> div \> ul \> li:nth-child(1) 텍스트 정수화.

AI 프롬프트(B용):  
 “Tauri+Playwright로 로컬 앱 생성. /jobs/pull에서 잡 가져와 각 URL을 헤드리스로 열고, 텍스트 앵커 기반으로 팔로워/이웃수를 파싱해 /jobs/callback으로 돌려줘. 로그인 세션은 OS 보안 저장소에. 동시성 3, 사이트별 쿨다운. 캡차/리디렉션/로그인만료 탐지 시 fail\_reason 구분.”

수용 기준:

* URL 1건당 성공/실패 로그 남김.

* 숫자 정규화 유틸 공통 사용.

### **단계 6: 선정/발송/검수**

목표: 기준치 비교→선정자 즉시 발송, 미선정 수동/스케줄, 검수대기 처리.  
 요구:

* 선정/미선정 상태 Upsert.

* Gmail API로 발송(발신자=로그인 계정).

* 검수대기 테이블: 사유/원클릭 재시도/수동 통과/탈락.

AI 프롬프트:  
 “콜백 수신 후 기준 비교→상태 업데이트→선정자는 즉시 발송. 미선정은 버튼으로 일괄 발송 또는 예약 발송. 검수대기 그리드에 필터/검색/일괄 처리 제공.”

수용 기준:

* 발송 실패 재시도 큐, 지수 백오프.

* 로그/감사 트레일 유지.

---

# **2\) PRD (Product Requirements Document)**

## **목적**

체험단 모집의 선별 작업을 자동화해 운영 시간을 절감하고, 일관된 기준으로 선정/발송을 수행한다. 클라우드 우선(플랜 A), 장애/차단 시 로컬 하청 워커(플랜 B)로 우회.

## **대상 사용자**

* 운영자: 프로젝트 생성, 기준 설정, 메일 템플릿 관리, 검수/재시도.

* 신청자: 구글폼 제출자(외부 사용자).

## **핵심 기능**

* 구글 로그인 및 대시보드.

* 구글 시트 연결 및 컬럼 매핑 저장.

* 채널별 기준치 설정(기본값: B300/I1000/T500).

* 선정자 즉시 메일, 미선정자 수동/예약 발송.

* SNS 카운트 자동 수집: B(로컬) 워커가 잡 처리.

* 실패 3회 시 검수대기, 운영자 일괄 처리.

* 프로젝트별 통계, 로그, 재시도.

## **비기능 요구**

* 가용성: 코어 A 가용성 99.5%/월.

* 성능: 1,000명 프로젝트 기준 10분 내 80% 처리(로컬 워커 수에 비례).

* 보안: OAuth2, JWT, HTTPS. 민감정보 최소화, PII 암호화(휴지통/백업 포함).

* 감사: 모든 상태변경/발송 로그 저장.

## **성공 지표**

* 운영자 처리 시간 70% 이상 절감.

* 자동 선정/발송 성공률 90% 이상.

* 검수대기 비율 20% 이하(초기), 10% 이하(튜닝 후).

## **제약/리스크**

* 인스타/스레드 DOM 변동, 봇탐지.

* 로컬 PC 오프라인 시 처리 지연.

* 메일 발송 한도(Gmail) 제한.

---

# **3\) TRD (Tech Requirements / 설계서)**

## **아키텍처**

* 프론트: Next.js(또는 Remix) \+ React \+ TS.

* 백엔드: Node.js(Express/Fastify) \+ TS.

* DB: PostgreSQL. 캐시/큐: Redis.

* 인증: Google OAuth → JWT 세션.

* 메일: Gmail API(사용자 로그인 계정 발신).

* 파일/비밀: GCP Secret Manager 또는 Vault.

* 로컬 워커(B): Tauri \+ Playwright(Chromium/Firefox), 폴링 기반 잡 처리.

## **데이터 모델(요약)**

* projects(id, name, sheet\_url, mapping\_json, rules\_json, created\_by, created\_at)

* applicants(id, project\_id, name, email, phone, source, url\_instagram, url\_threads, url\_blog, status(enum: pending|selected|rejected|review), follower\_count, channel\_type, checked\_at, attempts, last\_error, notes, created\_at)

* jobs(id, project\_id, applicant\_id, channel\_type, url, rules\_json, attempt, status, created\_at)

* emails(id, project\_id, applicant\_id, type: selected|rejected, subject, body, sent\_at, status, error)

* logs(id, project\_id, scope, level, message, meta(json), created\_at)

## **API(핵심)**

* POST /auth/google/callback

* POST /projects {sheet\_url} → {project\_id, name, sheet\_title}

* GET /projects/:id → 통계/설정/리스트

* POST /projects/:id/mapping

* POST /projects/:id/rules

* POST /projects/:id/templates {selected, rejected}

* POST /projects/:id/automation/start | /pause | /delete

* POST /jobs/pull ← B가 batch pull (JWT, host fingerprint)

* POST /jobs/callback → 결과 수신

* POST /emails/test, POST /emails/reject/bulk

* GET /review?page=…\&filters=… , POST /review/:id/{retry|approve|reject}

## **큐/리트라이**

* attempt≤3, 지수 백오프(1m, 5m, 15m).

* fail\_reason 코드: CAPTCHA, LOGIN\_REQUIRED, DOM\_CHANGED, TIMEOUT, UNKNOWN.

* attempt\>3 → review 대기.

## **파서 전략**

* 공통: 텍스트 앵커(“팔로워”, “이웃”) 기준 근접 숫자 파싱.

* 숫자 정규화: “2.0만”, “20,544”, “9748” → int.

* 네이버 블로그: main iframe 전환 → \#widget-stat li:nth-child(1).

* 인스타/스레드: 로그인 세션 재사용, 리디렉션/캡차 감지.

## **보안**

* B 등록: 디바이스 바운딩(머신 ID \+ 사용자 계정), JWT 단기 토큰.

* 콜백 서명 검증(HMAC).

* PII 최소 저장, 휴면/삭제 정책.

## **배포**

* A: GCP(GAE/Cloud Run) \+ managed Postgres \+ Redis.

* B: Tauri 자동 업데이트, Win notarized MSIX/MSI, macOS hardened DMG.

---

# **4\) 디자인 설계**

## **컬러 토큰**

* \--bg: \#f2f1ef

* \--fg: \#131313

* \--accent: \#ff3d00

* 상태색(추천): \--ok:\#1f8a50, \--warn:\#b36b00, \--err:\#c62828, \--muted:\#8a8a8a

## **타이포/레이아웃**

* 기본 폰트: 시스템 UI. 본문 15–16px, 라인하이트 1.5.

* 카드: radius 16px, 그림자 약하게, 내부 패딩 20–24px.

* 버튼: 라운드 12px, 기본 높이 40–44px, 포인트 버튼 배경 \--accent, 텍스트 \--bg.

* 입력폼: 레이블 상단, 도움말 텍스트 회색(--muted).

* 대비: 텍스트 대비 4.5:1 유지.

## **컴포넌트 스케치**

* 헤더(AppBar): 좌측 로고, 우측 프로필 메뉴.

* 대시보드 카드: 제목/설명/진행도 또는 “개발중” 배지.

* 프로젝트 상세 상단: 집계 배너(총 신청/선정/미선정/검수대기/실패), 액션 버튼 그룹.

* 설정 섹션: 탭 3개(매핑/기준/메일 템플릿).

* 리스트: 신청자 테이블(검색/필터/일괄 선택), 상태 칩(selected/rejected/review).

* 검수대기 모달/페이지: 사유, 원클릭 재시도/수동통과/탈락.

## **상호작용**

* 위험 액션은 2단계 확인.

* 저장 시 토스트, 실패 시 인라인 에러.

* 로딩 스켈레톤 제공.

---

# **5\) IA (Information Architecture)**

* /

  * /login

  * /dashboard

    * /automation/marketing

      * /projects/:id

        * /settings

          * /mapping

          * /rules

          * /templates

        * /overview (집계/그래프)

        * /applicants (리스트/검색/필터)

        * /review (검수대기 큐)

* /admin (옵션: 시스템 로그)

데이터 IA

* Projects → Applicants → Jobs/Emails/Logs

* Settings 묶음: Mapping, Rules, Templates

---

# **6\) 사용자 여정**

## **운영자**

발견 → 구글 로그인 → 대시보드 진입 → 마케팅 자동화 → 시트 링크로 새 프로젝트 생성 → 컬럼 매핑 저장 → 기준/템플릿 설정 → 자동화 시작 → 집계 모니터링 → 일부 실패/검수대기 확인 → 일괄 처리 → 미선정자 발송 → 보고/내보내기.

장애 지점 & 완충

* 시트 헤더 불일치 → 매핑 마법사.

* SNS 차단/로그인 만료 → B 재시도 3회 → 검수대기 → 일괄 처리.

* 메일 한도 → 예약 발송/배치 간격.

## **신청자**

모집글 확인 → 구글폼 제출 → 접수 완료 → 기준 충족 시 즉시 “선정” 메일 수신 → 신청 링크로 활동 시작. 미선정 시 나중에 “감사/할인” 메일 수신.

