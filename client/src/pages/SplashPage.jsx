import LogoWhite from '../assets/logos/logo-white.svg'
import { colors, typography, spacing } from '../tokens/tokens'

export default function SplashPage() {
  return (
    <div style={{
      width: '100%',
      flex: 1,
      backgroundColor: colors.primary[700],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[4],
      fontFamily: typography.fontFamily,
    }}>
      <img
        src={LogoWhite}
        alt="iM샵"
        style={{
          width: '80px',
          height: 'auto',
        }}
      />
      <span style={{
        color: colors.onDark.primary,
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold,
        letterSpacing: '-0.02em',
      }}>
        iM샵
      </span>
    </div>
  )
}
