import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { createSession } from '../lib/api'

const AppContext = createContext(null)

// 클라이언트 폴백 — 서버 발급 실패 시 사용
function generateFallbackSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function AppProvider({ children }) {
  const [isLargeText, setIsLargeText] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  // 초기값은 null — 서버 응답 후 채워짐
  const [sessionId, setSessionId] = useState(null)
  const [snackbar, setSnackbar] = useState(null)
  const sessionRequestedRef = useRef(false)

  // Provider 마운트 시 서버에서 세션 발급
  useEffect(() => {
    // StrictMode 중복 실행 방어 — createSession은 1회만 호출
    if (sessionRequestedRef.current) return
    sessionRequestedRef.current = true

    createSession()
      .then((id) => {
        setSessionId(id || generateFallbackSessionId())
      })
      .catch(() => {
        setSessionId(generateFallbackSessionId())
      })
  }, [])

  // 큰글씨 모드에서는 body에 표식을 단다.
  // index.css가 이 클래스를 보고 유리를 시니어가 읽을 수 있는 강도로 낮춘다.
  useEffect(() => {
    document.body.classList.toggle('senior-mode', isLargeText)
  }, [isLargeText])

  return (
    <AppContext.Provider value={{
      isLargeText,
      toggleLargeText: () => setIsLargeText(v => !v),
      showAnnouncement,
      closeAnnouncement: () => setShowAnnouncement(false),
      sessionId,
      snackbar,
      showSnackbar: (message, actionLabel = null) => setSnackbar({ message, actionLabel }),
      hideSnackbar: () => setSnackbar(null),
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
