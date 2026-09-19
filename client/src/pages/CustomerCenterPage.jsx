// CustomerCenterPage.jsx: 고객센터 FAQ 아코디언
// 05차 지시서 3번: iM샵 실캡처(CS-01/CS-02, 전사.md) 기준 재작성.
// 카테고리 칩과 탭 구조는 실제 화면 그대로다. "대구로페이" 카테고리만 실제 19문항 데이터가 있고
// 나머지 카테고리는 캡처가 없어 데이터를 지어내지 않는다(빈 상태로 정직하게 표시).
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { colors, layout, typography, spacing, shadow } from '../tokens/tokens'
import { FAQ_CATEGORIES, FAQ_ITEMS } from '../data/faqData'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'

const TABS = ['자주하는 질문', '1:1문의', '문의내역']

function FAQAccordionItem({ item, isOpen, onToggle }) {
  return (
    <div style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: spacing[3],
          padding: `${spacing[4]} ${layout.margin}`,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          minHeight: layout.touchMin,
        }}
      >
        <div style={{ display: 'flex', gap: spacing[2], flex: 1 }}>
          <span style={{ fontSize: typography.size.sm, fontWeight: typography.weight.bold, color: colors.primary[700], flexShrink: 0 }}>Q</span>
          <span style={{ fontSize: typography.size.sm, color: colors.gray[900], lineHeight: typography.lineHeight.body }}>{item.question}</span>
        </div>
        <ChevronDown
          size={20}
          color={colors.gray[400]}
          strokeWidth={1.8}
          style={{
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 160ms cubic-bezier(0.23,1,0.32,1)',
          }}
        />
      </button>
      {isOpen && (
        <div style={{ padding: `0 ${layout.margin} ${spacing[4]}`, display: 'flex', gap: spacing[2] }}>
          <span style={{ fontSize: typography.size.sm, fontWeight: typography.weight.bold, color: colors.gray[400], flexShrink: 0 }}>A</span>
          <p style={{
            margin: 0,
            fontSize: typography.size.sm,
            color: colors.gray[700],
            lineHeight: typography.lineHeight.body,
            whiteSpace: 'pre-wrap',
            backgroundColor: colors.gray[50],
            borderRadius: layout.radiusSmall,
            padding: spacing[3],
            flex: 1,
          }}>
            {item.answer}
          </p>
        </div>
      )}
    </div>
  )
}

export default function CustomerCenterPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('대구로페이')
  const [openId, setOpenId] = useState(null)

  const items = FAQ_ITEMS[category] || []

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="고객센터" onBack={() => navigate(-1)} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: colors.surface.background }}>
        {/* 탭. 자주하는 질문만 이번 스코프에서 지원 */}
        <div style={{ display: 'flex', backgroundColor: colors.surface.card, borderBottom: `1px solid ${colors.gray[100]}` }}>
          {TABS.map((tab, i) => (
            <div
              key={tab}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: `${spacing[3]} 0`,
                fontSize: typography.size.sm,
                fontWeight: i === 0 ? typography.weight.bold : typography.weight.regular,
                color: i === 0 ? colors.primary[700] : colors.gray[400],
                borderBottom: i === 0 ? `2px solid ${colors.primary[700]}` : '2px solid transparent',
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* 카테고리 칩. 가로 스크롤 */}
        <div style={{
          display: 'flex',
          gap: spacing[2],
          padding: `${spacing[3]} ${layout.margin}`,
          overflowX: 'auto',
          backgroundColor: colors.surface.card,
        }}>
          {FAQ_CATEGORIES.map((cat) => {
            const active = cat === category
            return (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setOpenId(null) }}
                style={{
                  flexShrink: 0,
                  padding: `${spacing[2]} ${spacing[3]}`,
                  borderRadius: layout.radiusPill,
                  border: active ? 'none' : `1px solid ${colors.gray[200]}`,
                  backgroundColor: active ? colors.primary[700] : colors.surface.card,
                  color: active ? colors.onDark.primary : colors.gray[700],
                  fontSize: typography.size.sm,
                  fontWeight: active ? typography.weight.semibold : typography.weight.regular,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  minHeight: layout.touchMin,
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* FAQ 리스트 */}
        <div style={{ backgroundColor: colors.surface.card, marginTop: spacing[2] }}>
          {items.length > 0 ? (
            items.map((item) => (
              <FAQAccordionItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            ))
          ) : (
            <div style={{ padding: `${spacing[8]} ${layout.margin}`, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: typography.size.sm, color: colors.gray[500] }}>
                이 카테고리에는 아직 질문이 없어요
              </p>
            </div>
          )}
        </div>

        {/* 전화 상담 */}
        <div style={{ padding: `${spacing[4]} ${layout.margin}` }}>
          <div style={{
            backgroundColor: colors.surface.card,
            borderRadius: layout.radiusCard,
            padding: spacing[5],
            boxShadow: shadow.card,
          }}>
            <p style={{ fontSize: typography.size.xs, fontWeight: typography.weight.semibold, color: colors.gray[500], margin: `0 0 ${spacing[3]}` }}>
              전화 상담
            </p>
            <p style={{ fontSize: typography.size.md, fontWeight: typography.weight.bold, color: colors.primary[700], margin: 0 }}>
              1588-5050
            </p>
            <p style={{ fontSize: typography.size.xs, color: colors.gray[500], margin: `${spacing[1]} 0 0` }}>
              평일 09:00 ~ 18:00 (점심 12:00~13:00)
            </p>
          </div>
        </div>
      </div>
    </ScreenContainer>
  )
}
