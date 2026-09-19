/**
 * BenefitsPage — 혜택 현황 (06차 5번, 신규)
 * 이전 프로젝트의 "캐시백 내역" 전용 페이지 레이아웃(월별 추적)만 구조로 가져오고
 * 내용은 iM샵 실제 개념으로 바꿨다: 소득공제 신청 여부 + 월별 할인충전 누적 사용액.
 * 소득공제 신청 여부는 hasCard로부터 그대로 유도한다 — 전사.md FAQ Q1 원문:
 * "대구로페이 소득공제는 모바일카드 발급 시 소득공제 신청이 포함되어 있습니다."
 * 즉 카드가 있으면 신청도 이미 된 상태다. 별도 신청 플래그를 새로 만들지 않았다.
 */

import { useNavigate } from 'react-router-dom'
import { CheckCircle, FileCheck, Ticket, ChevronRight, Fuel, Wallet } from 'lucide-react'
import { useUser, MONTHLY_DISCOUNT_LIMIT } from '../context/UserContext'
import { colors, typography, layout, spacing, shadow } from '../tokens/tokens'
import { useTypography } from '../hooks/useTypography'
import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'
import BottomNavBar from '../components/layout/BottomNavBar'
import Button from '../components/common/Button'

function getMonthKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`
}

export default function BenefitsPage() {
  const navigate = useNavigate()
  const sizes = useTypography()
  const { hasCard, transactions } = useUser()

  // 월별 할인충전 사용액 — 최신 월 순. 정렬용으로 그 달의 첫 거래 시각도 같이 들고 있는다.
  const monthlyMap = new Map()
  transactions
    .filter((t) => t.type === 'charge' && t.discounted)
    .forEach((t) => {
      const key = getMonthKey(t.date)
      const prev = monthlyMap.get(key)
      monthlyMap.set(key, { total: (prev?.total || 0) + t.totalAmount, sortTime: new Date(t.date).getTime() })
    })
  const monthlyRows = [...monthlyMap.entries()]
    .sort((a, b) => b[1].sortTime - a[1].sortTime)
    .map(([key, { total }]) => [key, total])

  const fmt = (n) => n.toLocaleString('ko-KR') + '원'

  if (!hasCard) {
    return (
      <ScreenContainer statusBarBg={colors.surface.card}>
        <TopAppBarBack title="혜택 현황" onBack={() => navigate(-1)} />
        <div style={{
          flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: spacing[6], gap: spacing[5],
          backgroundColor: colors.surface.background,
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: layout.radiusPill, backgroundColor: colors.primary[50],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileCheck size={40} color={colors.primary[700]} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: `0 0 ${spacing[2]}`, fontSize: sizes.lg, fontWeight: typography.weight.bold, color: colors.gray[900] }}>
              아직 혜택 현황이 없어요
            </h2>
            <p style={{ margin: 0, fontSize: sizes.sm, color: colors.gray[500], lineHeight: typography.lineHeight.body }}>
              카드 신청 시 소득공제 신청이 자동으로 포함되고<br />
              할인충전 사용 현황도 여기서 볼 수 있어요
            </p>
          </div>
          <Button variant="filled" size="lg" onClick={() => navigate('/card-apply')} style={{ maxWidth: '280px' }}>
            카드 신청하기
          </Button>
          {/* 쿠폰함은 카드가 없어도 볼 수 있다 — 카드 미보유 상태에서도 진입구를 남긴다 */}
          <button
            onClick={() => navigate('/coupon')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.primary[700],
              fontSize: sizes.sm,
              fontWeight: typography.weight.semibold,
              cursor: 'pointer',
              fontFamily: typography.fontFamily,
              minHeight: layout.touchMin,
            }}
          >
            쿠폰함 보러 가기
          </button>
        </div>
        <BottomNavBar />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="혜택 현황" onBack={() => navigate(-1)} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: colors.surface.background, padding: layout.margin }}>
        {/* 09차 4번: 쿠폰함 진입—전사.md S34 쿠폰함은 8장이나 캐처된 주요 화면인데
            지금까지 어느 화면에서도 들어갈 수 없었다. 새 바텐내비 탭 없이 여기서 연결한다. */}
        <button
          onClick={() => navigate('/coupon')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
            backgroundColor: colors.surface.card,
            borderRadius: layout.radiusCard,
            boxShadow: shadow.card,
            border: 'none',
            padding: spacing[5],
            marginBottom: spacing[4],
            cursor: 'pointer',
            fontFamily: typography.fontFamily,
            textAlign: 'left',
            minHeight: layout.touchMin,
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: layout.radiusPill,
            backgroundColor: colors.primary[50],
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Ticket size={22} color={colors.primary[700]} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: sizes.md, fontWeight: typography.weight.bold, color: colors.gray[900] }}>
              쿠폰함
            </p>
            <p style={{ margin: `${spacing[1]} 0 0`, fontSize: sizes.xs, color: colors.gray[500], lineHeight: typography.lineHeight.body }}>
              내 주변 가맹점 할인쿠폰을 받아보세요
            </p>
          </div>
          <ChevronRight size={20} color={colors.gray[400]} />
        </button>

        {/* 09차 5번: 탭 이름이 "지원금·혜택"인데 지원금 내용이 하나도 없었다.
            전사.md S30 고객센터 FAQ 카테고리 칩에 "고유가지원금", "소비쿠폰지원금"이 실제로 있어
            그 두 항목을 안내 카드로만 둘다. 실제 신청 플로우는 만들지 않았다. */}
        <p style={{ margin: `0 0 ${spacing[3]}`, fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
          지원금 안내
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3], marginBottom: spacing[5] }}>
          {[
            {
              icon: <Fuel size={20} color={colors.warning} />,
              bg: colors.warmBg,
              title: '고유가 지원금',
              desc: '대구로페이로 지급되는 지원금입니다. 지급 대상·시기는 고객센터에서 확인하세요.',
            },
            {
              icon: <Wallet size={20} color={colors.teal[500]} />,
              bg: colors.greenBg,
              title: '소비쿠폰 지원금',
              desc: '행정복지센터에서 신청한 소비쿠폰도 이 카드로 충전·사용할 수 있어요.',
            },
          ].map((it) => (
            <div key={it.title} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing[3],
              backgroundColor: colors.surface.card,
              borderRadius: layout.radiusCard,
              boxShadow: shadow.card,
              padding: spacing[4],
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: layout.radiusPill, backgroundColor: it.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {it.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: sizes.sm, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
                  {it.title}
                </p>
                <p style={{ margin: `${spacing[1]} 0 0`, fontSize: sizes.xs, color: colors.gray[500], lineHeight: typography.lineHeight.body }}>
                  {it.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 소득공제 신청 여부 */}
        <div style={{
          backgroundColor: colors.surface.card,
          borderRadius: layout.radiusCard,
          padding: spacing[5],
          boxShadow: shadow.card,
          marginBottom: spacing[4],
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
        }}>
          <CheckCircle size={28} color={colors.success} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: sizes.md, fontWeight: typography.weight.bold, color: colors.gray[900] }}>
              소득공제 신청 완료
            </p>
            <p style={{ margin: `${spacing[1]} 0 0`, fontSize: sizes.xs, color: colors.gray[500], lineHeight: typography.lineHeight.body }}>
              모바일카드 발급 시 소득공제 신청이 함께 처리됐어요
            </p>
          </div>
        </div>

        {/* 월별 할인충전 사용액 */}
        <p style={{ margin: `0 0 ${spacing[3]}`, fontSize: sizes.md, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
          월별 할인충전 사용액
        </p>

        {monthlyRows.length === 0 ? (
          <div style={{ backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, padding: spacing[8], textAlign: 'center' }}>
            <p style={{ color: colors.gray[500], fontSize: sizes.sm, margin: 0 }}>
              할인충전 이용 내역이 없어요
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {monthlyRows.map(([monthKey, used]) => {
              const pct = Math.min(100, (used / MONTHLY_DISCOUNT_LIMIT) * 100)
              return (
                <div key={monthKey} style={{
                  backgroundColor: colors.surface.card,
                  borderRadius: layout.radiusCard,
                  padding: spacing[4],
                  boxShadow: shadow.card,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
                    <span style={{ fontSize: sizes.sm, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
                      {monthKey}
                    </span>
                    <span style={{ fontSize: sizes.sm, fontWeight: typography.weight.bold, color: colors.teal[500] }}>
                      {Math.round(pct)}%
                    </span>
                  </div>
                  <div style={{ height: 6, backgroundColor: colors.gray[100], borderRadius: layout.radiusPill, overflow: 'hidden', marginBottom: spacing[2] }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: colors.teal[500] }} />
                  </div>
                  <div style={{ fontSize: sizes.xs, color: colors.gray[500] }}>
                    {fmt(used)} / {fmt(MONTHLY_DISCOUNT_LIMIT)}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ height: layout.bottomNavHeight }} />
      </div>

      <BottomNavBar />
    </ScreenContainer>
  )
}
