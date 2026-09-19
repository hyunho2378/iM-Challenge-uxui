import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import QRScannerScreen from '../components/payment/QRScannerScreen'
import storesData from '../data/stores.json'

// QR 결제 가능 매장 (isQR: true) 캐싱
const QR_STORES = storesData.filter((s) => s.isQR === true)

// 결제 금액 랜덤 (3,000~50,000원, 1,000원 단위)
function randomQRAmount() {
  const min = 3
  const max = 50
  return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000
}

function randomQRStore() {
  if (QR_STORES.length === 0) return null
  return QR_STORES[Math.floor(Math.random() * QR_STORES.length)]
}

export default function QRPage() {
  const navigate = useNavigate()
  const { balance } = useUser()

  // 주소로 바로 들어와 앱 안에 이전 화면이 없으면 뒤로 갈 곳이 없다(앱 밖으로 나가 버린다). 그때는 홈으로 보낸다
  const handleClose = () => {
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/', { replace: true })
  }

  const handleQRScan = () => {
    // QR 내용 무관 — 어떤 QR이든 결제 후보로 처리
    // 차감은 사용자가 "결제하기" 누르는 시점에 QRScannerScreen.handlePay에서
    const store = randomQRStore()
    if (!store) return null
    const amount = randomQRAmount()
    return { storeName: store.name, amount }
  }

  return (
    <QRScannerScreen
      onClose={handleClose}
      balance={balance}
      onCharge={() => navigate('/charge')}
      onScan={handleQRScan}
    />
  )
}
