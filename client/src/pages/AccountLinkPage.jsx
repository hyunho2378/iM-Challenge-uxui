// AccountLinkPage.jsx: 연결계좌 등록 (은행/증권 선택)
// 05차 지시서 3번, 신규 화면. 출처: 전사.md S10(PAY-01).
// to-be 개선 2가지: ① 원본에 없던 검색 추가(본인 은행을 40개 로고에서 찾는 장벽 해소)
// ② AI 개입지점 1: 일정 시간 못 고르면 "어떤 은행 쓰세요?" 개입 → 찾아서 스크롤+하이라이트.
// 계좌번호 자체는 다루지 않는다(온디바이스 문자열 매칭만, 정보최소 원칙).
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { colors, layout, typography, spacing, shadow } from '../tokens/tokens'
import { BANKS, SECURITIES } from '../data/bankData'
import { useUser } from '../context/UserContext'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'

const IDLE_MS = 8000 // 8초간 선택 없으면 개입

function InstitutionGrid({ items, query, highlightId, onSelect }) {
  const filtered = query
    ? items.filter((it) => it.name.toLowerCase().includes(query.toLowerCase()))
    : items

  if (filtered.length === 0) {
    return (
      <div style={{ padding: `${spacing[8]} ${layout.margin}`, textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: typography.size.sm, color: colors.gray[500] }}>
          검색 결과가 없어요
        </p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: spacing[3],
      padding: `${spacing[3]} ${layout.margin} ${spacing[6]}`,
    }}>
      {filtered.map((item) => (
        <button
          key={item.id}
          id={item.id}
          onClick={() => onSelect(item)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
            padding: spacing[3],
            borderRadius: layout.radiusButton,
            border: highlightId === item.id ? `2px solid ${colors.primary[700]}` : `1px solid ${colors.gray[200]}`,
            backgroundColor: highlightId === item.id ? colors.primary[50] : colors.surface.card,
            cursor: 'pointer',
            minHeight: layout.touchMin,
            transition: 'background-color 200ms cubic-bezier(0.23,1,0.32,1), border-color 200ms cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <span style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: colors.gray[100],
            color: colors.gray[600],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            flexShrink: 0,
          }}>
            {item.name[0]}
          </span>
          <span style={{ fontSize: typography.size.sm, color: colors.gray[900], textAlign: 'left' }}>
            {item.name}
          </span>
        </button>
      ))}
    </div>
  )
}

