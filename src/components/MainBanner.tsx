import { ArrowRight, Users, Lightbulb, FileText } from 'lucide-react'
import { Button, Title, Body } from '@krds-ui/core'

export function MainBanner() {
  return (
    // 배경: 단색(연파랑)
    <section className="bg-indigo-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        {/* 스크린리더 고려해서 h1과 h2를 Title로 바꾸면 <p>나 <span>으로 읽혀 페이지 제목으로 읽지 못 할 수도 있음 */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900">
            시민이 직접 해결책을 제안하는
          </h1>
          <h2 className="mb-6 text-4xl font-extrabold text-blue-600">
            경기 파트너스
          </h2>

          <Body size="m" color="gray-60" className="mx-auto mb-8 max-w-3xl">
            단순한 문제 제기를 넘어, 시민과 지자체가 함께 솔루션을 만들어가는
            새로운 시민참여 플랫폼입니다.
          </Body>

          {/* 버튼*/}
          <div className="flex justify-center gap-4">
            <Button
              variant="primary"
              size="large"
              className="[&>label]:flex [&>label]:items-center [&>label]:gap-2 whitespace-nowrap"
            >
              <span className="leading-none">솔루션 토의실 참여하기</span>
              {/* 모바일에서는 숨기고, 태블릿 이상부터 아이콘 표시 */}
              <ArrowRight className="w-4 h-4 shrink-0 mobile:hidden tablet:inline-block" />
            </Button>

            {/* 하얀 배경+파란 테두리 느낌 */}
            <Button
              variant="secondary"
              size="large"
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              플랫폼 가이드 보기
            </Button>
          </div>
        </header>

        {/* Process cards */}
        {/* 모바일일 때(360px~600px): 밑으로 정렬, 테블릿, 데스크탑일 때(601px~): 옆으로 정렬 */}
        <div className="grid gap-8 mt-16 mobile:grid-cols-1 tablet:grid-cols-3">
          <div className="bg-white flex flex-col gap-6 rounded-xl border p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <Title size="m">1. 의견 모으기</Title>
            <Body size="s" color="gray-60">
              같은 문제를 겪고 있는 시민들이 모여 경험과 자료를 공유하며 집단
              지성으로 문제의 본질을 파악합니다.
            </Body>
          </div>

          <div className="bg-white flex flex-col gap-6 rounded-xl border p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-green-600" />
            </div>
            <Title size="m">2. 솔루션 제안서 작성</Title>
            <Body size="s" color="gray-60">
              논의를 통해 구체적인 해결책을 담은 솔루션 제안서를 참여자 전원의
              검토와 동의를 거쳐 완성합니다.
            </Body>
          </div>

          <div className="bg-white flex flex-col gap-6 rounded-xl border p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <Title size="m">3. 원클릭 제출</Title>
            <Body size="s" color="gray-60">
              완성된 제안서를 클릭 한 번으로 정부 공식 민원 사이트에 바로 제출할
              수 있습니다.
            </Body>
          </div>
        </div>

        {/* 하단 지표: 색상을 적용하는 것이 맞을까? krds의 색깔의 의미가 와해되진 않는가? */}
        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-gray-200 pt-8 tablet:grid-cols-4">
          <div className="text-center">
            <Title size="m" color="primary-20">
              247
            </Title>
            <Body size="s" color="gray-60">
              활성 토의실
            </Body>
          </div>
          <div className="text-center">
            <Title size="m" color="success-50">
              1,432
            </Title>
            <Body size="s" color="gray-60">
              참여 시민
            </Body>
          </div>
          <div className="text-center">
            <Title size="m" color="info-50">
              89
            </Title>
            <Body size="s" color="gray-60">
              제출된 제안서
            </Body>
          </div>
          <div className="text-center">
            <Title size="m" color="point">
              34
            </Title>
            <Body size="s" color="gray-60">
              해결된 문제
            </Body>
          </div>
        </div>
      </div>
    </section>
  )
}
