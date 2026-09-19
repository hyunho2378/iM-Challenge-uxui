// RefundGuideModal.jsx — S05 (p.18)
// 환불 안내 모달 (충전 전)
// 06차 4번: 이전 프로젝트 고유 규칙(충전 건별 60%/80% 사용 후 환불)을 지우고
// iM샵 실제 규칙(전사.md FAQ Q19 원문)으로 바꿨다. RefundPage.jsx와 같은 근거다.

import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import BottomSheet from './BottomSheet'
import { usePlatform } from '../../hooks/usePlatform'

const REFUND_CONDITIONS = [
  '마지막 충전 후 잔액을 기준으로, 잔액의 40% 이하 금액을 환불 받을 수 있습니다.',
  '상품권 잔액 환불 시, 혜택금은 환수 처리됩니다.',
  '상품권 잔액은 수수료 없이 연결된 계좌로 환불됩니다.',
  '지자체 정책자금은 환불할 수 없습니다.',
]

export default function RefundGuideModal({ isOpen, onClose }) {
  const isAndroid = usePlatform() === 'android'
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="환불 안내">
      <div
        style={{
          padding: `${spacing[4]} ${layout.margin}`,
          fontFamily: typography.fontFamily,
        }}
      >
        <p style={{
          margin: `0 0 ${spacing[3]}`,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.semibold,
          color: colors.gray[900],
        }}>
          환불 가능 조건
        </p>

        {REFUND_CONDITIONS.map((text, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: spacing[3],
              marginBottom: spacing[3],
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: colors.primary[700],
                marginTop: '8px',
              }}
            />
            <div
              style={{
                fontSize: typography.size.sm,
                color: colors.gray[700],
                lineHeight: 1.6,
              }}
            >
              {text}
            </div>
          </div>
        ))}

        {/* 안내 박스 */}
        <div
          style={{
            backgroundColor: colors.primary[50],
            borderRadius: layout.radiusSmall,
            padding: spacing[3],
            marginTop: spacing[4],
            marginBottom: spacing[5],
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: typography.size.xs,
              color: colors.primary[700],
              lineHeight: 1.6,
            }}
          >
            환불 정책은 대구광역시 지역화폐 운영 규정에 따르며, 사전 공지 없이 변경될 수 있습니다.
          </p>
        </div>

        {/* 확인 버튼 */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '52px',
            backgroundColor: colors.primary[700],
            color: colors.onDark.primary,
            border: 'none',
            borderRadius: isAndroid ? layout.radiusPill : layout.radiusButton,
            fontSize: typography.size.md,
            fontWeight: typography.weight.semibold,
            cursor: 'pointer',
            marginBottom: spacing[4],
            boxShadow: shadow.button,
          }}
        >
          확인했습니다
        </button>
      </div>
    </BottomSheet>
  )
}
