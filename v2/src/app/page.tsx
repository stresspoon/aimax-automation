"use client"

import Link from "next/link"
import { AnimatedSection } from "@/components/animated-section"
import { HeroBackground } from "@/components/hero-background" 
import { AutomationSteps } from "@/components/automation-steps"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b shadow-sm">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">AIMAX</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link className="text-muted-foreground hover:text-foreground transition" href="#features">
                기능
              </Link>
              <Link className="text-muted-foreground hover:text-foreground transition" href="#pricing">
                가격
              </Link>
              <Link className="text-muted-foreground hover:text-foreground transition" href="#testimonials">
                후기
              </Link>
              <Link
                className="gradient-primary text-primary-foreground px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 font-semibold shadow-sm"
                href="/signup"
              >
                무료 체험
              </Link>
            </nav>
            <button className="md:hidden text-foreground">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Gradient Background */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <HeroBackground />
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 text-center">
          <AnimatedSection className="max-w-[700px] mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              비용 <span className="text-primary">ZERO</span>, 
              성과 <span className="text-primary">MAX</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              인건비 없이도, 한 명이 팀처럼 일하는 마케팅 자동화 솔루션
            </p>
            
            {/* Automation Steps with Animations */}
            <div className="mb-12">
              <AutomationSteps activeStep={activeStep} />
            </div>

            {/* Stats */}
            <div className="flex justify-center space-x-12 mb-12">
              <AnimatedSection delay={0.3} className="text-center">
                <div className="text-3xl font-bold text-primary">↓ 70%</div>
                <div className="text-sm text-muted-foreground">고정비</div>
              </AnimatedSection>
              <AnimatedSection delay={0.4} className="text-center">
                <div className="text-3xl font-bold text-primary">↑ 300%</div>
                <div className="text-sm text-muted-foreground">업무 속도</div>
              </AnimatedSection>
              <AnimatedSection delay={0.5} className="text-center">
                <div className="text-3xl font-bold text-primary">↑ 200%</div>
                <div className="text-sm text-muted-foreground">매출</div>
              </AnimatedSection>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                className="gradient-primary hover:shadow-xl text-primary-foreground px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg"
                href="/signup"
              >
                무료 체험 시작하기
              </Link>
              <button className="bg-transparent border-2 border-primary/20 hover:border-primary hover:bg-primary/5 text-foreground px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300">
                데모 보기
              </button>
            </div>
          </AnimatedSection>

          {/* Dashboard Preview */}
          <AnimatedSection delay={0.6} className="relative w-full md:w-[1160px] mx-auto">
            <div className="bg-primary/5 rounded-2xl p-2 shadow-2xl">
              <div className="bg-card rounded-xl shadow-lg p-8">
                <div className="aspect-[16/10] gradient-secondary rounded-lg flex items-center justify-center gradient-animation">
                  <span className="text-muted-foreground text-xl">Dashboard Preview</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Social Proof */}
      <AnimatedSection className="py-20 px-6 mt-[100px]" delay={0.1}>
        <div className="max-w-[1320px] mx-auto text-center">
          <p className="text-lg text-muted-foreground mb-8">이미 수많은 기업이 AIMAX로 성장하고 있습니다</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="text-muted-foreground font-semibold opacity-50 hover:opacity-100 transition-opacity">
                Company {i + 1}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Problem Section */}
      <AnimatedSection className="py-20 px-6 bg-gradient-to-br from-secondary/50 via-background to-accent/30" delay={0.15}>
        <div className="max-w-[1320px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            당신의 마케팅, 아직도 사람 손에만 맡기고 있나요?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "고정비 부담",
                description: "인건비, 마케팅 대행료, 운영비 부담",
                current: "월 인건비 300만원+",
                solution: "월 비용 90만원"
              },
              {
                title: "AI 활용 장벽",
                description: "체계적인 프로세스 부재",
                current: "광고 수동 운영",
                solution: "광고 완전 자동화"
              },
              {
                title: "성장 한계",
                description: "인력 확충 없이는 매출 정체",
                current: "콘텐츠 외주 의존",
                solution: "콘텐츠 AI 자동 생성"
              }
            ].map((item, index) => (
              <AnimatedSection
                key={index}
                delay={0.2 + index * 0.1}
                className="bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                style={{ outline: "1px solid hsl(var(--border))", outlineOffset: "-1px" }}
              >
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">현재:</span>
                    <span className="text-sm line-through text-muted-foreground">{item.current}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-primary font-semibold">AIMAX:</span>
                    <span className="text-sm font-bold text-primary">{item.solution}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section - Bento Grid Style */}
      <AnimatedSection id="features" className="py-20 px-6" delay={0.2}>
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">비즈니스 수익화를 위한 3가지 핵심 조건</h2>
            <p className="text-xl text-muted-foreground">
              AIMAX가 모두 제공합니다. 한 명이 팀처럼 일하는 마케팅 자동화의 모든 것
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "트래픽", 
                subtitle: "방문자 유입 자동화", 
                description: "광고·콘텐츠 생성",
                gradient: "from-primary/10 to-primary/5"
              },
              { 
                title: "전환", 
                subtitle: "퍼널 최적화", 
                description: "타겟 맞춤 메시지",
                gradient: "from-secondary/10 to-secondary/5"
              },
              { 
                title: "고객 관리", 
                subtitle: "문의 응대 자동화", 
                description: "재구매 유도, CRM 자동화",
                gradient: "from-accent/10 to-accent/5"
              }
            ].map((feature, index) => (
              <AnimatedSection
                key={index}
                delay={0.25 + index * 0.1}
                className={cn(
                  "bg-gradient-to-br rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300",
                  feature.gradient
                )}
                style={{ outline: "1px solid hsl(var(--border))", outlineOffset: "-1px" }}
              >
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-lg text-muted-foreground mb-2">{feature.subtitle}</p>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Use Cases */}
      <AnimatedSection className="py-20 px-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5" delay={0.25}>
        <div className="max-w-[1320px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">AIMAX, 이렇게 사용하세요</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "쇼핑몰 마케팅 자동화",
                before: "주 40시간",
                after: "주 5시간",
                improvement: "효율성 800% 향상"
              },
              {
                title: "서비스 예약 고객 확보",
                before: "예약률 2.3%",
                after: "예약률 7.8%",
                improvement: "339% 증가"
              },
              {
                title: "콘텐츠·광고 제작 자동화",
                before: "제작시간 4시간",
                after: "제작시간 15분",
                improvement: "1600% 단축"
              }
            ].map((useCase, index) => (
              <AnimatedSection
                key={index}
                delay={0.3 + index * 0.1}
                className="bg-card rounded-xl p-6 shadow-sm hover:scale-105 hover:shadow-xl transition-all duration-300"
                style={{ outline: "1px solid hsl(var(--border))", outlineOffset: "-1px" }}
              >
                <h3 className="text-xl font-bold mb-4">{useCase.title}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground line-through">{useCase.before}</span>
                    <span className="text-2xl text-primary">→</span>
                    <span className="text-primary font-bold">{useCase.after}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <span className="text-lg font-bold text-primary">{useCase.improvement}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Large Testimonial */}
      <AnimatedSection id="testimonials" className="py-20 px-6" delay={0.2}>
        <div className="max-w-[1320px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">고객 후기</h2>
          
          {/* Large Testimonial */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 mb-8" 
               style={{ outline: "2px solid hsl(var(--primary) / 0.2)", outlineOffset: "-1px" }}>
            <p className="text-2xl font-medium mb-4">
              "AIMAX 덕분에 마케팅 비용은 절반, 매출은 두 배. 혁신적인 솔루션입니다."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 gradient-primary rounded-full mr-4"></div>
              <div>
                <p className="font-bold">김대표</p>
                <p className="text-muted-foreground">글로벌 이커머스 CEO</p>
              </div>
            </div>
          </div>

          {/* Small Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "혼자서도 팀처럼 일할 수 있게 되었습니다.", name: "이마케터", role: "스타트업 대표" },
              { quote: "자동화로 시간을 80% 절약했어요.", name: "박매니저", role: "마케팅 팀장" },
              { quote: "투자 대비 효과가 놀랍습니다.", name: "최대표", role: "온라인 쇼핑몰 운영" }
            ].map((testimonial, index) => (
              <AnimatedSection key={index} delay={0.25 + index * 0.1} 
                className="bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                style={{ outline: "1px solid hsl(var(--border))", outlineOffset: "-1px" }}>
                <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-secondary rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing Section */}
      <AnimatedSection id="pricing" className="py-20 px-6 bg-gradient-to-br from-secondary/30 via-background to-accent/20" delay={0.2}>
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              직원 한 달 급여로, 1년간 팀을 소유하세요
            </h2>
            <div className="inline-flex bg-card rounded-full p-1 mt-6 shadow-sm">
              <button 
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-6 py-2 rounded-full transition-all duration-300 font-semibold",
                  billingCycle === "monthly" 
                    ? "gradient-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground"
                )}
              >
                월간
              </button>
              <button 
                onClick={() => setBillingCycle("yearly")}
                className={cn(
                  "px-6 py-2 rounded-full transition-all duration-300 font-semibold",
                  billingCycle === "yearly" 
                    ? "gradient-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground"
                )}
              >
                연간 (20% 할인)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <AnimatedSection delay={0.25} className="rounded-xl p-8 bg-card"
              style={{ 
                outline: "1px solid hsl(var(--border))", 
                outlineOffset: "-1px",
                boxShadow: "0px 4px 8px -2px rgba(0,0,0,0.10)"
              }}>
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-sm mb-4 text-muted-foreground">소규모 비즈니스 시작용</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₩0</span>
                <span className="text-sm text-muted-foreground">/연</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["기본 자동화 기능", "월 100건 콘텐츠 생성", "이메일 지원", "기본 템플릿"].map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-full font-semibold transition-all duration-300 gradient-primary text-primary-foreground hover:shadow-lg shadow-sm">
                무료로 시작하기
              </button>
            </AnimatedSection>

            {/* Growth Plan - Popular */}
            <AnimatedSection delay={0.3} className="rounded-xl p-8 gradient-primary text-primary-foreground scale-105 relative shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-card text-primary px-3 py-1 rounded-full text-sm font-bold">인기</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Growth</h3>
              <p className="text-sm mb-4 opacity-90">성장하는 비즈니스를 위한</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₩79,000</span>
                <span className="text-sm opacity-80">/연</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["모든 자동화 기능", "무제한 콘텐츠 생성", "우선 지원", "프리미엄 템플릿", "API 접근"].map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm opacity-90">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-full font-semibold transition-all duration-300 bg-primary-foreground text-primary hover:opacity-90 shadow-sm">
                Growth 시작하기
              </button>
            </AnimatedSection>

            {/* Pro Plan */}
            <AnimatedSection delay={0.35} className="rounded-xl p-8 bg-card"
              style={{ 
                outline: "1px solid hsl(var(--border))", 
                outlineOffset: "-1px",
                boxShadow: "0px 4px 8px -2px rgba(0,0,0,0.10)"
              }}>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-sm mb-4 text-muted-foreground">대규모 팀·기업용</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₩239,000</span>
                <span className="text-sm text-muted-foreground">/연</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["엔터프라이즈 기능", "전담 매니저", "커스텀 개발", "SLA 보장", "무제한 사용자"].map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-full font-semibold transition-all duration-300 gradient-primary text-primary-foreground hover:shadow-lg shadow-sm">
                영업팀 문의
              </button>
            </AnimatedSection>
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection className="py-20 px-6" delay={0.2}>
        <div className="max-w-[600px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                question: "AIMAX는 무엇인가요?",
                answer: "AIMAX는 AI 기반 마케팅 자동화 솔루션으로, 콘텐츠 생성부터 고객 관리까지 모든 마케팅 업무를 자동화합니다."
              },
              {
                question: "정말 한 명이 팀처럼 일할 수 있나요?",
                answer: "네, AIMAX의 자동화 기능을 활용하면 한 명이 여러 명의 업무를 효율적으로 처리할 수 있습니다."
              },
              {
                question: "기존 툴과 연동이 가능한가요?",
                answer: "네, 주요 마케팅 툴과 API 연동을 지원하며, 웹훅을 통한 커스텀 연동도 가능합니다."
              },
              {
                question: "무료 플랜으로 무엇을 할 수 있나요?",
                answer: "기본 자동화 기능과 월 100건의 콘텐츠 생성이 가능하며, 유료 기능도 일부 체험할 수 있습니다."
              },
              {
                question: "AI는 어떻게 학습하고 성장하나요?",
                answer: "사용자의 피드백과 성과 데이터를 기반으로 지속적으로 학습하며, 업계별 베스트 프랙티스를 반영합니다."
              },
              {
                question: "데이터 보안은 어떻게 보장하나요?",
                answer: "엔터프라이즈급 보안 시스템을 적용하며, ISMS-P 인증을 준비 중입니다."
              }
            ].map((faq, index) => (
              <AnimatedSection key={index} delay={0.1 + index * 0.05}>
                <details className="bg-card rounded-xl p-6 group shadow-sm hover:shadow-md transition-shadow"
                  style={{ outline: "1px solid hsl(var(--border))", outlineOffset: "-1px" }}>
                  <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-primary group-open:rotate-180 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">{faq.answer}</p>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20 px-6 gradient-primary text-primary-foreground" delay={0.2}>
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            더 이상 고용하지 마세요. 24시간 일하는 자동화 솔루션.
          </h2>
          <p className="text-xl mb-8 opacity-90">
            AIMAX로 인건비 부담 없이 매출 성장을 경험하세요
          </p>
          <Link
            className="inline-block bg-primary-foreground text-primary hover:opacity-90 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg"
            href="/signup"
          >
            무료 체험 시작하기
          </Link>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">AIMAX</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link className="hover:text-foreground transition" href="#">소개</Link></li>
                <li><Link className="hover:text-foreground transition" href="#">기능</Link></li>
                <li><Link className="hover:text-foreground transition" href="#">가격</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">통합·자동화</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link className="hover:text-foreground transition" href="#">시스템</Link></li>
                <li><Link className="hover:text-foreground transition" href="#">AI 마케팅</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">회사 정보</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link className="hover:text-foreground transition" href="#">소개</Link></li>
                <li><Link className="hover:text-foreground transition" href="#">팀</Link></li>
                <li><Link className="hover:text-foreground transition" href="#">채용</Link></li>
                <li><Link className="hover:text-foreground transition" href="#">브랜드</Link></li>
                <li><Link className="hover:text-foreground transition" href="#">연락처</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">리소스</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link className="hover:text-foreground transition" href="#">이용약관</Link></li>
                <li><Link className="hover:text-foreground transition" href="#">API 문서</Link></li>
                <li><Link className="hover:text-foreground transition" href="#">가이드</Link></li>
                <li><Link className="hover:text-foreground transition" href="#">커뮤니티</Link></li>
                <li><Link className="hover:text-foreground transition" href="#">지원</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 AIMAX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}