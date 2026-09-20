/**
 * DesignSystemPage (/design-system)
 *
 * 레이아웃 뼈대: 섹션 헤더, 항목마다 [항목명 | iOS | Android] 3열 그리드 →
 * 컴포넌트 아래 최소 수치. 주인공은 살아있는 컴포넌트고 수치는 보조다.
 *
 * 두 열 모두 앱이 쓰는 실제 컴포넌트를 import해서 렌더한다.
 * 플랫폼은 usePlatform()의 PlatformOverrideContext로 열마다 강제한다.
 * 오버라이드 기본값이 null이라 앱 화면 동작은 바뀌지 않는다.
 *
 * 색은 tokens.js만 쓴다. iOS와 Android 구분은 색이 아니라 라벨 글자로 한다.
 */

import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Search, Utensils, Coffee } from 'lucide-react'

import { colors, typography, layout, spacing, shadow } from '../tokens/tokens'
import { PlatformOverrideContext } from '../hooks/usePlatform'
import { useApp } from '../context/AppContext'

// 실제 앱 컴포넌트
import StatusBar from '../components/layout/StatusBar'
import StatusBarAndroid from '../components/layout/StatusBarAndroid'
import TopAppBarBack from '../components/layout/TopAppBarBack'
import BottomNavBar from '../components/layout/BottomNavBar'
import Button from '../components/common/Button'
import CategoryFilterChip from '../components/store/CategoryFilterChip'
import BottomSheet from '../components/common/BottomSheet'
import Snackbar from '../components/common/Snackbar'
import PaymentAuthOverlay from '../components/common/PaymentAuthOverlay'

const IOS = 'ios'
const AND = 'android'

// 레퍼런스 레이아웃의 간격 체계를 그대로 쓴다
const SHELL = {
  container: '1440px',
  gut: 'clamp(20px, 5vw, 80px)',
  sectionY: 'clamp(40px, 5vw, 72px)',
  rowY: 'clamp(20px, 2.4vw, 32px)',
  // 좌측 라벨 열이 132px였을 때 설명 문장이 한 글자씩 세로로 쪼개졌다. 220px로 넓힌다.
  colGrid: 'minmax(220px, 240px) 1fr 1fr',
  colGap: 'clamp(16px, 1.6vw, 28px)',
  // 항목 행의 흰 띠가 컨테이너 여백선에서 바로 시작해 글자가 띠 왼쪽 끝에 붙었다.
  // 띠만 바깥으로 밀고 글자는 헤더와 같은 여백선에 그대로 둔다.
  rowInset: 'clamp(16px, 1.6vw, 24px)',
}

function Platform({ value, children }) {
  return (
    <PlatformOverrideContext.Provider value={value}>
      {children}
    </PlatformOverrideContext.Provider>
  )
}

/**
 * position:fixed 컴포넌트를 문서 안에 가둔다.
 * transform이 걸린 조상은 fixed의 컨테이닝 블록이 되므로 화면 전체로 퍼지지 않는다.
 */
function Stage({ height = 200, children, android = false, bg = colors.surface.background }) {
  return (
    <div
      className={android ? 'ds-force-noto' : 'ds-force-apple'}
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        width: '100%',
        maxWidth: 390,
        height,
        overflow: 'hidden',
        backgroundColor: bg,
        border: `1px solid ${colors.gray[200]}`,
        borderRadius: layout.radiusCard,
      }}
    >
      {children}
    </div>
  )
}

// 컴포넌트 아래 최소 수치. 구분 기호를 쓰지 않고 줄로 나눈다.
function Facts({ items }) {
  return (
    <dl style={{ margin: `${spacing[3]} 0 0`, display: 'flex', flexWrap: 'wrap', gap: `4px ${spacing[4]}` }}>
      {items.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
          <dt style={{ fontSize: 12, color: colors.gray[400], fontWeight: typography.weight.medium }}>{k}</dt>
          <dd style={{
            margin: 0,
            fontSize: 12,
            color: colors.gray[700],
            fontWeight: typography.weight.semibold,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}>
            {v}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function ColumnHead() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: SHELL.colGrid,
      columnGap: SHELL.colGap,
      borderBottom: `2px solid ${colors.gray[200]}`,
      paddingBottom: 12,
      paddingLeft: SHELL.rowInset,
      paddingRight: SHELL.rowInset,
      margin: `0 calc(-1 * ${SHELL.rowInset})`,
    }}>
      <div />
      <div style={{ padding: `0 ${spacing[5]}`, fontSize: 14, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: colors.primary[700] }}>
        iOS, HIG
      </div>
      <div style={{ padding: `0 ${spacing[5]}`, fontSize: 14, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: colors.primary[700] }}>
        Android, MD3
      </div>
    </div>
  )
}

