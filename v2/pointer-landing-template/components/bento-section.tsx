import AiCodeReviews from "./bento/ai-code-reviews"
import RealtimeCodingPreviews from "./bento/real-time-previews"
import OneClickIntegrationsIllustration from "./bento/one-click-integrations-illustration"
import MCPConnectivityIllustration from "./bento/mcp-connectivity-illustration"
import EasyDeployment from "./bento/easy-deployment"
import ParallelCodingAgents from "./bento/parallel-agents"

const BentoCard = ({ title, description, Component }) => (
  <div className="overflow-hidden rounded-2xl border border-foreground/10 flex flex-col justify-start items-start relative">
    {/* Background with blur effect */}
    <div
      className="absolute inset-0 rounded-2xl"
      style={{
        background: "rgba(19, 19, 19, 0.03)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    />
    {/* Additional subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl" />

    <div className="self-stretch p-6 flex flex-col justify-start items-start gap-2 relative z-10">
      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
        <p className="self-stretch text-foreground text-lg font-normal leading-7">
          {title} <br />
          <span className="text-muted-foreground">{description}</span>
        </p>
      </div>
    </div>
    <div className="self-stretch h-72 relative -mt-0.5 z-10">
      <Component />
    </div>
  </div>
)

export function BentoSection() {
  const cards = [
    {
      title: "고정비는 낮게, 매출은 높게",
      description: "인건비를 줄입니다. 한 명이 팀처럼 일하는 환경을 만듭니다.",
      Component: AiCodeReviews,
    },
    {
      title: "팔리는 프로세스 제공",
      description: "AI를 알아도 쓰지 못하는 이유? 프로세스가 없기 때문입니다.",
      Component: RealtimeCodingPreviews,
    },
    {
      title: "스스로 성장하는 시스템",
      description: "데이터를 기반으로 스스로 학습하고 성장하는 마케팅 AI",
      Component: OneClickIntegrationsIllustration,
    },
    {
      title: "광고 자동화",
      description: "키워드 분석부터 광고 집행까지 완전 자동화된 시스템",
      Component: MCPConnectivityIllustration,
    },
    {
      title: "콘텐츠 자동 생성",
      description: "브랜드에 맞는 콘텐츠를 AI가 자동으로 생성하고 배포",
      Component: ParallelCodingAgents,
    },
    {
      title: "고객 관리 자동화",
      description: "문의부터 상담까지 AI가 24시간 고객을 관리합니다",
      Component: EasyDeployment,
    },
  ]

  return (
    <section className="w-full px-5 flex flex-col justify-center items-center overflow-visible bg-transparent">
      <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
        <div className="w-[547px] h-[938px] absolute top-[614px] left-[80px] origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[130px] z-0" />
        <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
          <div className="flex flex-col justify-start items-center gap-4">
            <h2 className="w-full max-w-[655px] text-center text-foreground text-4xl md:text-6xl font-semibold leading-tight md:leading-[66px]">
              비즈니스 수익화를 위한 3가지 핵심 조건
            </h2>
            <p className="w-full max-w-[600px] text-center text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              AIMAX가 모두 제공합니다. 한 명이 팀처럼 일하는 마케팅 자동화의 모든 것
            </p>
          </div>
        </div>
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
          {cards.map((card) => (
            <BentoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
