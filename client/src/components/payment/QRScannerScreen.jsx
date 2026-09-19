/**
 * QRScannerScreen (Sprint 1 — 실제 카메라 연동)
 * Strategy: S4, S5
 * Nielsen: #1 visibility, #4 closure, #5 error prevention, #9 error recovery
 * Shneiderman: #3 informative feedback, #4 design for closure, #5 simple error handling
 */

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { colors, typography, layout, spacing, shadow } from '../../tokens/tokens'
import { usePlatform } from '../../hooks/usePlatform'
import { useOnboarding } from '../../context/OnboardingContext'
import Button from '../common/Button'
import CoachMarkOverlay from '../common/CoachMarkOverlay'

const LOW_BALANCE = 10000

// 카메라를 켜지 못한 이유별 안내. 권한 거부와 카메라 없음/사용 중은 사용자가 할 일이 달라 문구를 나눈다
const CAMERA_NOTICE = {
  permission_denied: {
    title: '카메라 접근을 허용해주세요',
    hint: '설정 → 앱 → 카메라 권한 허용 후\n다시 시도해주세요',
  },
  camera_unavailable: {
    title: '카메라를 사용할 수 없어요',
    hint: '카메라를 찾지 못했거나 다른 앱이 쓰고 있어요.\n카메라가 있는 기기에서 다시 시도해주세요',
  },
}

// html5-qrcode는 실패 이유를 문자열로 돌려준다(예: "... error = NotAllowedError: Permission denied")
const classifyCameraError = (err) =>
  /NotAllowed|Permission|denied/i.test(String(err)) ? 'permission_denied' : 'camera_unavailable'

// 카메라 시작과 정지를 한 줄로 세운다. 화면을 빠르게 열고 닫거나 권한 요청이 끝나기 전에 나가도
// start와 stop이 겹치지 않고, 늦게 켜진 카메라도 곧바로 꺼진다.
// (html5-qrcode의 stop()은 스캔 중이 아니면 동기 예외를 던지므로 시작이 끝난 뒤에만 부른다)
let scannerQueue = Promise.resolve()
const enqueueScanner = (task) => { scannerQueue = scannerQueue.then(task).catch(() => {}) }

// html5-qrcode는 video.play()가 돌려주는 프로미스의 거부를 처리하지 않는다. 카메라가 막 켜지는 순간 화면을 닫아
// video가 문서에서 빠지면 AbortError가 콘솔에 처리되지 않은 에러로 남는다. 시작하는 동안만 그 거부를 삼킨다.
const withPlayRejectionGuard = async (start) => {
  const proto = HTMLMediaElement.prototype
  const original = proto.play
  proto.play = function guardedPlay(...args) {
    const played = original.apply(this, args)
    if (played?.catch) played.catch(() => {})
    return played
  }
  try { return await start() } finally { proto.play = original }
}

