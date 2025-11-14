const mockItems = [
  {
    id: "1",
    title: "부천역 B1 스트리트몰 인한 소음 및 환경 문제 해결방안",
    summary:
      "부천역 주변에서 발생하는 비정상적 소음/환경 이슈에 대한 해결책을 함께 논의합니다.",
    category: ["환경", "안전", "경제"],
    region: "부천시",
    status: "토론중",
    tags: ["참여중", "청소년", "주민참여"],
    participants: 1243,
    comments: 59,
    date: "2025-10-06",
  },
  {
    id: "2",
    title: "수원시 이동형 야간 주차난 해결 방안",
    summary:
      "야간 주차 공간 부족 문제를 개선하기 위한 구역별 시범 운영 정책을 설계합니다.",
    category: ["교통", "경제"],
    region: "수원시",
    status: "토론중",
    tags: ["주민제안채택중"],
    participants: 678,
    comments: 54,
    date: "2025-10-15",
  },
  {
    id: "3",
    title: "성남시 분당구 어린이 놀이터 안전 개선",
    summary:
      "노후화된 놀이터 시설의 안전 점검 및 개선이 필요한 구역을 지정하고 개선안을 작성합니다.",
    category: ["안전", "교통"],
    region: "성남시",
    status: "토론중",
    tags: ["청소년"],
    participants: 899,
    comments: 56,
    date: "2025-10-04",
  },
  {
    id: "4",
    title: "안양시 민원 문화개선 및 질서 회복 프로젝트",
    summary:
      "민원 처리의 공정성/투명성 강화를 위한 행정 절차 개선과 질서 회복 캠페인을 논의합니다.",
    category: ["안전", "문화"],
    region: "안양시",
    status: "토론중",
    participants: 1569,
    comments: 102,
    date: "2025-10-03",
  },
  {
    id: "5",
    title: "용인시 잔돈 순환 돌봄 서비스 확대",
    summary:
      "소액 잔돈을 지역 돌봄 서비스로 순환시키는 모델을 설계하고 참여 인센티브를 논의합니다.",
    category: ["복지", "경제"],
    region: "용인시",
    status: "제안채택/종결",
    participants: 788,
    comments: 34,
    date: "2025-10-02",
  },
  {
    id: "6",
    title: "광명시 전통시장 활성화 및 청년 창업 지원",
    summary:
      "전통시장 상생 및 청년 창업 육성을 위한 상권 데이터 기반 지원책을 설계합니다.",
    category: ["경제", "문화"],
    region: "광명시",
    status: "토론중",
    participants: 2039,
    comments: 81,
    date: "2025-10-01",
  },
] as const;

export default mockItems;