/** 항목 한 줄. 왼쪽 항목명, 가운데 iOS 컴포넌트, 오른쪽 Android 컴포넌트, 각 아래 최소 수치. */
function Row({ index, name, summary, ios, android, iosFacts, androidFacts }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: SHELL.colGrid,
      columnGap: SHELL.colGap,
      borderBottom: `1px solid ${colors.gray[200]}`,
      backgroundColor: index % 2 === 0 ? colors.surface.card : 'transparent',
      alignItems: 'start',
      paddingLeft: SHELL.rowInset,
      paddingRight: SHELL.rowInset,
      margin: `0 calc(-1 * ${SHELL.rowInset})`,
    }}>
      <div style={{ padding: `${SHELL.rowY} 0` }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: colors.gray[400], margin: 0 }}>
          {String(index + 1).padStart(2, '0')}
        </p>
        <p style={{ fontSize: 17, fontWeight: 700, color: colors.gray[900], margin: '6px 0 0', letterSpacing: '-0.01em' }}>
          {name}
        </p>
        {summary && (
          <p style={{ fontSize: 13, color: colors.gray[500], margin: '8px 0 0', lineHeight: 1.6, wordBreak: 'keep-all' }}>
            {summary}
          </p>
        )}
      </div>
      <div style={{ padding: `${SHELL.rowY} ${spacing[5]}` }}>
        {ios}
        <Facts items={iosFacts} />
      </div>
      <div style={{ padding: `${SHELL.rowY} ${spacing[5]}` }}>
        {android}
        <Facts items={androidFacts} />
      </div>
    </div>
  )
}

// 검색창은 SearchPage 안에 인라인으로 있어 따로 뗄 컴포넌트가 없다.
// SearchPage.jsx의 style 객체를 그대로 옮겨 같은 DOM을 만든다.
function SearchField({ android, focused }) {
  return (
    <div style={{
      backgroundColor: colors.surface.card,
      borderBottom: `1px solid ${colors.gray[200]}`,
      padding: `${spacing[2]} ${layout.margin}`,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
        backgroundColor: android ? colors.gray[100] : undefined,
        border: android ? 'none' : `1px solid ${colors.gray[200]}`,
        borderBottom: android ? `2px solid ${focused ? colors.primary[700] : colors.gray[400]}` : undefined,
        borderRadius: android ? '8px 8px 0 0' : layout.radiusPill,
        padding: `${spacing[2]} ${spacing[4]}`,
      }}>
        <Search size={16} color={colors.gray[400]} strokeWidth={2} />
        <span style={{ flex: 1, fontSize: typography.size.sm, color: colors.gray[400] }}>매장 서비스 검색</span>
      </div>
    </div>
  )
}

