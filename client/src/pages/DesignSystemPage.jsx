/**
 * DesignSystemPage — /design-system
 *
 * iOS HIG / Android MD3 듀얼 디자인 시스템 비교 문서 페이지.
 *
 * 핵심: 스크린샷이 아니라 **실제 컴포넌트를 import해서 살아있는 상태로** 좌우에 둔다.
 * 플랫폼은 usePlatform()의 PlatformOverrideContext로 컬럼마다 강제한다.
 * (오버라이드 기본값이 null이라 앱의 다른 화면 동작은 바뀌지 않는다)
 *
 * 표에 적힌 수치는 전부 우리 코드/배포본 실측값이다. 외부 문서 값을 옮겨 적지 않았다.
 * 각 항목에 근거 파일과 줄 위치를 함께 적는다.
 */

import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Search, Utensils, Coffee } from 'lucide-react'

import { colors, typography, layout, spacing, shadow } from '../tokens/tokens'
import { PlatformOverrideContext } from '../hooks/usePlatform'
import { useApp } from '../context/AppContext'

// ── 실제 앱 컴포넌트 (재현이 아니라 import) ────────────────────────────────
import StatusBar from '../components/layout/StatusBar'
import StatusBarAndroid from '../components/layout/StatusBarAndroid'
import TopAppBarBack from '../components/layout/TopAppBarBack'
import BottomNavBar from '../components/layout/BottomNavBar'
import Button from '../components/common/Button'
import CategoryFilterChip from '../components/store/CategoryFilterChip'
import BottomSheet from '../components/common/BottomSheet'
import Snackbar from '../components/common/Snackbar'

const IOS = 'ios'
const AND = 'android'

// ── 기본 골격 ────────────────────────────────────────────────────────────

function Platform({ value, children }) {
  return (
    <PlatformOverrideContext.Provider value={value}>
      {children}
    </PlatformOverrideContext.Provider>
  )
}

/**
 * position:fixed 컴포넌트(바텀내비·바텀시트·스낵바)를 문서 안에 가둔다.
 * transform이 걸린 조상은 fixed의 컨테이닝 블록이 되므로, 화면 전체로 퍼지지 않고
 * 이 상자 안에서만 렌더된다. 실제 컴포넌트를 그대로 쓰기 위한 장치다.
 */
function Frame({ height = 220, children, forceNoto = false, bg = colors.surface.background, id }) {
  return (
    <div
      id={id}
      // iOS 컬럼에도 명시적으로 클래스를 건다.
      // 안드로이드 빌드에서 이 문서를 열면 전역 폰트 강제가 iOS 컬럼까지 먹어버린다.
      className={forceNoto ? 'ds-force-noto' : 'ds-force-apple'}
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        width: 390,
        maxWidth: '100%',
        height,
        overflow: 'hidden',
        backgroundColor: bg,
        border: `1px solid ${colors.gray[200]}`,
        borderRadius: 12,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  )
}

function Tag({ kind }) {
  const ios = kind === IOS
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: '0.08em',
      padding: '5px 12px',
      borderRadius: 999,
      marginBottom: 10,
      backgroundColor: ios ? '#EEF2FF' : '#ECFDF5',
      color: ios ? '#3730A3' : '#047857',
    }}>
      {ios ? 'iOS · HIG' : 'ANDROID · MD3'}
    </span>
  )
}

function Section({ no, title, note, source, children, spec, verdict }) {
  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: colors.primary[700], letterSpacing: '0.1em' }}>{no}</span>
        <h3 style={{ fontSize: 24, fontWeight: 800, color: colors.gray[900], letterSpacing: '-0.02em' }}>{title}</h3>
        {verdict && (
          <span style={{
            fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
            backgroundColor: verdict === '동일' ? colors.gray[100] : '#FEF3C7',
            color: verdict === '동일' ? colors.gray[500] : '#92400E',
          }}>
            {verdict}
          </span>
        )}
      </div>
      {note && <p style={{ fontSize: 15, color: colors.gray[500], lineHeight: 1.7, marginBottom: 6, wordBreak: 'keep-all' }}>{note}</p>}
      {source && <p style={{ fontSize: 13, color: colors.gray[400], marginBottom: 18, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>근거 · {source}</p>}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {children}
      </div>
      {spec && <SpecTable rows={spec} />}
    </section>
  )
}

function SpecTable({ rows }) {
  return (
    <div style={{ marginTop: 20, border: `1px solid ${colors.gray[200]}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', backgroundColor: colors.gray[50], borderBottom: `1px solid ${colors.gray[200]}` }}>
        <b style={{ width: 190, padding: '10px 14px', fontSize: 13, color: colors.gray[500], fontWeight: 700 }}>속성</b>
        <b style={{ flex: 1, padding: '10px 14px', fontSize: 13, color: '#3730A3', fontWeight: 700 }}>iOS</b>
        <b style={{ flex: 1, padding: '10px 14px', fontSize: 13, color: '#047857', fontWeight: 700 }}>Android</b>
      </div>
      {rows.map(([k, a, b], i) => {
        const same = a === b
        return (
          <div key={k} style={{ display: 'flex', borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${colors.gray[100]}` }}>
            <b style={{ width: 190, padding: '11px 14px', fontSize: 14, color: colors.gray[500], fontWeight: 600, backgroundColor: colors.gray[50] }}>{k}</b>
            <span style={{ flex: 1, padding: '11px 14px', fontSize: 14, color: same ? colors.gray[400] : colors.gray[900], fontWeight: same ? 400 : 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', wordBreak: 'break-all' }}>{a}</span>
            <span style={{ flex: 1, padding: '11px 14px', fontSize: 14, color: same ? colors.gray[400] : colors.gray[900], fontWeight: same ? 400 : 600, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', wordBreak: 'break-all' }}>{b}</span>
          </div>
        )
      })}
    </div>
  )
}

