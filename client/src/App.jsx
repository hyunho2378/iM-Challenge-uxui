import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { applyPlatformClass } from './hooks/usePlatform'
import { AppProvider } from './context/AppContext'
import { OnboardingProvider } from './context/OnboardingContext'
import { UserProvider } from './context/UserContext'
import ScreenContainer from './components/layout/ScreenContainer'
import { colors, glass, typography } from './tokens/tokens'
import SplashPage from './pages/SplashPage'
import AuthGateScreen from './components/auth/AuthGateScreen'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import QRPage from './pages/QRPage'
import ChargePage from './pages/ChargePage'
import ChargeFreePage from './pages/ChargeFreePage'
import AccountLinkPage from './pages/AccountLinkPage'
import HistoryPage from './pages/HistoryPage'
import ServiceEditPage from './pages/ServiceEditPage'
import UsageGuidePage from './pages/UsageGuidePage'

import SettingsPage from './pages/SettingsPage'
import NotificationPage from './pages/NotificationPage'
import CustomerCenterPage from './pages/CustomerCenterPage'
import CardLostPage from './pages/CardLostPage'
import CouponPage from './pages/CouponPage'
// Phase 3 신규
import MyPage from './pages/MyPage'
import SearchPage from './pages/SearchPage'
import CardApplyPage from './pages/CardApplyPage'
import CardManagementPage from './pages/CardManagementPage'
import RefundPage from './pages/RefundPage'
import BenefitsPage from './pages/BenefitsPage'
import Snackbar from './components/common/Snackbar'
import TermsPage from './pages/TermsPage'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  // 07차 2번: 스플래시-홈 사이 최소 본인인증 게이트. 라우터 밖에서 렌더해 딥링크/뒤로가기에 영향 없다.
  const [gatePassed, setGatePassed] = useState(false)

  useEffect(() => {
    applyPlatformClass()
    // 색 단일 소스 유지: CSS는 토큰을 읽을 수 없으므로 body 배경을 여기서 주입한다
    document.body.style.backgroundColor = colors.surface.background
    // 유리 토큰과 본문 줄간격을 :root에 주입한다. index.css의 .glass 규칙이 이 변수만 참조한다
    const root = document.documentElement
    Object.entries(glass).forEach(([name, value]) => root.style.setProperty(name, value))
    root.style.setProperty('--app-line-height', String(typography.lineHeight.body))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return (
      <ScreenContainer statusBarBg={colors.primary[700]} statusBarLight>
        <SplashPage />
      </ScreenContainer>
    )
  }

  // AuthGateScreen은 useTypography()(→ useApp())를 쓰므로 AppProvider 안에서 렌더돼야 한다.
  // 라우터 자체는 게이트 통과 후에만 마운트하되, 프로바이더는 게이트 단계부터 감싼다.
  return (
    <AppProvider>
      <UserProvider>
      <OnboardingProvider>
      {!gatePassed ? (
        <ScreenContainer statusBarBg={colors.surface.card}>
          <AuthGateScreen onDone={() => setGatePassed(true)} onSkip={() => setGatePassed(true)} />
        </ScreenContainer>
      ) : (
      <BrowserRouter>
        <Routes>
          {/* 바텀탭 5개 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />

          {/* 결제/충전 */}
          <Route path="/qr" element={<QRPage />} />
          <Route path="/charge" element={<ChargePage />} />
          <Route path="/charge-free" element={<ChargeFreePage />} />
          <Route path="/account-link" element={<AccountLinkPage />} />
          <Route path="/history" element={<HistoryPage />} />

          {/* 서비스 안내 */}
          <Route path="/service-edit" element={<ServiceEditPage />} />
          <Route path="/usage-guide" element={<UsageGuidePage />} />

          {/* Phase 3 신규 */}
          <Route path="/my" element={<MyPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/card-apply" element={<CardApplyPage />} />
          <Route path="/card-management" element={<CardManagementPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/benefits" element={<BenefitsPage />} />

          {/* 메뉴/설정 */}
          <Route path="/menu" element={<Navigate to="/my" replace />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/customer-center" element={<CustomerCenterPage />} />
          <Route path="/card-lost" element={<CardLostPage />} />
          <Route path="/coupon" element={<CouponPage />} />

          <Route path="/terms" element={<TermsPage />} />
        </Routes>
        <Snackbar />
      </BrowserRouter>
      )}
      </OnboardingProvider>
      </UserProvider>
    </AppProvider>
  )
}

export default App
