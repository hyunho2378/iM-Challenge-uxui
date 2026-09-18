// UsageGuidePage.jsx — 미니 렌더 3탭
// 카드신청 / 충전 / 환불 — 각 단계마다 폰 프레임 + 실제 컴포넌트 스냅샷
// 이미지5~8 톤: 파란 그라디언트 배경, 단계 번호(01,02,03)

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, layout, typography, spacing } from '../tokens/tokens'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'
import PhoneFrame from '../components/usage-guide/PhoneFrame'
import HomeCoachMini from '../components/usage-guide/HomeCoachMini'
import ChargeMini from '../components/usage-guide/ChargeMini'
import CardApplyMini from '../components/usage-guide/CardApplyMini'
import RefundMini from '../components/usage-guide/RefundMini'

const TABS = ['카드 신청', '충전', '환불']

// 각 탭의 단계 정의: { no, title, desc, render }
const GUIDE = {
  0: { // 카드 신청
    intro: 'iM샵 카드를 신청하는 방법이에요.',
    steps: [
      { no: '01', title: '홈에서 카드 신청을 시작해요', desc: '홈 화면의 [신청하기] 버튼을 눌러 카드 신청을 시작해요.', render: <HomeCoachMini variant="cardApply" />, h: 600 },
      { no: '02', title: '혜택받을 카드를 선택해요', desc: 'iM샵 카드의 혜택을 확인하고 [간편 신청하기]를 눌러주세요.', render: <CardApplyMini step="select" />, h: 760 },
      { no: '03', title: '배송 완료 후 카드를 등록해요', desc: '카드가 배송되면 앞면 16자리 번호를 입력해 등록해주세요.', render: <CardApplyMini step="shipped" />, h: 600 },
    ],
  },
  1: { // 충전
    intro: 'iM샵을 충전하는 방법이에요.',
    steps: [
      { no: '01', title: '홈에서 충전을 시작해요', desc: '홈 잔액 카드의 [충전] 버튼을 눌러주세요.', render: <HomeCoachMini variant="charge" />, h: 620 },
      { no: '02', title: '충전 금액을 입력해요', desc: '빠른 금액 버튼을 누르거나 직접 입력한 뒤 [다음]을 눌러주세요.', render: <ChargeMini step={1} amount={50000} balance={120000} />, h: 720 },
      { no: '03', title: '충전 내용을 확인해요', desc: '충전 금액과 충전 후 잔액을 확인하고 [충전하기]를 눌러주세요.', render: <ChargeMini step={2} amount={50000} balance={120000} />, h: 600 },
      { no: '04', title: '충전이 완료돼요', desc: '얼굴인증이 끝나면 즉시 충전이 완료됩니다.', render: <ChargeMini step={3} amount={50000} balance={120000} />, h: 600 },
    ],
  },
  2: { // 환불
    intro: '충전한 금액을 환불하는 방법이에요.',
    steps: [
      { no: '01', title: '홈에서 환불을 시작해요', desc: '홈 잔액 카드의 [환불] 버튼을 눌러주세요.', render: <HomeCoachMini variant="refund" />, h: 620 },
      { no: '02', title: '충전 내역에서 환불을 선택해요', desc: '환불 가능한 충전 건의 [환불] 버튼을 눌러주세요. 조건 미충족 시 사유가 표시됩니다.', render: <RefundMini step="list" balance={112671} />, h: 720 },
      { no: '03', title: '환불 내용을 확인하고 신청해요', desc: '환불 금액을 확인하고 [신청하기]를 누르면 얼굴인증 후 환불이 진행됩니다.', render: <RefundMini step="confirm" balance={112671} />, h: 720 },
    ],
  },
}

export default function UsageGuidePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const contentRef = useRef(null)
  const guide = GUIDE[activeTab]

  return (
    <ScreenContainer statusBarBg={colors.surface.card}>
      <TopAppBarBack title="이용안내" onBack={() => navigate(-1)} />

      {/* 탭 바 */}
      <div style={{
        display: 'flex', backgroundColor: colors.surface.card,
        borderBottom: `1px solid ${colors.gray[200]}`, flexShrink: 0,
      }}>
        {TABS.map((tab, index) => (
          <button
            key={index}
            onClick={() => {
                setActiveTab(index)
                if (contentRef.current) contentRef.current.scrollTop = 0
              }}
            style={{
              flex: 1, padding: '13px 0', background: 'none', border: 'none',
              borderBottom: activeTab === index ? `2px solid ${colors.primary[700]}` : '2px solid transparent',
              color: activeTab === index ? colors.primary[700] : colors.gray[500],
              fontSize: typography.size.sm,
              fontWeight: activeTab === index ? typography.weight.semibold : typography.weight.medium,
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: typography.fontFamily,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 콘텐츠 — 파란 그라디언트 배경 (이미지5~8 톤) */}
      <div
        ref={contentRef}
        style={{
          flex: 1, overflowY: 'auto',
          background: `linear-gradient(180deg, ${colors.primary[50]} 0%, ${colors.surface.background} 100%)`,
          padding: `${spacing[5]} ${layout.margin} ${spacing[10]}`,
        }}
      >
        {/* 인트로 */}
        <p style={{
          margin: `0 0 ${spacing[6]}`, textAlign: 'center', fontSize: typography.size.sm,
          color: colors.gray[600], fontFamily: typography.fontFamily, lineHeight: 1.5,
        }}>
          {guide.intro}
        </p>

        {/* 단계별 */}
        {guide.steps.map((s, i) => (
          <div key={i} style={{ marginBottom: spacing[8] }}>
            {/* 단계 번호 */}
            <div style={{ textAlign: 'center', marginBottom: spacing[2] }}>
              <span style={{
                display: 'inline-block', fontSize: typography.size.xl, fontWeight: typography.weight.bold,
                color: colors.primary[700], fontFamily: typography.fontFamily,
              }}>
                {s.no}
              </span>
            </div>
            {/* 제목 */}
            <p style={{
              margin: `0 0 ${spacing[2]}`, textAlign: 'center', fontSize: typography.size.lg,
              fontWeight: typography.weight.bold, color: colors.gray[900], fontFamily: typography.fontFamily, lineHeight: 1.4,
            }}>
              {s.title}
            </p>
            {/* 설명 */}
            <p style={{
              margin: `0 auto ${spacing[2]}`, maxWidth: '300px', textAlign: 'center', fontSize: typography.size.sm,
              color: colors.gray[500], fontFamily: typography.fontFamily, lineHeight: 1.6,
            }}>
              {s.desc}
            </p>
            {/* 폰 프레임 + 미니 렌더 */}
            <PhoneFrame scale={0.62} screenHeight={s.h}>
              {s.render}
            </PhoneFrame>
          </div>
        ))}

        {/* 하단 안내 */}
        <div style={{
          backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, padding: layout.margin,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <p style={{ margin: `0 0 ${spacing[1]}`, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.primary[700], fontFamily: typography.fontFamily }}>
            더 궁금한 점이 있으신가요?
          </p>
          <p style={{ margin: 0, fontSize: typography.size.xs, color: colors.gray[500], fontFamily: typography.fontFamily, lineHeight: 1.5 }}>
            고객센터 1566-4335 (평일 09:00~18:00)
          </p>
        </div>
      </div>
    </ScreenContainer>
  )
}