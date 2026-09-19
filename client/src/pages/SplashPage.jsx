import Logo from '../assets/logos/logo.png'
import SplashWordmark from '../assets/logos/splash.svg'
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
      fontFamily: typography.fontFamily,
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[4],
      }}>
        <img
          src={Logo}
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

      {/* 07차: 전사.md S42 실캡처 하단 저작권 표기. 메인 로고(80px)보다 훨씬 작게 —
          브랜드처럼 보이면 안 돼서 흰색 단색으로 눌러 원색(iM Bank 워드마크)을 뺐다. */}
      <div style={{
        flexShrink: 0,
        paddingBottom: spacing[6],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing[1],
      }}>
        <img
          src={SplashWordmark}
          alt="iM Bank"
          style={{
            width: '40px',
            height: 'auto',
            opacity: 0.7,
            filter: 'brightness(0) invert(1)',
          }}
        />
        <span style={{
          color: colors.onDark.secondary,
          fontSize: typography.size.xxs,
          letterSpacing: '-0.01em',
        }}>
          Copyright ⓒ iM Bank. All Rights Reserved.
        </span>
      </div>
    </div>
  )
}
