// usage-guide/PhoneFrame.jsx
// 이용안내 미니 렌더를 담는 폰 프레임 (이미지5~8 톤)
// 실제 앱 화면(390px 기준)을 scale로 축소해 프레임 안에 표시
// children = 미니 렌더 컴포넌트 (ChargeMini 등)

import { colors, layout, spacing } from '../../tokens/tokens'

// props:
//   children: 내부 화면 (390px 기준으로 렌더됨)
//   scale: 축소 비율 (기본 0.62)
//   screenHeight: 내부 화면 논리 높이(px). 기본 600
export default function PhoneFrame({ children, scale = 0.62, screenHeight = 600 }) {
    const LOGICAL_WIDTH = 390              // 앱 기준 너비
    const frameW = LOGICAL_WIDTH * scale   // 축소된 실제 표시 너비
    const frameH = screenHeight * scale    // 축소된 실제 표시 높이

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `${spacing[5]} 0`,
        }}>
            {/* 폰 외곽 (베젤) */}
            <div style={{
                width: `${frameW + 16}px`,
                borderRadius: '36px',
                backgroundColor: colors.surface.card,
                padding: '8px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)',
                border: `1px solid ${colors.gray[200]}`,
            }}>
                {/* 스크린 (둥근 모서리 + 클립) */}
                <div style={{
                    width: `${frameW}px`,
                    height: `${frameH}px`,
                    borderRadius: '28px',
                    overflow: 'hidden',
                    backgroundColor: colors.surface.background,
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}>
                    {/* 내부 화면 — 390px 논리 너비로 렌더 후 scale 축소 */}
                    <div style={{
                        width: `${LOGICAL_WIDTH}px`,
                        height: `${screenHeight}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        display: 'flex',
                        flexDirection: 'column',
                        flexShrink: 0,
                    }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}