import Logo from '../assets/logos/logo.png'
import SplashWordmark from '../assets/logos/splash.svg'
import { colors, typography, spacing } from '../tokens/tokens'

export default function SplashPage() {
  return (
    <div style={{
      width: '100%',
      flex: 1,
      // 08차 6번: 전사.md 원문 S42엔 색 관찰이 없지만, 바로 앞뒤 실캡처(S01 "배경 화이트")
      // 기준으로 흰 배경 + 어두운 텍스트가 실제에 가깝다. 이전엔 근거 없이 보라+흰색으로 잘못 잡았다.
      backgroundColor: colors.surface.card,
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
          color: colors.gray[900],
          fontSize: typography.size.xl,
          fontWeight: typography.weight.bold,
          letterSpacing: '-0.02em',
        }}>
          iM샵
        </span>
      </div>

      {/* 07차: 전사.md S42 실캡처 하단 저작권 표기. 메인 로고(80px)보다 훨씬 작게 —
          브랜드처럼 보이면 안 돼서 단색으로 눌러 원색(iM Bank 워드마크)을 뺐다.
          08차: 배경이 흰색으로 바뀌어 검정 단색(brightness(0))으로 조정 — invert(1)이면 흰 배경에 안 보인다. */}
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
            opacity: 0.6,
            filter: 'brightness(0)',
          }}
        />
        <span style={{
          color: colors.gray[500],
          fontSize: typography.size.xxs,
          letterSpacing: '-0.01em',
        }}>
          Copyright ⓒ iM Bank. All Rights Reserved.
        </span>
      </div>
    </div>
  )
}
