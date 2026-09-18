# COMPONENTS.md — 강릉페이 컴포넌트 스펙
총 33개 | Phase 1 AS-IS 복제 기준

## 레이아웃 (6개)
| ID | 파일 | 스샷 | 설명 |
|----|------|------|------|
| L01 | `layout/TopAppBar.jsx` | p.1,6,7,8,9 | 로고(좌) + 큰글씨 pill + 돋보기 + ≡ |
| L02 | `layout/TopAppBarLargeText.jsx` | p.31,32,33 | 로고 + "큰글씨 끄기" pill + "메뉴" 텍스트 |
| L03 | `layout/TopAppBarBack.jsx` | p.11,13,35 | ← + 제목(중앙) + 우측 액션 |
| L04 | `layout/BottomNavBar.jsx` | 전체 | 5탭 고정 하단 바 |
| L05 | `layout/QRFloatingBar.jsx` | p.6,21,23 | "⊡ QR결제하기" 다크 플로팅 바 |
| L06 | `layout/ScreenContainer.jsx` | 전체 | 앱 전체 래퍼 (배경색 + safe area) |

## 홈 (13개)
| ID | 파일 | 스샷 | 설명 |
|----|------|------|------|
| H01 | `home/BannerCarousel.jsx` | p.1,6,7,8,9 | 배너 캐러셀 + 점 인디케이터 |
| H02 | `home/OnboardingStepper.jsx` | p.1,6 | 신청→등록→충전→결제→🚩 |
| H03 | `home/BalanceCard.jsx` | p.5,6 | 다크 블루 카드 (캐시백/강릉페이(1)/충전잔액 3행) |
| H04 | `home/BalanceCardExpanded.jsx` | p.6,7,8 | 카드 확장 상태 (카드관리\|충전 버튼) |
| H05 | `home/CashbackProgressCard.jsx` | p.1,6,21 | 캐시백 10% + teal 진행바 |
| H06 | `home/ServiceShortcutGrid.jsx` | p.1,21 | 서비스 바로가기 4아이콘 그리드 |
| H07 | `home/SectionHeader.jsx` | p.21,62 | "제목" + "전체보기 >" |
| H08 | `home/RecentPaymentEmpty.jsx` | p.21 | 최근 결제 없음 상태 |
| H09 | `home/StoreRecommendCard.jsx` | p.21,23 | 결제가능 매장 3열 카드 |
| H10 | `home/PromoHorizontalCard.jsx` | p.23,26 | 가로 배너형 프로모 카드 |
| H11 | `home/B2BPromoCard.jsx` | p.28,30 | 가맹점 등록/포탈 배너 |
| H12 | `home/SupportRankingList.jsx` | p.26,28 | 지원금 랭킹 1-3위 |
| H13 | `home/ExploreScrollCard.jsx` | p.23,26 | "강릉페이 120% 활용하기" 가로 스크롤 |

## 결제/충전 (6개)
| ID | 파일 | 스샷 | 설명 |
|----|------|------|------|
| P01 | `payment/QRScannerScreen.jsx` | p.10 | QR 스캔 전체화면 + 하단 카드 |
| P02 | `payment/ChargeScreen.jsx` | p.14,15,19 | 충전 금액 입력 화면 전체 |
| P03 | `payment/QuickAmountChip.jsx` | p.14,15 | +1만원 / +5만원 / +10만원 |
| P04 | `payment/NumPad.jsx` | p.14,15,19 | 커스텀 숫자패드 (1-9, 00, 0, ←) |
| P05 | `payment/CashbackDetail.jsx` | p.11,12 | 캐시백 상세 (자동/수동 토글) |
| P06 | `payment/TransactionHistory.jsx` | p.13 | 이용내역/카드관리 탭 |

## 결제매장 (4개)
| ID | 파일 | 스샷 | 설명 |
|----|------|------|------|
| M01 | `store/StoreMapScreen.jsx` | p.24,43,44 | 지도 + 검색바 + 필터칩 + 바텀시트 |
| M02 | `store/StoreListItem.jsx` | p.24,44 | 매장명 + 거리 + 카테고리 칩 한 줄 |
| M03 | `store/StoreDetailSheet.jsx` | p.45 | 매장 상세 바텀시트 |
| M04 | `store/CategoryFilterChip.jsx` | p.43,44 | 새로운매장/음식점/카페/마트 칩 |

## 모달/바텀시트 (5개)
| ID | 파일 | 스샷 | 설명 |
|----|------|------|------|
| S01 | `common/AnnouncementModal.jsx` | p.5,20 | 공지 팝업 (오늘그만보기/닫기) |
| S02 | `common/BottomSheet.jsx` | p.12,37 | 바텀시트 베이스 (핸들 + 둥근 모서리) |
| S03 | `common/MonthPickerSheet.jsx` | p.12 | 월 선택 리스트 |
| S04 | `common/LanguageSheet.jsx` | p.37 | 언어 선택 (한/영/中/日/越) |
| S05 | `common/RefundGuideModal.jsx` | p.18 | 환불 안내 모달 (충전 전) |

## 공통 (9개)
| ID | 파일 | 스샷 | 설명 |
|----|------|------|------|
| I01 | `common/EmptyState.jsx` | p.11,13,56,57 | 문서+X 일러스트 + 메시지 + CTA |
| I02 | `common/SupportGrantCard.jsx` | p.52~55 | 지원금 태그+제목+화살표 |
| I03 | `common/SupportGrantDetail.jsx` | p.58~61 | 지원금 상세 본문 + 하단 액션바 |
| I04 | `common/NotificationItem.jsx` | p.42 | 알림 항목 (날짜 그룹 + 내용) |
| I05 | `common/SettingsToggleRow.jsx` | p.36 | 설정 토글 행 (레이블 + 스위치) |
| I06 | `common/MenuDrawer.jsx` | p.34,41 | 전체 메뉴 드로어 |
| I07 | `chatbot/ChatBotScreen.jsx` | p.75~79 | 챗봇 푸루 화면 |
| I08 | `common/TagChip.jsx` | p.52~61 | 서비스/현금/이용권 분류 태그 |
| I09 | `common/DonationCard.jsx` | p.67,69 | 기부 캠페인 2열 카드 |