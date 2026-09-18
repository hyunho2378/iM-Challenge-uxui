import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'

const STEPS = ['신청', '등록', '충전', '결제', '완료']

export default function OnboardingStepper({ currentStep = 3 }) {
  return (
    <div
      style={{
        backgroundColor: colors.surface.card,
        borderRadius: layout.radiusButton,
        margin: layout.margin,
        padding: spacing[4],
        boxShadow: shadow.card,
      }}
    >
      <p
        style={{
          margin: `0 0 ${spacing[3]} 0`,
          fontSize: typography.size.xs,
          fontWeight: typography.weight.semibold,
          color: colors.gray[500],
        }}
      >
        진행 단계
      </p>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep
          const isCurrent = idx === currentStep
          const isPending = idx > currentStep

          return (
            <div
              key={idx}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}
            >
              {/* 스텝 원 + 연결선 row */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* 왼쪽 연결선 */}
                {idx > 0 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      backgroundColor: idx <= currentStep ? colors.primary[700] : colors.gray[200],
                      transition: 'background-color 120ms cubic-bezier(0.23,1,0.32,1)',
                    }}
                  />
                )}

                {/* 스텝 원 */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isDone
                      ? colors.primary[700]
                      : isCurrent
                      ? colors.primary[700]
                      : colors.gray[200],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background-color 120ms cubic-bezier(0.23,1,0.32,1)',
                  }}
                >
                  {isDone ? (
                    // 체크 아이콘
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2.5 7 L5.5 10 L11.5 4"
                        stroke={colors.onDark.primary}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      style={{
                        fontSize: typography.size.xxs,
                        fontWeight: typography.weight.bold,
                        color: isCurrent ? colors.onDark.primary : colors.gray[500],
                        lineHeight: 1,
                      }}
                    >
                      {idx + 1}
                    </span>
                  )}
                </div>

                {/* 오른쪽 연결선 */}
                {idx < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      backgroundColor: idx < currentStep ? colors.primary[700] : colors.gray[200],
                      transition: 'background-color 120ms cubic-bezier(0.23,1,0.32,1)',
                    }}
                  />
                )}
              </div>

              {/* 스텝 레이블 */}
              <span
                style={{
                  marginTop: spacing[1],
                  fontSize: typography.size.xxs,
                  fontWeight: isCurrent ? typography.weight.bold : typography.weight.regular,
                  color: isDone || isCurrent ? colors.primary[700] : colors.gray[400],
                  textAlign: 'center',
                  transition: 'color 120ms cubic-bezier(0.23,1,0.32,1)',
                }}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