function Col({ kind, children }) {
  return (
    <div>
      <Tag kind={kind} />
      {children}
    </div>
  )
}

// ── 06 검색창: SearchPage 안에 인라인으로 박혀 있어 import할 컴포넌트가 없다.
//    SearchPage.jsx의 style 객체를 그대로 옮겨 같은 DOM을 만든다(값 복사, 구조 동일).
function SearchFieldReplica({ android, focused }) {
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
        <span style={{
          flex: 1,
          fontSize: typography.size.sm,
          fontFamily: android ? "'Noto Sans KR', sans-serif" : typography.fontFamily,
          color: colors.gray[400],
        }}>
          매장·서비스 검색
        </span>
      </div>
    </div>
  )
}

// ── 10 코치마크: 실제 CoachMarkOverlay는 마운트되는 동안 document.body의 스크롤을
//    잠그므로(이 문서 페이지가 안 움직인다) 문서 안에 상시 띄울 수 없다.
//    말풍선 카드는 CoachMarkOverlay.jsx의 스타일을 그대로 옮겨 재현하고,
//    플랫폼 차이(버튼·스포트라이트 radius)를 같은 조건으로 보여준다.
function CoachReplica({ android }) {
  const radius = android ? layout.radiusPill : layout.radiusButton
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 44, backgroundColor: 'rgba(0,0,0,0.65)' }} />
      <div style={{ position: 'absolute', top: 104, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)' }} />
      <div style={{ position: 'absolute', top: 44, left: 0, width: 110, height: 60, backgroundColor: 'rgba(0,0,0,0.65)' }} />
      <div style={{ position: 'absolute', top: 44, left: 286, right: 0, height: 60, backgroundColor: 'rgba(0,0,0,0.65)' }} />
      <div style={{
        position: 'absolute', top: 44, left: 110, width: 176, height: 60,
        borderRadius: radius, border: '2px solid rgba(255,255,255,0.55)',
      }} />
      <div style={{ position: 'absolute', left: spacing[4], right: spacing[4], top: 120 }}>
        <div style={{
          backgroundColor: colors.surface.card,
          borderRadius: layout.radiusCard,
          padding: spacing[5],
          boxShadow: shadow.modal,
          fontFamily: android ? "'Noto Sans KR', sans-serif" : typography.fontFamily,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: i === 1 ? colors.primary[700] : colors.gray[200] }} />
            ))}
            <span style={{ fontSize: typography.size.xxs, color: colors.gray[400] }}>1 / 3</span>
          </div>
          <p style={{ margin: `0 0 ${spacing[4]}`, fontSize: typography.size.sm, color: colors.gray[900], lineHeight: 1.6, wordBreak: 'keep-all' }}>
            카드가 등록됐어요. 위에 잔액이 보이고, 아래 세 버튼으로 충전 환불 QR결제를 모두 할 수 있습니다.
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

// ── 접근성 데이터 ────────────────────────────────────────────────────────

const CONTRAST = [
  ['주요 본문 텍스트', 'gray.900 #111827', 'card #FFFFFF', 17.74, 4.5],
  ['주요 본문 (앱 배경)', 'gray.900 #111827', 'background #F2F4F8', 16.11, 4.5],
  ['보조 텍스트', 'gray.500 #6B7280', 'card #FFFFFF', 4.83, 4.5],
  ['보조 텍스트 (앱 배경)', 'gray.500 #6B7280', 'background #F2F4F8', 4.39, 4.5],
  ['placeholder · 비활성 탭', 'gray.400 #9CA3AF', 'card #FFFFFF', 2.54, 4.5],
  ['CTA 버튼 라벨', 'white #FFFFFF', 'primary.700 #5139E8', 6.77, 4.5],
  ['활성 탭 라벨', 'primary.700 #5139E8', 'card #FFFFFF', 6.77, 4.5],
  ['Android 칩 활성 라벨', 'primary.700 #5139E8', 'primary.100 #E8E6F4', 5.50, 4.5],
  ['잔액 카드 텍스트 (대형)', 'white #FFFFFF', 'darkCard #241F45', 15.48, 3.0],
  ['스낵바 텍스트 (Android)', 'white #FFFFFF', 'gray.900 #111827', 17.74, 4.5],
  ['오류 텍스트', 'errorDark #DC2626', 'alertBg #FEF2F2', 4.41, 4.5],
]

const TYPE_SCALE = [
  ['largeTitle', 34, 44], ['balance', 28, 40], ['balanceLarge', 36, 48],
  ['appTitle', 22, 30], ['xl', 20, 26], ['lg', 18, 24], ['md', 17, 22],
  ['sm', 15, 20], ['xs', 13, 17], ['xxs', 12, 15], ['nav', 11, 14],
]

