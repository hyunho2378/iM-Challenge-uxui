/**
 * HistoryPage (단계 4 — 캐시백 시스템 풀스택 재구축)
 * 새 transaction 구조: storeName / totalAmount / paidByCashback / paidByBalance / cashbackEarned / cashbackMode
 * spend: 캐시백 사용 분리 박스 + 자동/수동 라벨 + 적립 표시
 * Nielsen #1 visibility, #3 user control, #6 recognition
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { colors, typography, layout, spacing } from '../tokens/tokens'
import { formatDate } from '../utils/date'
import { useTypography } from '../hooks/useTypography'
import ScreenContainer from '../components/layout/ScreenContainer'
import BottomNavBar from '../components/layout/BottomNavBar'
import Button from '../components/common/Button'

const TYPE_FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'charge', label: '충전' },
  { key: 'refund', label: '환불' },
  { key: 'spend', label: '결제' },
]

// 06차 3번: 월별 칩 필터. mock 데이터가 2025-06~2026-05(iM샵 "이번 달" 기준)를 다루므로
// 그 12개월을 최신순으로 나열한다. PeriodPickerModal과 같은 앵커(2026년 5월)를 쓴다.
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(2026, 4 - i)
  return { year: d.getFullYear(), month: d.getMonth() + 1 }
})

export default function HistoryPage() {
  const navigate = useNavigate()
  const sizes = useTypography()
  const { hasCard, transactions } = useUser()

  const [typeFilter, setTypeFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState(null)

  // 카드 미신청 시 빈 상태 — BottomNav 진입 가능 페이지라 카드 미신청 사용자도 도달 가능
  if (!hasCard) {
    return (
      <ScreenContainer statusBarBg={colors.surface.card}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: `${spacing[3]} ${layout.margin}`,
          backgroundColor: colors.surface.card,
          borderBottom: `1px solid ${colors.gray[200]}`,
          minHeight: layout.topBarHeight,
          flexShrink: 0,
        }}>
          <h1 style={{
            margin: 0,
            fontSize: sizes.lg,
            fontWeight: typography.weight.bold,
            color: colors.gray[900],
            fontFamily: typography.fontFamily,
          }}>
            이용 내역
          </h1>
        </div>

        {/* 빈 상태 본문 */}
        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing[6],
          gap: spacing[5],
          backgroundColor: colors.surface.background,
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: layout.radiusPill,
            backgroundColor: colors.primary[50],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Receipt size={40} color={colors.primary[700]} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              margin: 0,
              marginBottom: spacing[2],
              fontSize: sizes.lg,
              fontWeight: typography.weight.bold,
              color: colors.gray[900],
              fontFamily: typography.fontFamily,
            }}>
              아직 이용 내역이 없어요
            </h2>
            <p style={{
              margin: 0,
              fontSize: sizes.sm,
              color: colors.gray[500],
              lineHeight: 1.5,
              fontFamily: typography.fontFamily,
            }}>
              카드 신청 후 iM샵을 이용하시면<br />
              이용 내역을 확인할 수 있어요
            </p>
          </div>

          <Button variant="filled" size="lg" onClick={() => navigate('/card-apply')} style={{ maxWidth: '280px' }}>
            카드 신청하기
          </Button>
        </div>

        <BottomNavBar />
      </ScreenContainer>
    )
  }

  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false
    if (periodFilter) {
      const d = new Date(t.date)
      if (d.getFullYear() !== periodFilter.year || d.getMonth() + 1 !== periodFilter.month) return false
    }
    return true
  })

  const fmt = (n) => n.toLocaleString('ko-KR')
  const fmtDate = (iso) => formatDate(iso, { withTime: true })

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: `${spacing[3]} ${layout.margin}`,
        backgroundColor: colors.surface.card,
        borderBottom: `1px solid ${colors.gray[200]}`,
        minHeight: layout.topBarHeight,
      }}>
        <h1 style={{
          margin: 0,
          fontSize: sizes.lg,
          fontWeight: typography.weight.bold,
          color: colors.gray[900],
          fontFamily: typography.fontFamily,
        }}>
          이용 내역
        </h1>
      </div>

      {/* 필터 바 */}
      <div style={{
        backgroundColor: colors.surface.card,
        borderBottom: `1px solid ${colors.gray[100]}`,
        padding: `${spacing[2]} ${layout.margin}`,
      }}>
        {/* 타입 필터 칩 */}
        <div style={{ display: 'flex', gap: spacing[2], marginBottom: spacing[2] }}>
          {TYPE_FILTERS.map(({ key, label }) => {
            const active = typeFilter === key
            return (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                style={{
                  padding: `${spacing[1]} ${spacing[3]}`,
                  borderRadius: layout.radiusPill,
                  border: `1px solid ${active ? colors.primary[700] : colors.gray[200]}`,
                  backgroundColor: active ? colors.primary[700] : 'transparent',
                  color: active ? colors.onDark.primary : colors.gray[700],
                  fontSize: sizes.xs,
                  fontWeight: active ? typography.weight.semibold : typography.weight.regular,
                  cursor: 'pointer',
                  fontFamily: typography.fontFamily,
                  minHeight: '32px',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* 06차 3번: 월별 칩 필터 — 모달 대신 가로 스크롤 칩으로 바로 고른다 */}
        <div style={{ display: 'flex', gap: spacing[2], overflowX: 'auto', scrollbarWidth: 'none' }}>
          <button
            onClick={() => setPeriodFilter(null)}
            style={{
              flexShrink: 0,
              padding: `${spacing[1]} ${spacing[3]}`,
              borderRadius: layout.radiusPill,
              border: `1px solid ${!periodFilter ? colors.primary[700] : colors.gray[200]}`,
              backgroundColor: !periodFilter ? colors.primary[700] : 'transparent',
              color: !periodFilter ? colors.onDark.primary : colors.gray[700],
              fontSize: sizes.xs,
              fontWeight: !periodFilter ? typography.weight.semibold : typography.weight.regular,
              cursor: 'pointer',
              fontFamily: typography.fontFamily,
              minHeight: '32px',
              whiteSpace: 'nowrap',
            }}
          >
            전체 기간
          </button>
          {MONTH_OPTIONS.map(({ year, month }) => {
            const active = periodFilter?.year === year && periodFilter?.month === month
            return (
              <button
                key={`${year}-${month}`}
                onClick={() => setPeriodFilter({ year, month })}
                style={{
                  flexShrink: 0,
                  padding: `${spacing[1]} ${spacing[3]}`,
                  borderRadius: layout.radiusPill,
                  border: `1px solid ${active ? colors.primary[700] : colors.gray[200]}`,
                  backgroundColor: active ? colors.primary[700] : 'transparent',
                  color: active ? colors.onDark.primary : colors.gray[700],
                  fontSize: sizes.xs,
                  fontWeight: active ? typography.weight.semibold : typography.weight.regular,
                  cursor: 'pointer',
                  fontFamily: typography.fontFamily,
                  minHeight: '32px',
                  whiteSpace: 'nowrap',
                }}
              >
                {year}년 {month}월
              </button>
            )
          })}
        </div>
      </div>

      <div style={{
        padding: layout.margin,
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        backgroundColor: colors.surface.background,
      }}>
        {filtered.length === 0 ? (
          <div style={{
            backgroundColor: colors.surface.card,
            borderRadius: layout.radiusCard,
            padding: spacing[8],
            textAlign: 'center',
            color: colors.gray[500],
            fontSize: sizes.sm,
          }}>
            이용 내역이 없습니다
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
            {filtered.map((t) => {
              const isCharge = t.type === 'charge'
              const isRefund = t.type === 'refund'
              const isSpend = t.type === 'spend'

              const headerText = isCharge ? '충전' : isRefund ? '환불' : t.storeName
              const sign = isCharge ? '+' : '-'
              const amountColor = isCharge
                ? colors.primary[700]
                : isRefund
                  ? colors.warning
                  : colors.gray[900]

              return (
                <div key={t.id} style={{
                  backgroundColor: colors.surface.card,
                  borderRadius: layout.radiusCard,
                  padding: spacing[4],
                }}>
                  {/* 1줄: 헤더 라벨 + 총액 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: spacing[3],
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: sizes.sm,
                        fontWeight: typography.weight.semibold,
                        color: colors.gray[900],
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {headerText}
                      </div>
                      <div style={{
                        marginTop: spacing[1],
                        fontSize: sizes.xs,
                        color: colors.gray[500],
                      }}>
                        {fmtDate(t.date)}
                        {isSpend && t.cashbackMode && (
                          <> · {t.cashbackMode === 'auto' ? '자동' : '수동'}</>
                        )}
                      </div>
                    </div>
                    {/* 우측: 금액 위 + 잔액 아래 (날짜 라인과 같은 높이로 정렬) */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: spacing[1],
                    }}>
                      <span style={{
                        fontSize: sizes.md,
                        fontWeight: typography.weight.bold,
                        color: amountColor,
                        whiteSpace: 'nowrap',
                      }}>
                        {sign}{fmt(t.totalAmount)}원
                      </span>
                      {typeof t.balanceAfter === 'number' && (
                        <span style={{
                          fontSize: sizes.xs,
                          color: colors.gray[500],
                          whiteSpace: 'nowrap',
                        }}>
                          잔액 {fmt(t.balanceAfter)}원
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 결제 수단 분리 (캐시백 사용한 경우만) */}
                  {isSpend && t.paidByCashback > 0 && (
                    <div style={{
                      marginTop: spacing[3],
                      paddingLeft: spacing[3],
                      borderLeft: `2px solid ${colors.gray[200]}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: spacing[1],
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: sizes.xs,
                        color: colors.gray[700],
                      }}>
                        <span>혜택 사용</span>
                        <span style={{
                          color: colors.teal[500],
                          fontWeight: typography.weight.medium,
                        }}>
                          -{fmt(t.paidByCashback)}원
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: sizes.xs,
                        color: colors.gray[700],
                      }}>
                        <span>대구로페이</span>
                        <span>-{fmt(t.paidByBalance)}원</span>
                      </div>
                    </div>
                  )}

                  {/* 적립 표시 */}
                  {isSpend && t.cashbackEarned > 0 && (
                    <div style={{
                      marginTop: spacing[2],
                      fontSize: sizes.xs,
                      color: colors.teal[500],
                      fontWeight: typography.weight.medium,
                    }}>
                      +{fmt(t.cashbackEarned)}원 적립
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNavBar />
    </ScreenContainer>
  )
}
