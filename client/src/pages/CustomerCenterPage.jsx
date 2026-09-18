import { useNavigate } from 'react-router-dom'
import { colors, layout, typography, shadow } from '../tokens/tokens'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'

const faqItems = [
  { id: 1, question: '충전은 어떻게 하나요?', route: '/charge' },
  { id: 2, question: '환불은 어떻게 신청하나요?', route: '/refund' },
  { id: 3, question: '카드를 분실했어요', route: '/card-lost' },
  { id: 4, question: '가맹점은 어디서 사용 가능한가요?', route: '/store' },
  { id: 5, question: '캐시백은 어떻게 받나요?', route: '/cashback' },
]

export default function CustomerCenterPage() {
  const navigate = useNavigate()

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="고객센터" onBack={() => navigate(-1)} />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '24px',
          backgroundColor: colors.surface.background,
        }}
      >
        {/* 전화 상담 */}
        <div style={{ padding: `16px ${layout.margin} 0` }}>
          <div
            style={{
              backgroundColor: colors.surface.card,
              borderRadius: layout.radiusCard,
              padding: '20px',
              boxShadow: shadow.card,
            }}
          >
            <p
              style={{
                fontSize: typography.size.xs,
                fontWeight: typography.weight.semibold,
                color: colors.gray[500],
                margin: '0 0 12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              전화 상담
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: colors.primary[100],
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6.5 3.5c.5 1.5 1 3 .5 4L5 9c1 2.5 3 4.5 5.5 5.5l1.5-2c1-.5 2.5 0 4 .5.5 2-1 3-2 3.5C9 17.5 3 11.5 3.5 7c.5-1 1.5-3.5 3-3.5z" stroke={colors.primary[700]} strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: typography.weight.bold,
                    color: colors.primary[700],
                    margin: 0,
                  }}
                >
                  1566-4335
                </p>
                <p
                  style={{
                    fontSize: typography.size.xs,
                    color: colors.gray[500],
                    margin: '2px 0 0',
                  }}
                >
                  평일 09:00 ~ 18:00 (점심 12:00~13:00)
                </p>
              </div>
            </div>
            <div
              style={{
                marginTop: '12px',
                padding: '10px 12px',
                backgroundColor: colors.gray[100],
                borderRadius: layout.radiusSmall,
              }}
            >
              <p
                style={{
                  fontSize: typography.size.xs,
                  color: colors.gray[500],
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                토·일·공휴일은 운영하지 않습니다. 점심시간 및 업무시간 외 전화 상담이 어려울 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ 리스트 */}
        <div style={{ padding: `16px ${layout.margin} 0` }}>
          <p
            style={{
              fontSize: typography.size.xs,
              fontWeight: typography.weight.semibold,
              color: colors.gray[500],
              margin: '0 0 8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            자주 묻는 질문
          </p>
          <div
            style={{
              backgroundColor: colors.surface.card,
              borderRadius: layout.radiusCard,
              overflow: 'hidden',
              boxShadow: shadow.card,
            }}
          >
            {faqItems.map((faq, index) => (
              <div key={faq.id}>
                <button
                  onClick={() => navigate(faq.route)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: typography.size.xs,
                        fontWeight: typography.weight.bold,
                        color: colors.primary[700],
                        flexShrink: 0,
                      }}
                    >
                      Q
                    </span>
                    <span
                      style={{
                        fontSize: typography.size.sm,
                        color: colors.gray[900],
                      }}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M6 4l4 4-4 4" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {index < faqItems.length - 1 && (
                  <div style={{ height: '1px', backgroundColor: colors.gray[100], margin: `0 ${layout.margin}` }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenContainer>
  )
}