// 코치마크는 떠 있는 동안 document.body 스크롤을 잠가 문서 안에 상주시킬 수 없다.
// CoachMarkOverlay.jsx의 스타일 값을 그대로 옮겨 같은 모양을 만든다.
function CoachMark({ android }) {
  const radius = android ? layout.radiusPill : layout.radiusButton
  const dim = colors.coach.dim
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 36, backgroundColor: dim }} />
      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, bottom: 0, backgroundColor: dim }} />
      <div style={{ position: 'absolute', top: 36, left: 0, width: 96, height: 60, backgroundColor: dim }} />
      <div style={{ position: 'absolute', top: 36, left: 264, right: 0, height: 60, backgroundColor: dim }} />
      <div style={{ position: 'absolute', top: 36, left: 96, width: 168, height: 60, borderRadius: radius, border: `2px solid ${colors.coach.spotBorder}` }} />
      <div style={{ position: 'absolute', left: spacing[4], right: spacing[4], top: 112 }}>
        <div style={{ backgroundColor: colors.surface.card, borderRadius: layout.radiusCard, padding: spacing[5], boxShadow: shadow.modal }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: i === 1 ? colors.primary[700] : colors.gray[200] }} />
            ))}
            <span style={{ fontSize: typography.size.xxs, color: colors.gray[400] }}>1 / 3</span>
          </div>
          <p style={{ margin: `0 0 ${spacing[4]}`, fontSize: typography.size.sm, color: colors.gray[900], lineHeight: 1.6, wordBreak: 'keep-all' }}>
            카드가 등록됐어요. 위에 잔액이 보이고 아래 세 버튼으로 충전과 환불과 QR결제를 모두 할 수 있습니다.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: typography.size.sm, color: colors.gray[500] }}>건너뛰기</span>
            <span style={{
              backgroundColor: colors.primary[700],
              borderRadius: radius,
              color: colors.onDark.primary,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.semibold,
              padding: `${spacing[2]} ${spacing[5]}`,
            }}>
              다음
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 생체인증은 2.5초에 한 번 끝나므로 끝나면 다시 열어 계속 돌게 둔다.
function AuthStage({ android }) {
  const [round, setRound] = useState(0)
  return (
    <Stage height={560} android={android} bg={colors.surface.card}>
      <Platform value={android ? AND : IOS}>
        <PaymentAuthOverlay
          key={round}
          open
          showSecureKeyboardNotice={false}
          onComplete={() => setRound((r) => r + 1)}
          onCancel={() => setRound((r) => r + 1)}
        />
      </Platform>
    </Stage>
  )
}

const ROUTES = [
  ['/', '홈'],
  ['/store', '결제매장'],
  ['/search', '검색'],
  ['/history', '이용내역'],
  ['/coupon', '쿠폰함'],
  ['/service-edit', '서비스 편집'],
  ['/settings', '설정'],
]

const CONTRAST = [
  ['주요 본문', 'gray.900 on card', 17.74, 4.5],
  ['주요 본문 (앱 배경)', 'gray.900 on background', 16.11, 4.5],
  ['보조 텍스트', 'gray.500 on card', 4.83, 4.5],
  ['보조 텍스트 (앱 배경)', 'gray.500 on background', 4.39, 4.5],
  ['placeholder와 비활성 탭', 'gray.400 on card', 2.54, 4.5],
  ['CTA 버튼 라벨', 'white on primary.700', 6.77, 4.5],
  ['활성 탭 라벨', 'primary.700 on card', 6.77, 4.5],
  ['Android 칩 활성 라벨', 'primary.700 on primary.100', 5.50, 4.5],
  ['잔액 카드 (대형 글자)', 'white on darkCard', 15.48, 3.0],
  ['스낵바 (Android)', 'white on gray.900', 17.74, 4.5],
  ['오류 텍스트', 'errorDark on alertBg', 4.41, 4.5],
]

const TYPE_SCALE = [
  ['largeTitle', 34, 44], ['balance', 28, 40], ['balanceLarge', 36, 48],
  ['appTitle', 22, 30], ['xl', 20, 26], ['lg', 18, 24], ['md', 17, 22],
  ['sm', 15, 20], ['xs', 13, 17], ['xxs', 12, 15], ['nav', 11, 14],
]

const TOUCH = [
  ['공통 버튼 lg', '52px', '48px', true],
  ['상단바 뒤로가기', '48 x 48', '48 x 48', true],
  ['바텀내비 탭', '78 x 49', '78 x 49', true],
  ['이용내역 최소 요소', '49px', '48px', true],
  ['결제매장 카테고리 칩', '39px', '39px', false],
  ['쿠폰함 카테고리 칩', '34px', '34px', false],
  ['홈 위젯 추가 배너', '30px', '30px', false],
  ['홈 전체보기 링크', '20px', '20px', false],
]

