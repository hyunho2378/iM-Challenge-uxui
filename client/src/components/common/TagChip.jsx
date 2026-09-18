import { colors, typography, layout, spacing } from '../../tokens/tokens'

const VARIANT_STYLES = {
  service: {
    bg: colors.primary[100],
    color: colors.primary[700],
  },
  cash: {
    bg: colors.tag.cashBg,
    color: colors.tag.cashText,
  },
  voucher: {
    bg: colors.tag.voucherBg,
    color: colors.tag.voucherText,
  },
  default: {
    bg: colors.gray[100],
    color: colors.gray[700],
  },
}

export default function TagChip({ label = '태그', variant = 'default' }) {
  const style = VARIANT_STYLES[variant] || VARIANT_STYLES.default

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: style.bg,
        color: style.color,
        fontSize: typography.size.xxs,
        fontWeight: typography.weight.semibold,
        borderRadius: layout.radiusPill,
        paddingTop: '3px',
        paddingBottom: '3px',
        paddingLeft: spacing[2],
        paddingRight: spacing[2],
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
