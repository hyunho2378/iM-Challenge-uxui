import ScreenContainer from '../components/layout/ScreenContainer'
import BottomNavBar from '../components/layout/BottomNavBar'
// HIDDEN (Phase 3 feedback): QRFloatingBar → 바텀탭 QR 중앙 버튼으로 대체
// import QRFloatingBar from '../components/layout/QRFloatingBar'
import StoreMapScreen from '../components/store/StoreMapScreen'

export default function StorePage() {
  return (
    <ScreenContainer transparentStatusBar>
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <StoreMapScreen />
      </div>

      {/* HIDDEN (Phase 3 feedback): QRFloatingBar */}
      {/* <QRFloatingBar /> */}
      <BottomNavBar />
    </ScreenContainer>
  )
}
