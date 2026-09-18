// LanguageSheet.jsx — S04 (p.37)
// 언어 선택 바텀시트

// 색 하드코딩 예외: 아래 hex는 각국 국기의 고정 규격색이다.
// 브랜드색이 아니므로 tokens.js에 넣지 않고 리브랜딩 치환 대상에서도 제외한다.

import { Check } from 'lucide-react'
import { colors, typography, layout, spacing } from '../../tokens/tokens'
import BottomSheet from './BottomSheet'

const LANGUAGES = [
  {
    code: 'ko',
    label: '한국어',
    flag: (
      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="16" rx="2" fill="#FFFFFF" />
        <rect width="24" height="5.33" fill="#C60C30" />
        <rect y="10.67" width="24" height="5.33" fill="#003478" />
        {/* 태극 원 */}
        <circle cx="12" cy="8" r="3.5" fill="#C60C30" />
        <path d="M12 4.5 A3.5 3.5 0 0 1 12 11.5" fill="#003478" />
      </svg>
    ),
  },
  {
    code: 'en',
    label: 'English',
    flag: (
      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="16" rx="2" fill="#012169" />
        {/* 흰 사선 */}
        <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFFFFF" strokeWidth="2.5" />
        {/* 빨간 사선 */}
        <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.2" />
        {/* 가로 세로 십자 */}
        <rect x="10" y="0" width="4" height="16" fill="#FFFFFF" />
        <rect x="0" y="6" width="24" height="4" fill="#FFFFFF" />
        <rect x="11" y="0" width="2" height="16" fill="#C8102E" />
        <rect x="0" y="7" width="24" height="2" fill="#C8102E" />
      </svg>
    ),
  },
  {
    code: 'zh',
    label: '中文(简体)',
    flag: (
      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="16" rx="2" fill="#DE2910" />
        {/* 큰 별 */}
        <polygon points="4,3 4.9,5.8 7.8,5.8 5.5,7.4 6.4,10.2 4,8.5 1.6,10.2 2.5,7.4 0.2,5.8 3.1,5.8" fill="#FFDE00" />
        {/* 작은 별들 */}
        <polygon points="9,1 9.6,2.7 11.4,2.7 9.9,3.7 10.5,5.4 9,4.4 7.5,5.4 8.1,3.7 6.6,2.7 8.4,2.7" fill="#FFDE00" transform="scale(0.55) translate(7,0)" />
        <polygon points="11,3.5 11.5,5 13,5 11.8,5.9 12.3,7.4 11,6.4 9.7,7.4 10.2,5.9 9,5 10.5,5" fill="#FFDE00" transform="scale(0.55) translate(5,2)" />
        <polygon points="11,6.5 11.5,8 13,8 11.8,8.9 12.3,10.4 11,9.4 9.7,10.4 10.2,8.9 9,8 10.5,8" fill="#FFDE00" transform="scale(0.55) translate(5,5)" />
        <polygon points="9,9 9.6,10.7 11.4,10.7 9.9,11.7 10.5,13.4 9,12.4 7.5,13.4 8.1,11.7 6.6,10.7 8.4,10.7" fill="#FFDE00" transform="scale(0.55) translate(7,7)" />
      </svg>
    ),
  },
  {
    code: 'ja',
    label: '日本語',
    flag: (
      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="16" rx="2" fill="#FFFFFF" />
        <circle cx="12" cy="8" r="4.5" fill="#BC002D" />
      </svg>
    ),
  },
  {
    code: 'vi',
    label: 'Tiếng Việt',
    flag: (
      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="16" rx="2" fill="#DA251D" />
        {/* 황금 별 */}
        <polygon
          points="12,3.5 13.2,7.2 17.1,7.2 14,9.4 15.2,13.1 12,10.9 8.8,13.1 10,9.4 6.9,7.2 10.8,7.2"
          fill="#FFCD00"
        />
      </svg>
    ),
  },
]

export default function LanguageSheet({ isOpen, onClose, selected, onSelect }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="언어 선택">
      <div style={{ paddingBottom: spacing[6] }}>
        {LANGUAGES.map(({ code, label, flag }) => {
          const isSelected = selected === code
          return (
            <button
              key={code}
              onClick={() => onSelect && onSelect(code)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${spacing[4]} ${layout.margin}`,
                background: 'none',
                border: 'none',
                borderBottom: `1px solid ${colors.gray[100]}`,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                {/* 장식 예외: 국기 16px 높이의 미세한 라운딩 */}
                <div
                  style={{
                    width: '24px',
                    height: '16px',
                    flexShrink: 0,
                    borderRadius: '2px',
                    overflow: 'hidden',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.06)',
                  }}
                >
                  {flag}
                </div>
                <span
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: isSelected ? typography.weight.semibold : typography.weight.regular,
                    color: isSelected ? colors.primary[700] : colors.gray[900],
                  }}
                >
                  {label}
                </span>
              </div>
              {isSelected && (
                <Check size={18} color={colors.primary[700]} strokeWidth={2.5} />
              )}
            </button>
          )
        })}
      </div>
    </BottomSheet>
  )
}
