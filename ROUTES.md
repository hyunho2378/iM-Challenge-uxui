# ROUTES.md — iM샵(대구로페이) 라우팅 구조

`App.jsx`를 소스 오브 트루스로 삼는다. iM샵에 대응 화면이 없는 라우트(`/life`,`/support`,`/community`,`/cashback`,`/kakao-guide`,`/transport-card`,`/chatbot`,`/donation*`,`/news*` 등)는 전부 제거했다.

## 바텀 네비게이션 (5탭, 신규)

iM샵 실제 구조는 바텀 내비게이션이 없고 햄버거 드로어 하나가 전역 이동수단이다(IA 분석 확정 병리). 이 프로젝트는 이미 완성된 `BottomNavBar`를 재사용해 바텀내비를 to-be 개선으로 얹는다.

| 탭 | 경로 | 비고 |
|----|------|------|
| 홈 | `/` | 메인 대시보드 |
| 충전·결제 | `/qr` | QR결제 화면. 잔액 부족 시 인라인으로 충전 연결 |
| 이용내역 | `/history` | |
| SHOP·쿠폰 | `/store` | 가맹점 목록 + 쿠폰 |
| MY | `/my` | 설정+고객센터 흡수 |

`지원금·혜택` 탭은 제거했다 — iM샵에 대응 화면이 없다.

## App.jsx 라우트 전체

```jsx
<Routes>
  {/* 바텀탭 5개 */}
  <Route path="/"        element={<HomePage />} />
  <Route path="/qr"      element={<QRPage />} />
  <Route path="/history" element={<HistoryPage />} />
  <Route path="/store"   element={<StorePage />} />
  <Route path="/my"      element={<MyPage />} />

  {/* 충전/계좌 */}
  <Route path="/charge"       element={<ChargePage />} />       {/* 정상/할인 충전 */}
  <Route path="/charge-free"  element={<ChargeFreePage />} />   {/* 신규 — 할인없이충전(무혜택) */}
  <Route path="/account-link" element={<AccountLinkPage />} />  {/* 신규 — 연결계좌 은행/증권 선택 */}

  {/* 카드 */}
  <Route path="/card-apply"      element={<CardApplyPage />} />
  <Route path="/card-management" element={<CardManagementPage />} />
  <Route path="/card-lost"       element={<CardLostPage />} />
  <Route path="/refund"          element={<RefundPage />} />

  {/* 검색/서비스 */}
  <Route path="/search"      element={<SearchPage />} />
  <Route path="/service-edit" element={<ServiceEditPage />} />
  <Route path="/usage-guide"  element={<UsageGuidePage />} />

  {/* 설정/고객센터 (MY 하위) */}
  <Route path="/menu"            element={<Navigate to="/my" replace />} /> {/* 구 링크 호환 */}
  <Route path="/settings"        element={<SettingsPage />} />
  <Route path="/notification"    element={<NotificationPage />} />
  <Route path="/customer-center" element={<CustomerCenterPage />} /> {/* FAQ 아코디언 */}
  <Route path="/coupon"          element={<CouponPage />} />
  <Route path="/terms"           element={<TermsPage />} />
</Routes>
```

## 변경 사항 (05차)

| 변경 유형 | 경로 | 내용 |
|----------|------|------|
| 신규 | `/account-link` | 연결계좌 은행/증권 선택. iM샵 원본(PAY-01)엔 검색이 없었으나 to-be 개선으로 검색 추가. AI 개입지점 1 포함 |
| 신규 | `/charge-free` | 할인없이 충전(무혜택). 정상 충전(`/charge`)에서 할인기간 아님 에러 시 이 화면으로 유도(AI 개입지점 2) |
| 콘텐츠 전면 교체 | `/customer-center` | FAQ 링크 목록 → iM샵 실제 FAQ 19문항 아코디언(카테고리 칩 포함) |
| 라우트 정리 | — | `/life`,`/support`,`/community`,`/cashback`,`/kakao-guide`,`/transport-card`,`/chatbot`,`/support/:id`,`/support-wish`,`/custom-info`,`/donation`,`/donation/:id`,`/donation-history`,`/news`,`/news/:id`,`/place/:id` 제거(iM샵에 대응 화면 없음, 이미 App.jsx에 없던 문서상 유령 라우트) |
| 바텀탭 변경 | — | `지원금·혜택` 탭 제거, 5탭을 홈/충전·결제/이용내역/SHOP·쿠폰/MY로 재편 |

## iM샵 화면 인벤토리 대응표

출처: `docs/imshop-ia-analysis.md`. 상세 근거는 `전사.md` 참조.

| 그룹 | iM샵 화면(ID) | 대응 경로 | 상태 |
|---|---|---|---|
| 온보딩 | ONB-01~07 | 앱 첫 진입 플로우 | 기존 `SplashPage`/`OnboardingStepper` 자산, 이번 스코프 외(플로우 재작성 대상이나 시간상 보류) |
| 홈 | HOME-01 | `/` | 04차 지적 그대로 재구조화(4번) |
| 홈 | HOME-02(SHOP 카테고리) | `/store` | `CategoryFilterChip` 재사용 |
| 카드 | CARD-01~07 | `/card-apply`, `/card-management` | 기존 자산 재사용 |
| 충전/결제 | PAY-01(연결계좌) | `/account-link` | 신규 제작 |
| 충전/결제 | PAY-02(충전 정상/할인) | `/charge` | 할인기간 아님 에러 분기 추가 |
| 충전/결제 | PAY-03(할인없이충전) | `/charge-free` | 신규 제작 |
| 충전/결제 | PAY-04·05(QR) | `/qr` | 기존 `QRScannerScreen` 재사용 |
| 충전/결제 | PAY-06·07(이용내역) | `/history` | 기존 자산 재사용 |
| 설정/네비 | NAV-01~06 | `/settings`, `/my` 하위 | 기존 자산 재사용. NAV-04 이중진입 문제는 이번 스코프 외 |
| 고객센터 | CS-01·02(FAQ) | `/customer-center` | 콘텐츠 전면 교체(3번) |
| 고객센터 | CS-03(1:1문의) | — | 이번 스코프 외 |
| SHOP/쿠폰 | 쿠폰함·가맹점검색·매장상세 | `/store`, `/coupon` | 기존 자산 재사용, 샘플 데이터만 대구로 교체(6번) |