export default function QRScannerScreen({ onClose, balance = 120000, onCharge, cardCount = 1, onScan }) {
  const navigate = useNavigate()
  const { spendBalance } = useUser()
  const isAndroid = usePlatform() === 'android'
  const [scanPulse, setScanPulse] = useState(true)
  // 'init' | 'scanning' | 'permission_denied' | 'camera_unavailable'
  const [cameraState, setCameraState] = useState('init')
  const [scannedData, setScannedData] = useState(null)
  const [paymentDone, setPaymentDone] = useState(false)

  const scannedRef = useRef(false)
  const payTimerRef = useRef(null)

  // 10차 3번: QR결제 코치마크. 카메라 영역과 하단 잔액 패널을 차례로 집는다.
  const { hasSeenQRScanCoach, markSeen } = useOnboarding()
  const viewfinderRef = useRef(null)
  const balancePanelRef = useRef(null)
  const [qrCoachStep, setQrCoachStep] = useState(hasSeenQRScanCoach ? 0 : 1)

  // Q-03: 스캔 상태 펄스 피드백 (Nielsen #1)
  useEffect(() => {
    const interval = setInterval(() => setScanPulse((p) => !p), 750)
    return () => clearInterval(interval)
  }, [])

  // 카메라 초기화. 나갈 때 반드시 정리한다: 시작이 끝나기 전에 나가면(권한 요청 중 포함) 시작을 건너뛰거나,
  // 시작이 늦게 끝난 경우 곧바로 멈춘다.
  useEffect(() => {
    let disposed = false
    let started = null  // 카메라를 실제로 켠 스캐너
    enqueueScanner(async () => {
      if (disposed) return
      const scanner = new Html5Qrcode('qr-reader')
      try {
        await withPlayRejectionGuard(() => scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          (decodedText) => {
            if (scannedRef.current) return
            const result = onScan?.(decodedText)
            if (!result) return  // onScan 없거나 매장 풀 비었음 → 결제 불가
            scannedRef.current = true
            setScannedData({
              amount: result.amount,
              storeName: result.storeName,
              raw: decodedText,
            })
          },
          () => {}
        ))
        started = scanner
        if (!disposed) setCameraState('scanning')
      } catch (err) {
        if (!disposed) setCameraState(classifyCameraError(err))
      }
    })

    return () => {
      disposed = true
      enqueueScanner(async () => {
        if (!started) return
        try { await started.stop() } catch { /* 이미 멈춘 상태 */ }
      })
    }
  }, [])

  // 결제 완료 화면에서 홈으로 넘어가는 타이머는 화면을 나가면 함께 정리한다
  useEffect(() => () => clearTimeout(payTimerRef.current), [])

  // html5-qrcode video/canvas stretch 방지 — object-fit: cover 강제
  useEffect(() => {
    const styleId = 'qr-reader-style-fix'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        #qr-reader video,
        #qr-reader canvas {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  // 3초 후 자동 결제 시트 (시연용) — QR 인식 실패해도 결제 가능
  useEffect(() => {
    if (cameraState !== 'scanning') return
    if (scannedRef.current) return

    const timer = setTimeout(() => {
      if (scannedRef.current) return
      if (!onScan) return
      const result = onScan('AUTO_DEMO_SCAN')
      if (!result) return
      scannedRef.current = true
      setScannedData({
        amount: result.amount,
        storeName: result.storeName,
        raw: 'AUTO_DEMO',
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [cameraState, onScan])

  const handlePay = () => {
    if (!scannedData) return
    // 잔액/캐시백 차감 + 이용내역 추가 + DB 기록(UserContext.spendBalance → logAction)
    spendBalance(scannedData.amount, scannedData.storeName)
    setPaymentDone(true)
    // replace: 결제 후 홈에서 뒤로가기를 눌렀을 때 스캐너(카메라)로 되돌아가지 않게 한다
    payTimerRef.current = setTimeout(() => navigate('/', { replace: true }), 1200)
  }

  const handleCharge = onCharge ?? (() => {})
  const cardName = cardCount === 1 ? '내 카드' : 'iM샵 1'
  const hasNoBalance = balance === 0
  const hasLowBalance = balance > 0 && balance < LOW_BALANCE
  const formattedBalance = balance.toLocaleString('ko-KR') + '원'
  // 결제 확인 시트용 예상 잔액 (캐시백 사용분 미반영, 보수적 표시)
  const projectedBalance = scannedData ? balance - scannedData.amount : balance

  // Shneiderman #4: 결제 완료 화면
  if (paymentDone) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: colors.primary[700],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: typography.fontFamily,
          zIndex: 100,
          gap: spacing[4],
        }}
      >
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <circle cx="36" cy="36" r="36" fill="rgba(255,255,255,0.12)" />
          <circle cx="36" cy="36" r="26" fill="rgba(255,255,255,0.18)" />
          <path d="M20 36L30 46L52 24" stroke={colors.onDark.primary} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ margin: 0, color: colors.onDark.primary, fontSize: typography.size.xl, fontWeight: typography.weight.bold }}>
          결제 완료
        </p>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: typography.size.md }}>
          {(scannedData?.amount ?? 0).toLocaleString('ko-KR')}원
        </p>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: typography.size.sm }}>
          잔액 {balance.toLocaleString('ko-KR')}원
        </p>
      </div>
    )
  }

  return (
    <div
      id="qr-scanner-screen"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: colors.surface.scannerBackdrop,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: typography.fontFamily,
        zIndex: 100,
      }}
    >
      {/* 상단 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: `${spacing[3]} ${layout.margin}`,
          paddingTop: '52px',
          gap: spacing[3],
        }}
      >
        <button
          onClick={onClose}
          aria-label="뒤로가기"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: spacing[1],
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowLeft size={24} color={colors.onDark.primary} />
        </button>
        <span
          style={{
            color: colors.onDark.primary,
            fontSize: typography.size.md,
            fontWeight: typography.weight.semibold,
          }}
        >
          QR 결제하기
        </span>
      </div>

      {/* 중앙 카메라 영역 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[4],
        }}
      >
        <div ref={viewfinderRef} style={{ position: 'relative', width: '300px', height: '300px' }}>
          {/* html5-qrcode 마운트 대상 */}
          <div
            id="qr-reader"
            style={{
              width: '300px',
              height: '300px',
              borderRadius: layout.radiusSmall,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.06)',
            }}
          />

          {/* Nielsen #1: 카메라 초기화 로딩 인디케이터 */}
          {cameraState === 'init' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
                zIndex: 3,
                pointerEvents: 'none',
              }}
            >
              {isAndroid ? (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="none" />
                  <circle cx="20" cy="20" r="16" stroke={colors.primary[700]} strokeWidth="4" fill="none"
                    strokeDasharray="75 25" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite" />
                  </circle>
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" fill="none" />
                  <path d="M14 3 A11 11 0 0 1 25 14" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" fill="none">
                    <animateTransform attributeName="transform" type="rotate" from="0 14 14" to="360 14 14" dur="0.9s" repeatCount="indefinite" />
                  </path>
                </svg>
              )}
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: typography.size.xxs }}>카메라 준비 중</span>
            </div>
          )}

          {/* Nielsen #9: 카메라를 못 켠 이유 오버레이 — 한국어 평문 */}
          {CAMERA_NOTICE[cameraState] && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.85)',
                borderRadius: layout.radiusSmall,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[3],
                padding: spacing[4],
                zIndex: 3,
              }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
                <path d="M12 12 L24 24 M24 12 L12 24" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span
                style={{
                  color: colors.onDark.primary,
                  fontSize: typography.size.xs,
                  textAlign: 'center',
                  lineHeight: 1.6,
                }}
              >
                {CAMERA_NOTICE[cameraState].title}
              </span>
              <span
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: typography.size.xxs,
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}
              >
                {CAMERA_NOTICE[cameraState].hint}
              </span>
            </div>
          )}

          {/* L자형 코너 브래킷 — 보존 (Phase 1 시각 품질) */}
          <svg
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none' }}
            width="32" height="32" viewBox="0 0 32 32" fill="none"
          >
            <path d="M2 26 L2 2 L26 2" stroke={colors.onDark.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <svg
            style={{ position: 'absolute', top: 0, right: 0, zIndex: 2, pointerEvents: 'none' }}
            width="32" height="32" viewBox="0 0 32 32" fill="none"
          >
            <path d="M6 2 L30 2 L30 26" stroke={colors.onDark.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <svg
            style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 2, pointerEvents: 'none' }}
            width="32" height="32" viewBox="0 0 32 32" fill="none"
          >
            <path d="M2 6 L2 30 L26 30" stroke={colors.onDark.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <svg
            style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 2, pointerEvents: 'none' }}
            width="32" height="32" viewBox="0 0 32 32" fill="none"
          >
            <path d="M6 30 L30 30 L30 6" stroke={colors.onDark.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        {/* Q-03: 스캔 상태 문구 펄스 (Nielsen #1, Shneiderman #3) */}
        <span
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: typography.size.xs,
            fontWeight: typography.weight.medium,
            opacity: scanPulse ? 1 : 0.35,
            transition: 'opacity 200ms cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          {CAMERA_NOTICE[cameraState]?.title ?? 'QR 코드를 화면에 맞춰주세요'}
        </span>
      </div>

      {/* 하단 카드 패널 */}
      <div
        ref={balancePanelRef}
        style={{
          backgroundColor: colors.surface.card,
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: spacing[5],
          boxShadow: shadow.modal,
        }}
      >
        {/* Q-01: 잔액 없음 경고 — S5, Nielsen #5 */}
        {hasNoBalance && (
          <div
            style={{
              backgroundColor: colors.alertBg,
              border: `1px solid ${colors.alertBorder}`,
              borderRadius: layout.radiusSmall,
              padding: `${spacing[3]} ${spacing[4]}`,
              marginBottom: spacing[4],
              display: 'flex',
              flexDirection: 'column',
              gap: spacing[2],
            }}
          >
            <p style={{ margin: 0, fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.errorDark }}>
              잔액이 없습니다
            </p>
            <p style={{ margin: 0, fontSize: typography.size.xs, color: colors.error }}>
              충전 후 결제해주세요.
            </p>
            <Button
              variant="filled"
              size="sm"
              fullWidth={false}
              onClick={handleCharge}
              style={{ alignSelf: 'flex-start', backgroundColor: colors.error, boxShadow: 'none' }}
            >
              충전하러 가기
            </Button>
          </div>
        )}

        {/* S5, Nielsen #5: 잔액 부족 경고 */}
        {hasLowBalance && (
          <div
            style={{
              backgroundColor: colors.warningBg,
              border: `1px solid ${colors.warningBorder}`,
              borderRadius: layout.radiusSmall,
              padding: `${spacing[3]} ${spacing[4]}`,
              marginBottom: spacing[4],
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: typography.size.xs, fontWeight: typography.weight.medium, color: colors.warning }}>
              잔액이 부족할 수 있습니다 ({formattedBalance})
            </p>
            <Button
              variant="filled"
              size="sm"
              fullWidth={false}
              onClick={handleCharge}
              style={{ backgroundColor: 'transparent', border: `1px solid ${colors.warning}`, color: colors.warning, boxShadow: 'none' }}
            >
              충전
            </Button>
          </div>
        )}

        {/* 카드 정보 — Q-02, Nielsen #1 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing[4],
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: colors.primary[700],
                borderRadius: layout.radiusSmall,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCard size={20} color={colors.onDark.primary} />
            </div>
            <div>
              <div style={{ fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
                {cardName}
              </div>
              <div
                style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.semibold,
                  color: hasNoBalance ? colors.error : hasLowBalance ? colors.warning : colors.primary[700],
                  marginTop: '2px',
                  transition: 'color 120ms cubic-bezier(0.23,1,0.32,1)',
                }}
              >
                {formattedBalance}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 결제 확인 바텀시트 — Shneiderman #4 closure */}
      {scannedData && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 200,
          }}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: colors.surface.card,
              borderTopLeftRadius: layout.radiusModal,
              borderTopRightRadius: layout.radiusModal,
              padding: spacing[5],
              boxShadow: shadow.modal,
            }}
          >
            {/* 핸들 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing[4] }}>
              <div style={{ width: '32px', height: '4px', borderRadius: layout.radiusPill, backgroundColor: colors.gray[300] }} />
            </div>

            <p style={{ margin: `0 0 ${spacing[2]}`, fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.gray[900] }}>
              결제 확인
            </p>

            {scannedData?.storeName && (
              <p style={{
                margin: `0 0 ${spacing[5]}`,
                fontSize: typography.size.sm,
                color: colors.gray[700],
                lineHeight: 1.5,
              }}>
                <span style={{ fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
                  {scannedData.storeName}
                </span>
                에서 결제하시겠습니까?
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[3] }}>
              <span style={{ fontSize: typography.size.sm, color: colors.gray[500] }}>결제 금액</span>
              <span style={{ fontSize: typography.size.sm, fontWeight: typography.weight.semibold, color: colors.gray[900] }}>
                {scannedData.amount.toLocaleString('ko-KR')}원
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[5] }}>
              <span style={{ fontSize: typography.size.sm, color: colors.gray[500] }}>잔액</span>
              <span style={{ fontSize: typography.size.sm, color: colors.gray[500] }}>
                {balance.toLocaleString('ko-KR')}원 →{' '}
                <span style={{ fontWeight: typography.weight.semibold, color: colors.primary[700] }}>
                  {projectedBalance.toLocaleString('ko-KR')}원
                </span>
              </span>
            </div>

            <div style={{ display: 'flex', gap: spacing[3] }}>
              <Button
                variant="outlined"
                size="md"
                fullWidth={false}
                style={{ flex: 1, color: colors.gray[700], border: `1px solid ${colors.gray[200]}` }}
                onClick={() => {
                  scannedRef.current = false
                  setScannedData(null)
                }}
              >
                취소
              </Button>
              <Button
                variant="filled"
                size="md"
                fullWidth={false}
                style={{ flex: 2 }}
                onClick={handlePay}
              >
                결제하기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 10차 3번: QR결제 코치마크 — 기존 화면과 같은 스포트라이트+말풍선+건너뛰기/다음 패턴 */}
      {qrCoachStep === 1 && (
        <CoachMarkOverlay
          containerId="qr-scanner-screen"
          targetRef={viewfinderRef}
          message="가맹점에 붙어 있는 QR 코드를 이 네모 안에 비추면 결제 금액이 자동으로 뜹니다. 금액을 확인하고 [결제하기]를 누르면 끝입니다."
          step={1}
          totalSteps={2}
          onNext={() => setQrCoachStep(2)}
          onSkip={() => { markSeen('qrScan'); setQrCoachStep(0) }}
        />
      )}

      {qrCoachStep === 2 && (
        <CoachMarkOverlay
          containerId="qr-scanner-screen"
          targetRef={balancePanelRef}
          message="여기에서 쓸 수 있는 잔액을 확인합니다. 잔액이 모자라면 [충전하러 가기] 버튼이 나타나고, 누르면 충전 화면으로 바로 넘어갑니다."
          step={2}
          totalSteps={2}
          onNext={() => { markSeen('qrScan'); setQrCoachStep(0) }}
          onSkip={() => { markSeen('qrScan'); setQrCoachStep(0) }}
        />
      )}
    </div>
  )
}
