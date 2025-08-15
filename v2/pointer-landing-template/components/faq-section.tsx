"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqData = [
  {
    question: "AIMAX는 무엇이고, 누구를 위한 서비스인가요?",
    answer:
      "AIMAX는 AI 기반 마케팅 자동화 플랫폼으로, 인건비 부담 없이 마케팅 성과를 극대화하고 싶은 개인사업자부터 중소기업, 대기업까지 모든 비즈니스를 위한 솔루션입니다.",
  },
  {
    question: "정말로 한 명이 팀처럼 일할 수 있나요?",
    answer:
      "네, 가능합니다. AIMAX는 광고 제작, 콘텐츠 생성, 고객 관리, 데이터 분석 등 마케팅의 모든 영역을 자동화하여 한 명의 마케터가 기존 팀 단위의 업무를 처리할 수 있게 해줍니다.",
  },
  {
    question: "기존 마케팅 툴과 연동이 가능한가요?",
    answer:
      "물론입니다! 네이버 광고, 구글 애즈, 페이스북 광고, 카카오톡 채널, 인스타그램 등 주요 마케팅 플랫폼과 원클릭 연동이 가능하며, API를 통한 커스텀 연동도 지원합니다.",
  },
  {
    question: "무료 플랜에는 어떤 기능이 포함되나요?",
    answer:
      "Starter 플랜에는 기본 마케팅 자동화 템플릿 3개, 월 1,000건 자동 처리, 기본 분석 리포트, 이메일 지원이 포함됩니다. 개인사업자나 소규모 비즈니스 시작에 충분합니다.",
  },
  {
    question: "AI가 정말로 스스로 학습하고 성장하나요?",
    answer:
      "네, AIMAX는 머신러닝 기술을 통해 고객의 마케팅 데이터를 분석하고 패턴을 학습합니다. 시간이 지날수록 더 정확한 타겟팅과 더 효과적인 마케팅 전략을 제안하게 됩니다.",
  },
  {
    question: "데이터 보안은 어떻게 보장되나요?",
    answer:
      "AIMAX는 엔터프라이즈급 보안 시스템을 사용하여 고객 데이터를 보호합니다. 모든 데이터는 암호화되어 전송되고 저장되며, 국내 데이터센터에서 관리되어 개인정보보호법을 완벽히 준수합니다.",
  },
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggle()
  }
  return (
    <div
      className={`w-full bg-[rgba(231,236,235,0.08)] shadow-[0px_2px_4px_rgba(0,0,0,0.16)] overflow-hidden rounded-[10px] outline outline-1 outline-border outline-offset-[-1px] transition-all duration-500 ease-out cursor-pointer`}
      onClick={handleClick}
    >
      <div className="w-full px-5 py-[18px] pr-4 flex justify-between items-center gap-5 text-left transition-all duration-300 ease-out">
        <div className="flex-1 text-foreground text-base font-medium leading-6 break-words">{question}</div>
        <div className="flex justify-center items-center">
          <ChevronDown
            className={`w-6 h-6 text-muted-foreground-dark transition-all duration-500 ease-out ${isOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"}`}
          />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        style={{
          transitionProperty: "max-height, opacity, padding",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className={`px-5 transition-all duration-500 ease-out ${isOpen ? "pb-[18px] pt-2 translate-y-0" : "pb-0 pt-0 -translate-y-2"}`}
        >
          <div className="text-foreground/80 text-sm font-normal leading-6 break-words">{answer}</div>
        </div>
      </div>
    </div>
  )
}

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }
  return (
    <section className="w-full pt-[66px] pb-20 md:pb-40 px-5 relative flex flex-col justify-center items-center bg-background">
      <div className="w-[300px] h-[500px] absolute top-[150px] left-1/2 -translate-x-1/2 origin-top-left rotate-[-33.39deg] bg-muted/30 blur-[100px] z-0" />
      <div className="self-stretch pt-8 pb-8 md:pt-14 md:pb-14 flex flex-col justify-center items-center gap-2 relative z-10">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="w-full max-w-[435px] text-center text-foreground text-4xl font-semibold leading-10 break-words">
            자주 묻는 질문
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-[18.20px] break-words">
            AIMAX에 대해 궁금한 모든 것을 확인해보세요
          </p>
        </div>
      </div>
      <div className="w-full max-w-[600px] pt-0.5 pb-10 flex flex-col justify-start items-start gap-4 relative z-10">
        {faqData.map((faq, index) => (
          <FAQItem key={index} {...faq} isOpen={openItems.has(index)} onToggle={() => toggleItem(index)} />
        ))}
      </div>
    </section>
  )
}
