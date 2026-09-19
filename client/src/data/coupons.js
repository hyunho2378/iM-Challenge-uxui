// coupons.js — 쿠폰함 목업 데이터
//
// 근거(전사.md):
//  - S34 쿠폰함 화면: "다운로드가능/다운로드완료 탭 + 카테고리 칩(전체/음식점/유통쇼핑/의류잡화/뷰티생활 등)
//    + 지역 선택 + 정렬(거리순) + 매장별 쿠폰 카드 리스트(투다리 포항역점, 오복식당, 글로리아음악전문학원,
//    뮤주에스테틱, 푸름식품, 으뜸플러스안경 대구성서점 등)"
//  - S40 매장상세(으뜸플러스안경 대구성서점): "쿠폰(총2건) 3,000원/5,000원 할인"
//    → 할인금액 3,000원·5,000원은 이 원문에서 가져왔다.
//  - 배치3 S04 수야커피: "(생일쿠폰) 1,000원 할인 / 1인1매 제한"
//
// 상호는 위 캡처에 실제로 등장한 이름이고, 거리·유효기간은 데모용 배치값이다.

// S34 카테고리 칩 — 원문 "전체/음식점/유통쇼핑/의류잡화/뷰티생활 등"을 5개로 유지
export const COUPON_CATEGORIES = ['전체', '음식점', '유통쇼핑', '의류잡화', '뷰티생활']

export const COUPONS = [
  {
    id: 'c1',
    store: '오복식당',
    category: '음식점',
    amount: 3000,
    condition: '1인 1매 제한',
    period: '2026.09.01~2026.09.30',
    distanceKm: 0.3,
    downloaded: false,
  },
  {
    id: 'c2',
    store: '용길이네 국밥집 본점',
    category: '음식점',
    amount: 5000,
    condition: '2만원 이상 결제 시',
    period: '2026.09.01~2026.10.31',
    distanceKm: 0.4,
    downloaded: false,
  },
  {
    id: 'c3',
    store: '푸름식품',
    category: '유통쇼핑',
    amount: 3000,
    condition: '1인 1매 제한',
    period: '2026.09.01~2026.09.30',
    distanceKm: 0.5,
    downloaded: false,
  },
  {
    id: 'c4',
    store: '뮤주에스테틱',
    category: '뷰티생활',
    amount: 5000,
    condition: '첫 방문 고객',
    period: '2026.09.01~2026.12.31',
    distanceKm: 0.7,
    downloaded: false,
  },
  {
    id: 'c5',
    store: '으뜸플러스안경 대구성서점',
    category: '의류잡화',
    amount: 5000,
    condition: '안경 구매 시',
    period: '2026.09.01~2026.10.31',
    distanceKm: 1.2,
    downloaded: false,
  },
  {
    id: 'c6',
    store: '으뜸플러스안경 대구성서점',
    category: '의류잡화',
    amount: 3000,
    condition: '렌즈 구매 시',
    period: '2026.09.01~2026.10.31',
    distanceKm: 1.2,
    downloaded: false,
  },
  {
    id: 'c7',
    store: '글로리아음악전문학원',
    category: '유통쇼핑',
    amount: 5000,
    condition: '신규 등록 시',
    period: '2026.09.01~2026.11.30',
    distanceKm: 1.5,
    downloaded: true,
  },
  {
    id: 'c8',
    store: '수야커피',
    category: '음식점',
    amount: 3000,
    condition: '1인 1매 제한',
    period: '2026.09.01~2026.09.30',
    distanceKm: 1.8,
    downloaded: true,
  },
  {
    id: 'c9',
    store: '투다리 포항역점',
    category: '음식점',
    amount: 3000,
    condition: '1인 1매 제한',
    period: '2026.09.01~2026.10.31',
    distanceKm: 2.4,
    downloaded: false,
  },
  {
    id: 'c10',
    store: '예아(YEA.AH)',
    category: '뷰티생활',
    amount: 3000,
    condition: '1인 1매 제한',
    period: '2026.09.01~2026.10.31',
    distanceKm: 2.9,
    downloaded: true,
  },
]

// 거리순 정렬 — S34 원문의 "정렬(거리순)"
export function getCoupons({ downloaded = false, category = '전체' } = {}) {
  return COUPONS
    .filter((c) => c.downloaded === downloaded)
    .filter((c) => category === '전체' || c.category === category)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}