export default function AccountLinkPage() {
  const navigate = useNavigate()
  const { linkAccount } = useUser()
  const [tab, setTab] = useState('은행')
  const [query, setQuery] = useState('')
  const [showAssist, setShowAssist] = useState(false)
  const [assistInput, setAssistInput] = useState('')
  const [assistNotFound, setAssistNotFound] = useState(false)
  const [highlightId, setHighlightId] = useState(null)
  const idleTimerRef = useRef(null)

  // AI 개입지점 1: 일정 시간 스크롤만 하고 못 고르면 개입 배너를 띄운다.
  // 검색을 이미 쓰고 있으면(query 입력) 스스로 찾고 있는 것이므로 개입하지 않는다.
  useEffect(() => {
    if (query || showAssist) return
    idleTimerRef.current = setTimeout(() => setShowAssist(true), IDLE_MS)
    return () => clearTimeout(idleTimerRef.current)
  }, [query, showAssist])

  const handleSelect = (item) => {
    linkAccount(item.name)
    navigate(-1)
  }

  const handleAssistSubmit = () => {
    const q = assistInput.trim().toLowerCase()
    if (!q) return
    const match = [...BANKS, ...SECURITIES].find((it) => it.name.toLowerCase().includes(q))
    if (!match) {
      setAssistNotFound(true)
      return
    }
    const isBank = BANKS.some((b) => b.id === match.id)
    setTab(isBank ? '은행' : '증권')
    setAssistNotFound(false)
    setShowAssist(false)
    setHighlightId(match.id)
    // 탭 전환 렌더 이후 스크롤. 다음 프레임에 실행
    requestAnimationFrame(() => {
      document.getElementById(match.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    setTimeout(() => setHighlightId(null), 2500)
  }

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="연결계좌 등록" onBack={() => navigate(-1)} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', backgroundColor: colors.surface.background }}>
        {/* 안내 타이틀. S10 카피원문 */}
        <div style={{ padding: `${spacing[4]} ${layout.margin} ${spacing[3]}`, backgroundColor: colors.surface.card }}>
          <p style={{ margin: 0, fontSize: typography.size.md, fontWeight: typography.weight.bold, color: colors.gray[900], lineHeight: typography.lineHeight.body }}>
            연결 계좌로 등록할 계좌의 은행/증권을 선택해주세요.
          </p>
        </div>

        {/* 검색. to-be 추가: 40개 로고에서 직접 찾는 장벽을 없앤다 */}
        <div style={{ padding: `${spacing[2]} ${layout.margin} ${spacing[3]}`, backgroundColor: colors.surface.card }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            backgroundColor: colors.gray[50],
            borderRadius: layout.radiusButton,
            padding: `0 ${spacing[3]}`,
            height: layout.touchMin,
          }}>
            <Search size={18} color={colors.gray[400]} strokeWidth={2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="은행 또는 증권사 이름 검색"
              style={{
                flex: 1,
                border: 'none',
                background: 'none',
                outline: 'none',
                fontSize: typography.size.sm,
                color: colors.gray[900],
                fontFamily: typography.fontFamily,
                minHeight: layout.touchMin,
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                <X size={16} color={colors.gray[400]} />
              </button>
            )}
          </div>
        </div>

        {/* 은행/증권 탭 */}
        <div style={{ display: 'flex', backgroundColor: colors.surface.card, borderBottom: `1px solid ${colors.gray[100]}` }}>
          {['은행', '증권'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: `${spacing[3]} 0`,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: typography.size.sm,
                fontWeight: tab === t ? typography.weight.bold : typography.weight.regular,
                color: tab === t ? colors.primary[700] : colors.gray[400],
                borderBottom: tab === t ? `2px solid ${colors.primary[700]}` : '2px solid transparent',
                minHeight: layout.touchMin,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <InstitutionGrid
          items={tab === '은행' ? BANKS : SECURITIES}
          query={query}
          highlightId={highlightId}
          onSelect={handleSelect}
        />
      </div>

      {/* AI 개입지점 1. 감지형. 계좌번호는 만지지 않는다(정보최소) */}
      {showAssist && (
        <div style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: `calc(env(safe-area-inset-bottom) + ${spacing[4]})`,
          width: 'calc(100% - 32px)',
          maxWidth: `calc(${layout.viewport} - 32px)`,
          backgroundColor: colors.surface.card,
          borderRadius: layout.radiusCard,
          boxShadow: shadow.modal,
          padding: spacing[4],
          zIndex: 300,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[3] }}>
            <p style={{ margin: 0, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
              어떤 은행을 쓰시는지 말씀해주시면 찾아드릴게요
            </p>
            <button onClick={() => setShowAssist(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <X size={18} color={colors.gray[400]} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: spacing[2] }}>
            <input
              value={assistInput}
              onChange={(e) => { setAssistInput(e.target.value); setAssistNotFound(false) }}
              onKeyDown={(e) => e.key === 'Enter' && handleAssistSubmit()}
              placeholder="예: 국민은행"
              style={{
                flex: 1,
                border: `1px solid ${colors.gray[200]}`,
                borderRadius: layout.radiusButton,
                padding: `0 ${spacing[3]}`,
                height: layout.touchMin,
                fontSize: typography.size.sm,
                fontFamily: typography.fontFamily,
                outline: 'none',
              }}
            />
            <button
              onClick={handleAssistSubmit}
              style={{
                flexShrink: 0,
                padding: `0 ${spacing[4]}`,
                height: layout.touchMin,
                borderRadius: layout.radiusButton,
                border: 'none',
                backgroundColor: colors.primary[700],
                color: colors.onDark.primary,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                cursor: 'pointer',
              }}
            >
              찾기
            </button>
          </div>
          {assistNotFound && (
            <p style={{ margin: `${spacing[2]} 0 0`, fontSize: typography.size.xs, color: colors.error }}>
              일치하는 은행을 찾지 못했어요. 위 검색창에 직접 입력해보세요
            </p>
          )}
        </div>
      )}
    </ScreenContainer>
  )
}