export default function DesignSystemPage() {
  const [chipIOS, setChipIOS] = useState('전체')
  const [chipAND, setChipAND] = useState('전체')
  const { showSnackbar } = useApp()

  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace'
  const shell = { maxWidth: SHELL.container, margin: '0 auto', padding: `0 ${SHELL.gut}` }

  const rows = [
    {
      name: '상태바',
      summary: '높이와 시계 크기가 각 OS 기본값',
      ios: <Stage height={78} bg={colors.surface.card}><StatusBar backgroundColor={colors.surface.card} /></Stage>,
      android: <Stage height={78} android bg={colors.surface.card}><StatusBarAndroid backgroundColor={colors.surface.card} /></Stage>,
      iosFacts: [['높이', '41px'], ['시계', '17px'], ['자간', '-0.5px'], ['위치', 'left 13%']],
      androidFacts: [['높이', '42px'], ['시계', '14px'], ['자간', '0.2px'], ['위치', 'left 16px']],
    },
    {
      name: '상단바',
      summary: '제목 정렬 차이와 공통 뒤로가기',
      ios: <Stage height={88} bg={colors.surface.card}><MemoryRouter><Platform value={IOS}><TopAppBarBack title="서비스 바로가기 편집" /></Platform></MemoryRouter></Stage>,
      android: <Stage height={88} android bg={colors.surface.card}><MemoryRouter><Platform value={AND}><TopAppBarBack title="서비스 바로가기 편집" /></Platform></MemoryRouter></Stage>,
      iosFacts: [['제목', '가운데'], ['여백', 'right 48px'], ['아이콘', 'ArrowLeft 22'], ['터치', '48 x 48']],
      androidFacts: [['제목', '왼쪽'], ['여백', 'left 8px'], ['아이콘', 'ArrowLeft 22'], ['터치', '48 x 48']],
    },
    {
      name: '버튼',
      summary: '모서리와 높이와 그림자 차이',
      ios: (
        <Stage height={300} bg={colors.surface.card}>
          <Platform value={IOS}>
            <div style={{ padding: spacing[5], display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              <Button variant="filled">간편 신청하기</Button>
              <Button variant="tonal">보조 강조</Button>
              <Button variant="outlined">테두리</Button>
              <Button variant="text">텍스트</Button>
            </div>
          </Platform>
        </Stage>
      ),
      android: (
        <Stage height={300} android bg={colors.surface.card}>
          <Platform value={AND}>
            <div style={{ padding: spacing[5], display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              <Button variant="filled">간편 신청하기</Button>
              <Button variant="tonal">보조 강조</Button>
              <Button variant="outlined">테두리</Button>
              <Button variant="text">텍스트</Button>
            </div>
          </Platform>
        </Stage>
      ),
      iosFacts: [['모서리', '12px'], ['높이', '52px'], ['그림자', '있음']],
      androidFacts: [['모서리', '999px'], ['높이', '48px'], ['그림자', '없음']],
    },
    {
      name: '폰트',
      summary: '본문 글꼴 전역 교체',
      ios: (
        <Stage height={170} bg={colors.surface.card}>
          <div style={{ padding: spacing[5] }}>
            <p style={{ fontSize: typography.size.appTitle, fontWeight: typography.weight.bold, marginBottom: spacing[2], color: colors.gray[900] }}>대구로페이 137,996원</p>
            <p style={{ fontSize: typography.size.sm, color: colors.gray[500] }}>한도를 넘으면 할인 없이 충전해요</p>
            <p style={{ fontSize: typography.size.xxs, color: colors.gray[400], marginTop: spacing[3], fontFamily: mono }}>Apple SD Gothic Neo</p>
          </div>
        </Stage>
      ),
      android: (
        <Stage height={170} android bg={colors.surface.card}>
          <div style={{ padding: spacing[5] }}>
            <p style={{ fontSize: typography.size.appTitle, fontWeight: typography.weight.bold, marginBottom: spacing[2], color: colors.gray[900] }}>대구로페이 137,996원</p>
            <p style={{ fontSize: typography.size.sm, color: colors.gray[500] }}>한도를 넘으면 할인 없이 충전해요</p>
            <p style={{ fontSize: typography.size.xxs, color: colors.gray[400], marginTop: spacing[3] }}>Noto Sans KR</p>
          </div>
        </Stage>
      ),
      iosFacts: [['본문', 'Apple SD Gothic Neo'], ['대체', 'Pretendard']],
      androidFacts: [['본문', 'Noto Sans KR'], ['적용', '전역 덮어쓰기']],
    },
    {
      name: '바텀내비',
      summary: '활성 탭 표시 방식 차이',
      ios: <Stage height={130} bg={colors.surface.card}><MemoryRouter initialEntries={['/store']}><Platform value={IOS}><BottomNavBar /></Platform></MemoryRouter></Stage>,
      android: <Stage height={130} android bg={colors.surface.card}><MemoryRouter initialEntries={['/store']}><Platform value={AND}><BottomNavBar /></Platform></MemoryRouter></Stage>,
      iosFacts: [['활성 표시', '아이콘 채움'], ['탭 높이', '49px'], ['모션', '없음']],
      androidFacts: [['활성 표시', '알약 56 x 32'], ['탭 높이', '44px'], ['모션', '120ms']],
    },
    {
      name: '검색창',
      summary: '입력 자리 표시 방식 차이',
      ios: <Stage height={100} bg={colors.surface.card}><SearchField android={false} /></Stage>,
      android: (
        <Stage height={100} android bg={colors.surface.card}>
          <SearchField android focused={false} />
          <SearchField android focused />
        </Stage>
      ),
      iosFacts: [['모서리', '999px'], ['배경', '투명'], ['밑줄', '없음']],
      androidFacts: [['모서리', '위 8px'], ['배경', 'gray.100'], ['밑줄', '2px 색 변화']],
    },
    {
      name: '필터칩',
      summary: '선택 표시와 체크 표시 차이',
      ios: (
        <Stage height={120} bg={colors.surface.card}>
          <Platform value={IOS}>
            <div style={{ padding: spacing[5], display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
              {['전체', '음식점', '카페'].map((c) => (
                <CategoryFilterChip key={c} label={c} active={chipIOS === c} onClick={() => setChipIOS(c)}
                  icon={c === '음식점' ? <Utensils size={14} /> : c === '카페' ? <Coffee size={14} /> : null} />
              ))}
            </div>
          </Platform>
        </Stage>
      ),
      android: (
        <Stage height={120} android bg={colors.surface.card}>
          <Platform value={AND}>
            <div style={{ padding: spacing[5], display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
              {['전체', '음식점', '카페'].map((c) => (
                <CategoryFilterChip key={c} label={c} active={chipAND === c} onClick={() => setChipAND(c)}
                  icon={c === '음식점' ? <Utensils size={14} /> : c === '카페' ? <Coffee size={14} /> : null} />
              ))}
            </div>
          </Platform>
        </Stage>
      ),
      iosFacts: [['모서리', '999px'], ['선택', '보라 채움'], ['체크', '없음']],
      androidFacts: [['모서리', '8px'], ['선택', '연한 톤'], ['체크', '있음']],
    },
    {
      name: '바텀시트',
      summary: '모서리와 막 짙기와 손잡이 차이',
      ios: (
        <Stage height={260}>
          <Platform value={IOS}>
            <BottomSheet isOpen onClose={() => {}} title="데모 초기화">
              <div style={{ padding: `0 ${layout.margin}` }}>
                <p style={{ fontSize: typography.size.sm, color: colors.gray[500], lineHeight: 1.7 }}>카드 상태와 코치마크를 지우고 앱을 처음부터 다시 엽니다.</p>
              </div>
            </BottomSheet>
          </Platform>
        </Stage>
      ),
      android: (
        <Stage height={260} android>
          <Platform value={AND}>
            <BottomSheet isOpen onClose={() => {}} title="데모 초기화">
              <div style={{ padding: `0 ${layout.margin}` }}>
                <p style={{ fontSize: typography.size.sm, color: colors.gray[500], lineHeight: 1.7 }}>카드 상태와 코치마크를 지우고 앱을 처음부터 다시 엽니다.</p>
              </div>
            </BottomSheet>
          </Platform>
        </Stage>
      ),
      iosFacts: [['모서리', '20px'], ['막', '0.5'], ['손잡이', '40px']],
      androidFacts: [['모서리', '28px'], ['막', '0.32'], ['손잡이', '32px']],
    },
    {
      name: '스낵바',
      summary: 'Android 전용 알림 띠',
      ios: (
        <Stage height={150}>
          <Platform value={IOS}><Snackbar /></Platform>
          <p style={{ padding: spacing[4], fontSize: typography.size.xs, color: colors.gray[400] }}>이 자리에는 아무것도 올라오지 않습니다.</p>
        </Stage>
      ),
      android: (
        <Stage height={150} android>
          <Platform value={AND}><Snackbar /></Platform>
        </Stage>
      ),
      iosFacts: [['노출', '없음'], ['대신', '화면 안에서 결과 표시']],
      androidFacts: [['배경', 'gray.900'], ['모서리', '8px'], ['유지', '2800ms']],
    },
    {
      name: '코치마크',
      summary: '모서리만 다른 동일 구조',
      ios: <Stage height={300} bg={colors.surface.card}><CoachMark android={false} /></Stage>,
      android: <Stage height={300} android bg={colors.surface.card}><CoachMark android /></Stage>,
      iosFacts: [['구멍 모서리', '12px'], ['버튼 모서리', '12px'], ['막', '0.65']],
      androidFacts: [['구멍 모서리', '999px'], ['버튼 모서리', '999px'], ['막', '0.65']],
    },
    {
      name: '생체인증',
      summary: '얼굴 인식과 지문의 위치 차이',
      ios: <AuthStage android={false} />,
      android: <AuthStage android />,
      iosFacts: [['수단', '얼굴 인식'], ['자리', '가운데'], ['보조 문구', '없음']],
      androidFacts: [['수단', '지문'], ['자리', '아래쪽'], ['보조 문구', '있음']],
    },
  ]

  return (
    <div style={{
      backgroundColor: colors.surface.background,
      minHeight: '100vh',
      fontFamily: typography.fontFamily,
      color: colors.gray[900],
      paddingBottom: SHELL.sectionY,
    }}>
      {/* 섹션 헤더 */}
      <header style={{ padding: `${SHELL.sectionY} 0` }}>
        <div style={shell}>
          <p style={{
            fontSize: 14, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase',
            color: colors.primary[700], margin: `0 0 ${spacing[5]}`,
          }}>
            Dual Design System
          </p>
          <h1 style={{
            fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 800, lineHeight: 1.15,
            letterSpacing: '-0.02em', margin: `0 0 ${spacing[4]}`, wordBreak: 'keep-all',
          }}>
            iOS HIG와 Android MD3
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 1.2vw, 20px)', fontWeight: 500, lineHeight: 1.55,
            color: colors.gray[500], margin: 0, maxWidth: 820, wordBreak: 'keep-all',
          }}>
            iOS와 Android는 같은 화면에서도 각 플랫폼의 디자인 언어를 다르게 반영한다.
            시니어가 평소 쓰던 감각을 그대로 잇기 위해 두 빌드를 따로 설계했다.
          </p>
        </div>
      </header>

      {/* 비교 본문 */}
      <div style={shell}>
        <ColumnHead />
        {rows.map((r, i) => (
          <Row key={r.name} index={i} {...r} />
        ))}

        {/* 스낵바 조작 */}
        <div style={{ padding: `${SHELL.rowY} 0` }}>
          <button
            onClick={() => showSnackbar('충전이 완료됐어요')}
            style={{
              padding: `${spacing[3]} ${spacing[5]}`,
              borderRadius: layout.radiusButton,
              border: `1px solid ${colors.primary[700]}`,
              backgroundColor: colors.primary[50],
              color: colors.primary[700],
              fontWeight: typography.weight.bold,
              fontSize: typography.size.sm,
              cursor: 'pointer',
              fontFamily: typography.fontFamily,
              minHeight: layout.touchMin,
            }}
          >
            스낵바 띄워보기
          </button>
        </div>
      </div>

      {/* 접근성 */}
      <div style={{ ...shell, paddingTop: SHELL.sectionY }}>
        <p style={{
          fontSize: 14, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase',
          color: colors.primary[700], margin: `0 0 ${spacing[5]}`,
        }}>
          Accessibility
        </p>
        <h2 style={{
          fontSize: 'clamp(24px, 2.5vw, 38px)', fontWeight: 800, lineHeight: 1.22,
          letterSpacing: '-0.02em', margin: `0 0 ${spacing[4]}`,
        }}>
          시니어 기준으로 다시 잰 값
        </h2>
        <p style={{ fontSize: 'clamp(14px, 1.2vw, 20px)', color: colors.gray[500], lineHeight: 1.55, margin: `0 0 ${SHELL.rowY}`, maxWidth: 820, wordBreak: 'keep-all' }}>
          손이 떨리고 눈이 침침한 사용자를 기준으로 삼는다. 기준에 닿지 못한 항목도 그대로 남긴다.
        </p>

        {/* 터치 타깃 */}
        <h3 style={{ fontSize: 17, fontWeight: 700, margin: `${SHELL.rowY} 0 ${spacing[3]}` }}>손끝이 닿는 크기</h3>
        <div style={{ border: `1px solid ${colors.gray[200]}`, borderRadius: layout.radiusCard, overflow: 'hidden', backgroundColor: colors.surface.card }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 110px 90px', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: 13, fontWeight: 700, color: colors.gray[400] }}>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>요소</b>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>iOS</b>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>Android</b>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>48px 기준</b>
          </div>
          {TOUCH.map(([n, a, b, ok], i) => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 110px 90px', fontSize: 14, borderBottom: i === TOUCH.length - 1 ? 'none' : `1px solid ${colors.gray[100]}` }}>
              <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 600 }}>{n}</span>
              <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: mono, color: colors.gray[700] }}>{a}</span>
              <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: mono, color: colors.gray[700] }}>{b}</span>
              <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700, color: ok ? colors.gray[500] : colors.error }}>{ok ? '충족' : '미달'}</span>
            </div>
          ))}
        </div>

        {/* 색상 대비 */}
        <h3 style={{ fontSize: 17, fontWeight: 700, margin: `${SHELL.rowY} 0 ${spacing[3]}` }}>글자와 배경의 밝기 차이</h3>
        <div style={{ border: `1px solid ${colors.gray[200]}`, borderRadius: layout.radiusCard, overflow: 'hidden', backgroundColor: colors.surface.card }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 90px 90px', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: 13, fontWeight: 700, color: colors.gray[400] }}>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>쓰이는 자리</b>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>색 조합</b>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>대비</b>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>기준</b>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>판정</b>
          </div>
          {CONTRAST.map(([n, combo, r, need], i) => {
            const pass = r >= need
            return (
              <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 90px 90px', fontSize: 14, borderBottom: i === CONTRAST.length - 1 ? 'none' : `1px solid ${colors.gray[100]}` }}>
                <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 600 }}>{n}</span>
                <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontSize: 13, color: colors.gray[500], fontFamily: mono }}>{combo}</span>
                <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: mono, fontWeight: 700 }}>{r.toFixed(2)}</span>
                <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: mono, color: colors.gray[400] }}>{need.toFixed(1)}</span>
                <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700, color: pass ? colors.gray[500] : colors.error }}>{pass ? '충족' : '미달'}</span>
              </div>
            )
          })}
        </div>

        {/* 큰글씨 */}
        <h3 style={{ fontSize: 17, fontWeight: 700, margin: `${SHELL.rowY} 0 ${spacing[3]}` }}>큰글씨 모드에서 커지는 폭</h3>
        <div style={{ border: `1px solid ${colors.gray[200]}`, borderRadius: layout.radiusCard, overflow: 'hidden', backgroundColor: colors.surface.card }}>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 90px 90px 90px 1fr', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: 13, fontWeight: 700, color: colors.gray[400] }}>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>토큰</b>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>기본</b>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>큰글씨</b>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>배율</b>
            <b style={{ padding: `${spacing[3]} ${spacing[4]}`, fontWeight: 700 }}>실제 크기</b>
          </div>
          {TYPE_SCALE.map(([k, base, large], i) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '150px 90px 90px 90px 1fr', alignItems: 'center', borderBottom: i === TYPE_SCALE.length - 1 ? 'none' : `1px solid ${colors.gray[100]}` }}>
              <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: mono, fontSize: 14, fontWeight: 600 }}>{k}</span>
              <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: mono, fontSize: 14, color: colors.gray[500] }}>{base}px</span>
              <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: mono, fontSize: 14, color: colors.gray[700] }}>{large}px</span>
              <span style={{ padding: `${spacing[3]} ${spacing[4]}`, fontFamily: mono, fontSize: 14, fontWeight: 700, color: colors.primary[700] }}>{Math.round((large / base) * 1000) / 10}%</span>
              <span style={{ padding: `${spacing[2]} ${spacing[4]}`, display: 'flex', alignItems: 'baseline', gap: spacing[4], overflow: 'hidden' }}>
                <span style={{ fontSize: base, color: colors.gray[400], whiteSpace: 'nowrap' }}>충전</span>
                <span style={{ fontSize: large, color: colors.gray[900], fontWeight: 600, whiteSpace: 'nowrap' }}>충전</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 화면 열어보기 */}
      <div style={{ ...shell, paddingTop: SHELL.sectionY }}>
        <p style={{
          fontSize: 14, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase',
          color: colors.primary[700], margin: `0 0 ${spacing[5]}`,
        }}>
          Live Build
        </p>
        <h2 style={{
          fontSize: 'clamp(24px, 2.5vw, 38px)', fontWeight: 800, lineHeight: 1.22,
          letterSpacing: '-0.02em', margin: `0 0 ${spacing[4]}`,
        }}>
          두 빌드를 직접 열어보기
        </h2>
        <p style={{ fontSize: 'clamp(14px, 1.2vw, 20px)', color: colors.gray[500], lineHeight: 1.55, margin: `0 0 ${SHELL.rowY}`, maxWidth: 820, wordBreak: 'keep-all' }}>
          같은 화면을 두 빌드에서 나란히 열어 비교한다. 버튼을 누르면 새 탭에서 그 화면이 열린다.
        </p>
        <div style={{ border: `1px solid ${colors.gray[200]}`, borderRadius: layout.radiusCard, overflow: 'hidden', backgroundColor: colors.surface.card }}>
          {ROUTES.map(([path, label], i) => (
            <div key={path} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 160px 160px',
              alignItems: 'center',
              gap: spacing[3],
              padding: `${spacing[3]} ${spacing[4]}`,
              borderBottom: i === ROUTES.length - 1 ? 'none' : `1px solid ${colors.gray[100]}`,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>{label}</p>
                <p style={{ margin: '2px 0 0', fontSize: typography.size.xxs, color: colors.gray[400], fontFamily: mono }}>{path}</p>
              </div>
              {[
                // demo=1은 본인인증 게이트를 건너뛴다. 누르면 그 화면이 바로 열린다.
                ['iOS 빌드 열기', `https://im-challenge-ios.vercel.app${path}?demo=1`],
                ['Android 빌드 열기', `https://im-challenge-android.vercel.app${path}?demo=1`],
              ].map(([txt, href]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: layout.touchMin,
                    borderRadius: layout.radiusButton,
                    border: `1px solid ${colors.primary[700]}`,
                    backgroundColor: colors.surface.card,
                    color: colors.primary[700],
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.semibold,
                    textDecoration: 'none',
                    fontFamily: typography.fontFamily,
                  }}
                >
                  {txt}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...shell, paddingTop: SHELL.sectionY }}>
        <p style={{ fontSize: typography.size.xs, color: colors.gray[400], lineHeight: 1.8, wordBreak: 'keep-all', maxWidth: 820 }}>
          이 문서는 앱과 같은 컴포넌트를 함께 씁니다. 컴포넌트를 고치면 이 화면도 같이 바뀝니다.
          검색창과 코치마크 둘만 같은 값으로 다시 그렸고 나머지는 앱에서 그대로 가져옵니다.
        </p>
      </div>
    </div>
  )
}
