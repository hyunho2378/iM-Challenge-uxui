# ROUTES.md — 강릉페이 라우팅 구조
Phase 3 반영 | React Router v6

## 바텀 네비게이션 (5탭)

| 탭 | 경로 | 상태 |
|----|------|------|
| 홈 | `/` | 활성 |
| 결제매장 | `/store` | 활성 |
| QR결제 (중앙) | `/qr` | 활성 |
| 이용내역 | `/history` | 활성 |
| MY | `/my` | Phase 3 신규 |

## App.jsx 라우트 전체

```jsx
<Routes>
  {/* 바텀탭 — 활성 5개 */}
  <Route path="/"        element={<HomePage />} />        {/* 홈 */}
  <Route path="/store"   element={<StorePage />} />       {/* 결제매장 */}
  <Route path="/qr"      element={<QRPage />} />          {/* QR결제 (중앙) */}
  <Route path="/history" element={<HistoryPage />} />     {/* 이용내역 */}
  <Route path="/my"      element={<MyPage />} />          {/* MY (Phase 3 신규) */}

  {/* 바텀탭 — HIDDEN (Phase 3 feedback): 라우트 유지, 탭 진입 제거 */}
  <Route path="/life"      element={<LifePage />} />      {/* 생활편의 (숨김) */}
  <Route path="/support"   element={<SupportPage />} />   {/* 지원금·혜택 (숨김) */}
  <Route path="/community" element={<CommunityPage />} /> {/* 소통참여 (숨김) */}

  {/* Phase 3 신규 */}
  <Route path="/search"     element={<SearchPage />} />    {/* 검색 전용 페이지 */}
  <Route path="/card-apply" element={<CardApplyPage />} /> {/* 카드 신청 */}

  {/* 결제/충전 */}
  <Route path="/charge"   element={<ChargePage />} />
  <Route path="/cashback" element={<CashbackPage />} />

  {/* 서비스 안내 */}
  <Route path="/service-edit"   element={<ServiceEditPage />} />
  <Route path="/kakao-guide"    element={<KakaoPayGuidePage />} />
  <Route path="/transport-card" element={<TransportCardPage />} />
  <Route path="/usage-guide"    element={<UsageGuidePage />} />

  {/* 메뉴/설정 */}
  <Route path="/menu"            element={<Navigate to="/my" replace />} /> {/* /menu → /my 리다이렉트 */}
  <Route path="/settings"        element={<SettingsPage />} />
  <Route path="/notification"    element={<NotificationPage />} />
  <Route path="/customer-center" element={<CustomerCenterPage />} />
  <Route path="/chatbot"         element={<ChatbotPage />} />
  <Route path="/card-lost"       element={<CardLostPage />} />
  <Route path="/coupon"          element={<CouponPage />} />

  {/* 지원금 */}
  <Route path="/support/:id"  element={<SupportDetailPage />} />
  <Route path="/support-wish" element={<WishSupportPage />} />
  <Route path="/custom-info"  element={<CustomInfoPage />} />

  {/* 소통참여 (HIDDEN — 라우트 유지) */}
  <Route path="/donation"         element={<DonationPage />} />
  <Route path="/donation/:id"     element={<DonationDetailPage />} />
  <Route path="/donation-history" element={<DonationHistoryPage />} />
  <Route path="/news"             element={<NewsListPage />} />
  <Route path="/news/:id"         element={<NewsDetailPage />} />
  <Route path="/place/:id"        element={<PlaceDetailPage />} />
</Routes>
```

## 변경 사항 (Phase 3)

| 변경 유형 | 경로 | 내용 |
|----------|------|------|
| 신규 | `/my` | MY 탭 — 햄버거 메뉴 흡수 |
| 신규 | `/search` | 검색 전용 페이지 (헤더 검색 버튼) |
| 신규 | `/card-apply` | 카드 신청 플로우 |
| 리다이렉트 | `/menu` → `/my` | 기존 메뉴 링크 호환 |
| 탭 제거 | `/life`, `/support`, `/community` | 바텀탭 숨김, 라우트 유지 |

## Phase 2 기준 (변경 전 바텀탭 5개)

```
/ (홈) | /store (결제매장) | /life (생활편의) | /support (지원금) | /community (소통참여)
```

## Phase 3 기준 (변경 후 바텀탭 5개)

```
/ (홈) | /store (결제매장) | /qr (QR결제·중앙) | /history (이용내역) | /my (MY)
```

## 화면별 스팟 스샷 참조

| 경로 | 관련 스샷 페이지 |
|------|----------------|
| `/` | p.1, 6, 7, 8, 9, 21, 23, 26, 28, 30 |
| `/store` | p.24, 25, 43, 44, 45 |
| `/qr` | p.10 |
| `/history` | p.13 |
| `/my` | p.34, 41 (Phase 2 MenuPage 흡수) |
| `/search` | p.25 (검색+키보드) |
| `/card-apply` | 첨부 이미지 2, 3 |
| `/charge` | p.14, 15, 19, 74 |
| `/cashback` | p.11, 12 |
| `/notification` | p.42 |