const TOUCH = [
  ['공통 Button (lg)', '52px', '48px', 'PASS', 'Button.jsx heightMap'],
  ['공통 Button (min-height)', '48px', '48px', 'PASS', 'layout.touchMin'],
  ['상단바 뒤로가기', '48 × 48', '48 × 48', 'PASS', 'TopAppBarBack.jsx'],
  ['바텀내비 탭', '78 × 49', '78 × 49', 'PASS', 'BottomNavBar.jsx'],
  ['이용내역 화면 최소', '49px', '48px', 'PASS', '/history 전수 측정'],
  ['결제매장 카테고리 칩', '39px', '39px', 'FAIL', 'CategoryFilterChip padding 7px'],
  ['쿠폰함 카테고리 칩', '34px', '34px', 'FAIL', 'CouponPage.jsx minHeight 34'],
  ['홈 위젯 추가 배너', '30px', '30px', 'FAIL', 'WidgetAddBanner pill 버튼'],
  ['홈 전체보기 링크', '20px', '20px', 'FAIL', 'SectionHeader 텍스트 버튼'],
]

// ── 본문 ─────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  const [sheetIOS, setSheetIOS] = useState(true)
  const [sheetAND, setSheetAND] = useState(true)
  const [chipIOS, setChipIOS] = useState('전체')
  const [chipAND, setChipAND] = useState('전체')
  const [frameRoute, setFrameRoute] = useState('/store')
  const { showSnackbar, snackbar } = useApp()

  const wrap = { maxWidth: 1180, margin: '0 auto', padding: '0 24px' }
  const mono = 'ui-monospace, SFMono-Regular, Menlo, monospace'

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      fontFamily: typography.fontFamily,
      color: colors.gray[900],
      paddingBottom: 100,
    }}>
      {/* 헤더 */}
      <header style={{ borderBottom: `1px solid ${colors.gray[200]}`, padding: '64px 0 48px', marginBottom: 56 }}>
        <div style={wrap}>
          <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.16em', color: colors.primary[700], marginBottom: 16 }}>
            IM SHOP · DUAL DESIGN SYSTEM
          </p>
          <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.25, marginBottom: 16 }}>
            iOS HIG × Android MD3
          </h1>
          <p style={{ fontSize: 18, color: colors.gray[500], lineHeight: 1.7, maxWidth: 760, wordBreak: 'keep-all' }}>
            아래 컴포넌트는 캡처 이미지가 아니라 앱에서 쓰는 실제 컴포넌트를 그대로 import해 렌더한 것이다.
            플랫폼은 컬럼마다 강제했고, 눌러서 상태가 바뀌는 것도 실제 동작이다.
          </p>
          <p style={{ fontSize: 14, color: colors.gray[400], marginTop: 18, fontFamily: mono }}>
            측정 기준 · im-challenge-ios.vercel.app / im-challenge-android.vercel.app · getComputedStyle 실측
          </p>
        </div>
      </header>

      <div style={wrap}>
        <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10 }}>04 &nbsp;플랫폼 비교</h2>
        <p style={{ fontSize: 15, color: colors.gray[500], marginBottom: 44 }}>11개 항목. 값이 같은 칸은 흐리게 표시한다.</p>

        {/* 01 상태바 */}
        <Section
          no="01"
          title="상태바"
          note="데스크톱 시연용 상태바. 두 플랫폼이 서로 다른 컴포넌트를 쓴다. 높이 1px 차이와 시간 글자 크기·자간이 다르다."
          source="components/layout/StatusBar.jsx · StatusBarAndroid.jsx · ScreenContainer.jsx:42"
          spec={[
            ['높이', '41px', '42px'],
            ['시간 글자 크기', '17px', '14px'],
            ['시간 자간', '-0.5px', '0.2px'],
            ['시간 색', 'gray.900 #111827', 'androidStatusBar #222227'],
            ['시간 위치', 'left 13% (비율)', 'padding-left 16px (고정)'],
            ['시간 폰트', 'typography.fontFamily', "'Noto Sans KR'"],
          ]}
        >
          <Col kind={IOS}>
            <Frame height={60} bg={colors.surface.card}>
              <StatusBar backgroundColor={colors.surface.card} />
            </Frame>
          </Col>
          <Col kind={AND}>
            <Frame height={60} bg={colors.surface.card} forceNoto>
              <StatusBarAndroid backgroundColor={colors.surface.card} />
            </Frame>
          </Col>
        </Section>

        {/* 02 상단바 */}
        <Section
          no="02"
          title="상단바 (헤더)"
          note="제목 정렬이 다르다. 뒤로가기 아이콘은 두 플랫폼 모두 lucide ArrowLeft 22px에 48×48 터치 영역으로 같다."
          source="components/layout/TopAppBarBack.jsx:52-62"
          spec={[
            ['제목 정렬', 'center', 'left'],
            ['제목 여백', 'margin-right 48px', 'margin-left 8px'],
            ['제목 폰트', 'typography.fontFamily', "'Noto Sans KR' 우선"],
            ['뒤로가기 아이콘', 'lucide ArrowLeft 22', 'lucide ArrowLeft 22'],
            ['뒤로가기 터치', '48 × 48', '48 × 48'],
            ['상단바 높이', '48px', '48px'],
          ]}
        >
          <Col kind={IOS}>
            <Frame height={70} bg={colors.surface.card}>
              <MemoryRouter><Platform value={IOS}><TopAppBarBack title="서비스 바로가기 편집" /></Platform></MemoryRouter>
            </Frame>
          </Col>
          <Col kind={AND}>
            <Frame height={70} bg={colors.surface.card} forceNoto>
              <MemoryRouter><Platform value={AND}><TopAppBarBack title="서비스 바로가기 편집" /></Platform></MemoryRouter>
            </Frame>
          </Col>
        </Section>

        {/* 03 버튼 */}
        <Section
          no="03"
          title="버튼"
          note="MD3 4종 위계를 양쪽 다 쓰지만 모서리·높이·그림자가 다르다. filled 외의 variant는 원래 그림자가 없어 차이가 모서리와 높이로만 나타난다."
          source="components/common/Button.jsx:33-45, 84-88"
          spec={[
            ['radius', '12px (layout.radiusButton)', '999px (layout.radiusPill)'],
            ['height lg', '52px', '48px'],
            ['height md', '48px', '48px'],
            ['height sm', '40px', '40px'],
            ['min-height', '48px', '48px'],
            ['filled 그림자', 'rgba(81,57,232,0.25) 0 2px 6px', 'none'],
            ['라벨 폰트', 'typography.fontFamily', "'Noto Sans KR' 우선"],
          ]}
        >
          <Col kind={IOS}>
            <Frame height={290} bg={colors.surface.card}>
              <Platform value={IOS}>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Button variant="filled">간편 신청하기</Button>
                  <Button variant="tonal">보조 강조</Button>
                  <Button variant="outlined">테두리만</Button>
                  <Button variant="text">텍스트</Button>
                </div>
              </Platform>
            </Frame>
          </Col>
          <Col kind={AND}>
            <Frame height={290} bg={colors.surface.card} forceNoto>
              <Platform value={AND}>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Button variant="filled">간편 신청하기</Button>
                  <Button variant="tonal">보조 강조</Button>
                  <Button variant="outlined">테두리만</Button>
                  <Button variant="text">텍스트</Button>
                </div>
              </Platform>
            </Frame>
          </Col>
        </Section>

        {/* 04 폰트 */}
        <Section
          no="04"
          title="폰트"
          note="안드로이드 빌드는 body 클래스로 전역을 덮어쓴다. 인라인 폰트 지정까지 !important로 이긴다."
          source="index.css:3-6 · tokens.js:199"
          spec={[
            ['스택', '-apple-system → system-ui → Apple SD Gothic Neo → Pretendard → Noto Sans KR', "'Noto Sans KR', sans-serif"],
            ['적용 방식', '토큰 기본값', 'body.platform-android * { !important }'],
            ['로드', 'Pretendard CDN', 'Google Fonts Noto Sans KR'],
          ]}
        >
          <Col kind={IOS}>
            <Frame height={150} bg={colors.surface.card}>
              <div style={{ padding: 20 }}>
                <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>대구로페이 137,996원</p>
                <p style={{ fontSize: 15, color: colors.gray[500] }}>한도를 넘으면 할인 없이 충전해요</p>
                <p style={{ fontSize: 12, color: colors.gray[400], marginTop: 12, fontFamily: mono }}>-apple-system …</p>
              </div>
            </Frame>
          </Col>
          <Col kind={AND}>
            <Frame height={150} bg={colors.surface.card} forceNoto>
              <div style={{ padding: 20 }}>
                <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>대구로페이 137,996원</p>
                <p style={{ fontSize: 15, color: colors.gray[500] }}>한도를 넘으면 할인 없이 충전해요</p>
                <p style={{ fontSize: 12, color: colors.gray[400], marginTop: 12 }}>Noto Sans KR</p>
              </div>
            </Frame>
          </Col>
        </Section>

        {/* 05 바텀내비 */}
        <Section
          no="05"
          title="바텀 내비게이션"
          note="활성 표시 방식이 근본적으로 다르다. iOS는 아이콘을 채우고(fill 0.18), 안드로이드는 아이콘 뒤에 pill 인디케이터를 깐다. 색만으로 구분하지 않는 이중 단서는 양쪽 다 지킨다. 눌러서 탭을 바꿔볼 수 있다."
          source="components/layout/BottomNavBar.jsx:44, 123-147"
          spec={[
            ['탭 높이(min-height)', '49px', '44px'],
            ['바 padding-top', '8px', '4px'],
            ['바 전체 높이', '73px', '69px'],
            ['활성 표시', 'SVG fill #5139E8 / opacity 0.18', 'pill 56×32 · primary.100 #E8E6F4'],
            ['pill radius', '없음', '999px (md3Shape.full)'],
            ['전환 모션', '없음(즉시)', 'background-color 120ms'],
            ['라벨 크기', '11px', '11px'],
            ['활성 라벨', 'weight 500 · #5139E8', 'weight 500 · #5139E8'],
          ]}
        >
          <Col kind={IOS}>
            <Frame height={110} bg={colors.surface.card}>
              <MemoryRouter initialEntries={['/store']}><Platform value={IOS}><BottomNavBar /></Platform></MemoryRouter>
            </Frame>
          </Col>
          <Col kind={AND}>
            <Frame height={110} bg={colors.surface.card} forceNoto>
              <MemoryRouter initialEntries={['/store']}><Platform value={AND}><BottomNavBar /></Platform></MemoryRouter>
            </Frame>
          </Col>
        </Section>

        {/* 06 검색창 */}
        <Section
          no="06"
          title="검색창"
          note="iOS는 테두리 있는 pill, 안드로이드는 MD3 filled text field라 위 모서리만 둥글고 아래에 2px 밑줄이 있다. 포커스가 가면 밑줄 색이 회색에서 보라로 바뀌는 것도 안드로이드에만 있다."
          source="pages/SearchPage.jsx:57-60 · components/store/StoreMapScreen.jsx:480-481 (컴포넌트로 분리돼 있지 않아 같은 style 객체를 옮겨 재현)"
          spec={[
            ['radius', '999px (pill)', '8px 8px 0 0'],
            ['배경', '투명', 'gray.100 #F3F4F6'],
            ['테두리', '1px solid gray.200', 'none'],
            ['밑줄', '없음', '2px · 기본 gray.400 / 포커스 primary.700'],
            ['높이(실측)', '40px', '41px'],
          ]}
        >
          <Col kind={IOS}>
            <Frame height={80} bg={colors.surface.card}>
              <SearchFieldReplica android={false} />
            </Frame>
          </Col>
          <Col kind={AND}>
            <Frame height={80} bg={colors.surface.card} forceNoto>
              <SearchFieldReplica android focused={false} />
              <p style={{ fontSize: 12, color: colors.gray[400], padding: '4px 16px' }}>↑ 기본 · ↓ 포커스</p>
            </Frame>
            <Frame height={60} bg={colors.surface.card} forceNoto>
              <SearchFieldReplica android focused />
            </Frame>
          </Col>
        </Section>

        {/* 07 필터칩 */}
        <Section
          no="07"
          title="필터 칩"
          note="차이가 가장 큰 항목이다. iOS는 선택 시 보라로 꽉 채우고, 안드로이드는 MD3 규칙대로 연한 톤 + 체크마크를 붙인다. 눌러서 선택을 바꿔보면 체크마크가 안드로이드에만 붙는 게 보인다."
          source="components/store/CategoryFilterChip.jsx:8-38"
          spec={[
            ['radius', '999px (pill)', '8px (radiusSmall)'],
            ['활성 배경', 'primary.700 #5139E8', 'primary.100 #E8E6F4'],
            ['활성 글자색', '#FFFFFF', 'primary.700 #5139E8'],
            ['체크마크', '없음', 'lucide Check 16px'],
            ['비활성 테두리', '1px gray.200 #E5E7EB', '1px gray.300 #D1D5DB'],
            ['비활성 그림자', '0 1px 4px rgba(0,0,0,0.06)', 'none'],
            ['높이(실측)', '39px', '39px'],
          ]}
        >
          <Col kind={IOS}>
            <Frame height={100} bg={colors.surface.card}>
              <Platform value={IOS}>
                <div style={{ padding: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['전체', '음식점', '카페'].map((c) => (
                    <CategoryFilterChip key={c} label={c} active={chipIOS === c} onClick={() => setChipIOS(c)}
                      icon={c === '음식점' ? <Utensils size={14} /> : c === '카페' ? <Coffee size={14} /> : null} />
                  ))}
                </div>
              </Platform>
            </Frame>
          </Col>
          <Col kind={AND}>
            <Frame height={100} bg={colors.surface.card} forceNoto>
              <Platform value={AND}>
                <div style={{ padding: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['전체', '음식점', '카페'].map((c) => (
                    <CategoryFilterChip key={c} label={c} active={chipAND === c} onClick={() => setChipAND(c)}
                      icon={c === '음식점' ? <Utensils size={14} /> : c === '카페' ? <Coffee size={14} /> : null} />
                  ))}
                </div>
              </Platform>
            </Frame>
          </Col>
        </Section>

        {/* 08 바텀시트 */}
        <Section
          no="08"
          title="바텀시트"
          note="MD3의 extraLarge(28px)와 iOS의 20px 차이, 그리고 뒤를 덮는 막의 농도가 다르다. 핸들 바 길이와 색도 다르다."
          source="components/common/BottomSheet.jsx:28, 41-42, 63-66"
          spec={[
            ['상단 radius', '20px (layout.radiusModal)', '28px (md3Shape.extraLarge)'],
            ['scrim', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.32)'],
            ['핸들 폭', '40px', '32px'],
            ['핸들 색', 'gray.300 #D1D5DB', 'gray.400 #9CA3AF'],
            ['그림자', '0 -4px 20px rgba(0,0,0,0.12)', '0 -4px 20px rgba(0,0,0,0.12)'],
          ]}
        >
          <Col kind={IOS}>
            <Frame height={260}>
              <Platform value={IOS}>
                <BottomSheet isOpen={sheetIOS} onClose={() => setSheetIOS(!sheetIOS)} title="데모 초기화">
                  <div style={{ padding: `0 ${layout.margin}` }}>
                    <p style={{ fontSize: 15, color: colors.gray[500], lineHeight: 1.7 }}>카드 상태와 코치마크를 지우고 앱을 처음부터 다시 엽니다.</p>
                  </div>
                </BottomSheet>
              </Platform>
            </Frame>
          </Col>
          <Col kind={AND}>
            <Frame height={260} forceNoto>
              <Platform value={AND}>
                <BottomSheet isOpen={sheetAND} onClose={() => setSheetAND(!sheetAND)} title="데모 초기화">
                  <div style={{ padding: `0 ${layout.margin}` }}>
                    <p style={{ fontSize: 15, color: colors.gray[500], lineHeight: 1.7 }}>카드 상태와 코치마크를 지우고 앱을 처음부터 다시 엽니다.</p>
                  </div>
                </BottomSheet>
              </Platform>
            </Frame>
          </Col>
        </Section>

        {/* 09 스낵바 */}
        <Section
          no="09"
          title="스낵바"
          verdict="iOS에는 없음"
          note="iOS 컬럼은 빈 상자가 정상이다. Snackbar 컴포넌트가 iOS에서 null을 반환한다. 아래 버튼을 누르면 안드로이드 쪽에만 뜨고 2.8초 뒤 사라진다."
          source="components/common/Snackbar.jsx:10, 20 · App.jsx:122 · 호출 ChargeScreen.jsx:605, ChargeFreePage.jsx:124, RefundPage.jsx:70"
          spec={[
            ['노출 여부', '렌더 안 함 (return null)', '렌더'],
            ['배경', '해당 없음', 'gray.900 #111827'],
            ['radius', '해당 없음', '8px'],
            ['등장', '해당 없음', 'slideUp 250ms'],
            ['자동 소멸', '해당 없음', '2800ms'],
            ['위치', '해당 없음', '바텀내비 + 8px 위'],
          ]}
        >
          <Col kind={IOS}>
            <Frame height={130}>
              <Platform value={IOS}><Snackbar /></Platform>
              {!snackbar && <p style={{ padding: 16, fontSize: 13, color: colors.gray[400] }}>버튼을 눌러도 이 자리에는 아무것도 뜨지 않는다.</p>}
            </Frame>
          </Col>
          <Col kind={AND}>
            <Frame height={130} forceNoto>
              <Platform value={AND}><Snackbar /></Platform>
            </Frame>
          </Col>
          <div style={{ alignSelf: 'center' }}>
            <button
              onClick={() => showSnackbar('충전이 완료됐어요')}
              style={{
                padding: '12px 20px', borderRadius: 10, border: `1px solid ${colors.primary[700]}`,
                background: colors.primary[50], color: colors.primary[700], fontWeight: 700,
                fontSize: 14, cursor: 'pointer', fontFamily: typography.fontFamily,
              }}
            >
              스낵바 띄우기
            </button>
          </div>
        </Section>

        {/* 10 코치마크 */}
        <Section
          no="10"
          title="코치마크"
          note="구조는 같고 모서리만 다르다. 실제 CoachMarkOverlay는 떠 있는 동안 문서 전체 스크롤을 잠그기 때문에 이 페이지 안에 상시 띄울 수 없어, 같은 스타일 값으로 재현했다."
          source="components/common/CoachMarkOverlay.jsx:128, 228"
          spec={[
            ['스포트라이트 radius', '12px', '999px'],
            ['다음 버튼 radius', '12px', '999px'],
            ['딤 농도', 'rgba(0,0,0,0.65)', 'rgba(0,0,0,0.65)'],
            ['딤 구현', '구멍 위·아래·좌·우 4장', '구멍 위·아래·좌·우 4장'],
            ['말풍선 배경', 'surface.card #FFFFFF', 'surface.card #FFFFFF'],
          ]}
        >
          <Col kind={IOS}>
            <Frame height={300} bg={colors.surface.card}><CoachReplica android={false} /></Frame>
          </Col>
          <Col kind={AND}>
            <Frame height={300} bg={colors.surface.card} forceNoto><CoachReplica android /></Frame>
          </Col>
        </Section>

        {/* 11 생체인증 */}
        <Section
          no="11"
          title="생체인증"
          note="Lottie 애니메이션이 2.5초 만에 자동 완료되고 결제 흐름 한가운데서만 열려, 문서 안에 살아있는 상태로 둘 수 없다. 배포본 실제 화면 캡처로 대체한다."
          source="components/common/PaymentAuthOverlay.jsx:50-54, 344-390"
          spec={[
            ['수단', 'Face ID (face-id-ios.json)', '지문 (Fingerprint.json)'],
            ['프레임 수', '244', '180'],
            ['세로 위치', 'center (y 376)', 'flex-end + 120px (y 587)'],
            ['박스 배경', 'gray.900 #111827', 'transparent'],
            ['보조 문구', '없음', '"지문을 인식해주세요" 17px'],
            ['칩 문구', '얼굴인증 사용하기', '지문인증 사용하기'],
            ['박스 크기', '150 × 148', '150 × 148'],
          ]}
        >
          <Col kind={IOS}>
            <img src="/ds/auth-ios.png" alt="iOS Face ID 인증 화면" style={{ width: 300, border: `1px solid ${colors.gray[200]}`, borderRadius: 12, display: 'block' }} />
          </Col>
          <Col kind={AND}>
            <img src="/ds/auth-android.png" alt="Android 지문 인증 화면" style={{ width: 300, border: `1px solid ${colors.gray[200]}`, borderRadius: 12, display: 'block' }} />
          </Col>
        </Section>

        {/* 라이브 앱 */}
        <section style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: colors.primary[700], letterSpacing: '0.1em' }}>12</span>
            <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>배포본 두 개를 나란히</h3>
          </div>
          <p style={{ fontSize: 15, color: colors.gray[500], lineHeight: 1.7, marginBottom: 18, wordBreak: 'keep-all' }}>
            위 컴포넌트가 실제 앱에서 어떻게 붙는지 보려면 아래 두 화면을 직접 눌러보면 된다.
            왼쪽은 iOS 빌드, 오른쪽은 Android 빌드로 서로 다른 Vercel 프로젝트다.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            {['/', '/store', '/search', '/history', '/coupon', '/service-edit', '/settings'].map((r) => (
              <button
                key={r}
                onClick={() => setFrameRoute(r)}
                style={{
                  padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  fontFamily: mono,
                  border: `1px solid ${frameRoute === r ? colors.primary[700] : colors.gray[200]}`,
                  backgroundColor: frameRoute === r ? colors.primary[700] : '#FFFFFF',
                  color: frameRoute === r ? '#FFFFFF' : colors.gray[700],
                }}
              >
                {r}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <Tag kind={IOS} />
              <iframe
                title="iOS 배포본"
                src={`https://im-challenge-ios.vercel.app${frameRoute}`}
                style={{ width: 390, height: 780, border: `1px solid ${colors.gray[200]}`, borderRadius: 12, display: 'block', backgroundColor: '#FFFFFF' }}
              />
            </div>
            <div>
              <Tag kind={AND} />
              <iframe
                title="Android 배포본"
                src={`https://im-challenge-android.vercel.app${frameRoute}`}
                style={{ width: 390, height: 780, border: `1px solid ${colors.gray[200]}`, borderRadius: 12, display: 'block', backgroundColor: '#FFFFFF' }}
              />
            </div>
          </div>
        </section>

        {/* ── 05 접근성 ── */}
        <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10, paddingTop: 24, borderTop: `1px solid ${colors.gray[200]}` }}>
          05 &nbsp;접근성
        </h2>
        <p style={{ fontSize: 15, color: colors.gray[500], marginBottom: 44, wordBreak: 'keep-all' }}>
          통과한 것만 적지 않는다. 기준에 못 미치는 항목도 그대로 둔다.
        </p>

        {/* 터치 타깃 */}
        <Section
          no="13"
          title="터치 타깃"
          note="배포본에서 홈·결제매장·이용내역·쿠폰함의 클릭 가능한 요소를 전수 측정했다. 공통 Button과 내비 탭은 두 플랫폼 모두 48px 이상을 지키지만, 칩과 인라인 링크 네 종류가 기준에 못 미친다. 구글 지도 내장 컨트롤은 외부 요소라 뺐다."
          source="배포본 전수 측정 · layout.touchMin = 48px (WCAG 2.1 AA 최소 44px보다 높게 잡은 자체 기준)"
        >
          <div style={{ width: '100%', border: `1px solid ${colors.gray[200]}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', backgroundColor: colors.gray[50], borderBottom: `1px solid ${colors.gray[200]}`, fontSize: 13, fontWeight: 700, color: colors.gray[500] }}>
              <b style={{ flex: 2, padding: '10px 14px' }}>요소</b>
              <b style={{ width: 110, padding: '10px 14px', color: '#3730A3' }}>iOS</b>
              <b style={{ width: 110, padding: '10px 14px', color: '#047857' }}>Android</b>
              <b style={{ width: 80, padding: '10px 14px' }}>판정</b>
              <b style={{ flex: 2, padding: '10px 14px' }}>근거</b>
            </div>
            {TOUCH.map(([name, a, b, v, src], i) => (
              <div key={name} style={{ display: 'flex', fontSize: 14, borderBottom: i === TOUCH.length - 1 ? 'none' : `1px solid ${colors.gray[100]}`, backgroundColor: v === 'FAIL' ? '#FFFBEB' : 'transparent' }}>
                <span style={{ flex: 2, padding: '11px 14px', fontWeight: 600 }}>{name}</span>
                <span style={{ width: 110, padding: '11px 14px', fontFamily: mono }}>{a}</span>
                <span style={{ width: 110, padding: '11px 14px', fontFamily: mono }}>{b}</span>
                <span style={{ width: 80, padding: '11px 14px', fontWeight: 800, color: v === 'PASS' ? '#047857' : '#B45309' }}>{v}</span>
                <span style={{ flex: 2, padding: '11px 14px', fontSize: 13, color: colors.gray[500], fontFamily: mono }}>{src}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 색상 대비 */}
        <Section
          no="14"
          title="색상 대비 (WCAG 2.1 AA)"
          note="tokens.js 색상값으로 상대 휘도를 계산한 결과다. 일반 텍스트 4.5:1, 18.66px 이상 굵은 텍스트 3:1 기준. 11개 중 3개가 기준에 못 미친다."
          source="tokens.js colors 정의값 · WCAG 2.1 relative luminance 공식"
        >
          <div style={{ width: '100%', border: `1px solid ${colors.gray[200]}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', backgroundColor: colors.gray[50], borderBottom: `1px solid ${colors.gray[200]}`, fontSize: 13, fontWeight: 700, color: colors.gray[500] }}>
              <b style={{ flex: 2, padding: '10px 14px' }}>조합</b>
              <b style={{ flex: 2, padding: '10px 14px' }}>전경 / 배경</b>
              <b style={{ width: 90, padding: '10px 14px' }}>대비</b>
              <b style={{ width: 80, padding: '10px 14px' }}>기준</b>
              <b style={{ width: 80, padding: '10px 14px' }}>판정</b>
              <b style={{ width: 110, padding: '10px 14px' }}>미리보기</b>
            </div>
            {CONTRAST.map(([name, fg, bg, r, need], i) => {
              const pass = r >= need
              const fgHex = fg.match(/#[0-9A-Fa-f]{6}/)[0]
              const bgHex = bg.match(/#[0-9A-Fa-f]{6}/)[0]
              return (
                <div key={name} style={{ display: 'flex', fontSize: 14, alignItems: 'stretch', borderBottom: i === CONTRAST.length - 1 ? 'none' : `1px solid ${colors.gray[100]}`, backgroundColor: pass ? 'transparent' : '#FFFBEB' }}>
                  <span style={{ flex: 2, padding: '11px 14px', fontWeight: 600 }}>{name}</span>
                  <span style={{ flex: 2, padding: '11px 14px', fontSize: 13, color: colors.gray[500], fontFamily: mono }}>{fg} / {bg}</span>
                  <span style={{ width: 90, padding: '11px 14px', fontFamily: mono, fontWeight: 700 }}>{r.toFixed(2)}:1</span>
                  <span style={{ width: 80, padding: '11px 14px', fontFamily: mono, color: colors.gray[500] }}>{need.toFixed(1)}:1</span>
                  <span style={{ width: 80, padding: '11px 14px', fontWeight: 800, color: pass ? '#047857' : '#B45309' }}>{pass ? 'PASS' : 'FAIL'}</span>
                  <span style={{ width: 110, padding: 8 }}>
                    <span style={{ display: 'block', backgroundColor: bgHex, color: fgHex, padding: '8px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600, textAlign: 'center', border: `1px solid ${colors.gray[200]}` }}>
                      보기 Aa
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        </Section>

        {/* 큰글씨 배율 */}
        <Section
          no="15"
          title="큰글씨 모드 배율"
          note="상단바의 큰글씨 버튼을 누르면 useTypography()가 sizeLarge 스케일로 통째로 바꾼다. 항목마다 배율이 달라 125%에서 143% 사이에 흩어져 있고, 평균은 131.7%다. 본문(sm/md)은 129~133% 구간에 모여 있다."
          source="tokens.js typography.size / typography.sizeLarge · hooks/useTypography.js"
        >
          <div style={{ width: '100%', border: `1px solid ${colors.gray[200]}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', backgroundColor: colors.gray[50], borderBottom: `1px solid ${colors.gray[200]}`, fontSize: 13, fontWeight: 700, color: colors.gray[500] }}>
              <b style={{ width: 150, padding: '10px 14px' }}>토큰</b>
              <b style={{ width: 90, padding: '10px 14px' }}>기본</b>
              <b style={{ width: 90, padding: '10px 14px' }}>큰글씨</b>
              <b style={{ width: 90, padding: '10px 14px' }}>배율</b>
              <b style={{ flex: 1, padding: '10px 14px' }}>실제 크기 비교</b>
            </div>
            {TYPE_SCALE.map(([k, base, large], i) => {
              const pct = Math.round((large / base) * 1000) / 10
              return (
                <div key={k} style={{ display: 'flex', alignItems: 'center', borderBottom: i === TYPE_SCALE.length - 1 ? 'none' : `1px solid ${colors.gray[100]}` }}>
                  <span style={{ width: 150, padding: '11px 14px', fontFamily: mono, fontSize: 14, fontWeight: 600 }}>{k}</span>
                  <span style={{ width: 90, padding: '11px 14px', fontFamily: mono, fontSize: 14 }}>{base}px</span>
                  <span style={{ width: 90, padding: '11px 14px', fontFamily: mono, fontSize: 14 }}>{large}px</span>
                  <span style={{ width: 90, padding: '11px 14px', fontFamily: mono, fontSize: 14, fontWeight: 700, color: colors.primary[700] }}>{pct}%</span>
                  <span style={{ flex: 1, padding: '8px 14px', display: 'flex', alignItems: 'baseline', gap: 14, overflow: 'hidden' }}>
                    <span style={{ fontSize: base, color: colors.gray[400], whiteSpace: 'nowrap' }}>충전</span>
                    <span style={{ fontSize: large, color: colors.gray[900], fontWeight: 600, whiteSpace: 'nowrap' }}>충전</span>
                  </span>
                </div>
              )
            })}
          </div>
        </Section>

        <p style={{ fontSize: 14, color: colors.gray[400], lineHeight: 1.8, paddingTop: 28, borderTop: `1px solid ${colors.gray[200]}`, wordBreak: 'keep-all' }}>
          이 페이지의 컴포넌트는 앱과 같은 소스를 import한다. 컴포넌트를 고치면 이 문서도 같이 바뀐다.
          검색창과 코치마크 말풍선 두 개만 재현이고, 그 이유는 각 항목에 적어 뒀다.
        </p>
      </div>
    </div>
  )
}
