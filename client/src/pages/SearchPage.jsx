import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock } from 'lucide-react'

import ScreenContainer from '../components/layout/ScreenContainer'
import TopAppBarBack from '../components/layout/TopAppBarBack'
import PopularKeywords from '../components/search/PopularKeywords'
import { colors, typography, layout, spacing } from '../tokens/tokens'
import { usePlatform } from '../hooks/usePlatform'

const MOCK_STORES = [
  { id: 1, name: '초당순두부', category: '음식점', distance: '0.3km' },
  { id: 2, name: '강릉중앙시장', category: '마트', distance: '1.1km' },
  { id: 3, name: '보헤미안커피', category: '카페', distance: '0.8km' },
  { id: 4, name: '테라로사 강릉 본점', category: '카페', distance: '0.4km' },
  { id: 5, name: '강릉 GS25 경포점', category: '편의점', distance: '0.5km' },
  { id: 6, name: '경포해변 쏠비치', category: '숙박', distance: '1.2km' },
  { id: 7, name: '강릉관광안내소', category: '관광', distance: '0.7km' },
]

export default function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const [searchFocused, setSearchFocused] = useState(false)
  const isAndroid = usePlatform() === 'android'

  function addToRecent(keyword) {
    setRecentSearches(prev =>
      [keyword, ...prev.filter(k => k !== keyword)].slice(0, 10)
    )
  }

  const filteredStores = MOCK_STORES.filter(store =>
    store.name.includes(query)
  )

  return (
    <ScreenContainer>
      <TopAppBarBack title="검색" onBack={() => navigate(-1)} />

      {/* 검색 입력 영역 — sticky */}
      <div style={{
        position: 'sticky',
        top: layout.topBarHeight,
        zIndex: 90,
        backgroundColor: colors.surface.card,
        borderBottom: `1px solid ${colors.gray[200]}`,
        padding: `${spacing[2]} ${layout.margin}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          backgroundColor: isAndroid ? colors.gray[100] : undefined,
          border: isAndroid ? 'none' : `1px solid ${colors.gray[200]}`,
          borderBottom: isAndroid ? `2px solid ${searchFocused ? colors.primary[700] : colors.gray[400]}` : undefined,
          borderRadius: isAndroid ? '8px 8px 0 0' : layout.radiusPill,
          padding: `${spacing[2]} ${spacing[4]}`,
        }}>
          <Search size={16} color={colors.gray[400]} strokeWidth={2} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="매장·서비스 검색"
            autoFocus
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontSize: typography.size.sm,
              fontFamily: typography.fontFamily,
              color: colors.gray[900],
              backgroundColor: 'transparent',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} color={colors.gray[400]} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* 스크롤 콘텐츠 영역 */}
      <div style={{ flex: 1 }}>
        {query === '' ? (
          <>
            {/* 최근 검색 섹션 */}
            {recentSearches.length > 0 && (
              <div style={{ padding: `${spacing[4]} 0 0` }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `0 ${layout.margin} ${spacing[2]}`,
                }}>
                  <span style={{
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.semibold,
                    color: colors.gray[500],
                    fontFamily: typography.fontFamily,
                  }}>
                    최근 검색
                  </span>
                  <button
                    onClick={() => setRecentSearches([])}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: typography.size.xs,
                      color: colors.gray[400],
                      fontFamily: typography.fontFamily,
                      padding: 0,
                    }}
                  >
                    전체 삭제
                  </button>
                </div>

                {recentSearches.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => setQuery(keyword)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      minHeight: layout.touchMin,
                      padding: `0 ${layout.margin}`,
                      gap: spacing[2],
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Clock size={12} color={colors.gray[400]} strokeWidth={2} />
                    <span style={{
                      flex: 1,
                      textAlign: 'left',
                      fontSize: typography.size.sm,
                      color: colors.gray[700],
                      fontFamily: typography.fontFamily,
                    }}>
                      {keyword}
                    </span>
                    <span
                      onClick={e => {
                        e.stopPropagation()
                        setRecentSearches(prev => prev.filter(k => k !== keyword))
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: spacing[1],
                      }}
                    >
                      <X size={12} color={colors.gray[400]} strokeWidth={2} />
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* 자주 찾는 키워드 섹션 */}
            <PopularKeywords
              onKeywordClick={(k) => {
                setQuery(k)
                addToRecent(k)
              }}
            />
          </>
        ) : (
          /* 검색 결과 */
          filteredStores.length > 0 ? (
            <div>
              <p style={{
                margin: 0,
                padding: `${spacing[3]} ${layout.margin} ${spacing[1]}`,
                fontSize: typography.size.xs,
                color: colors.gray[500],
                fontFamily: typography.fontFamily,
              }}>
                {filteredStores.length}개의 결과
              </p>

              {filteredStores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => {
                    addToRecent(store.name)
                    navigate('/store')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    minHeight: layout.touchMin,
                    padding: `${spacing[3]} ${layout.margin}`,
                    background: 'none',
                    border: 'none',
                    borderBottom: `1px solid ${colors.gray[100]}`,
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <p style={{
                      margin: 0,
                      fontSize: typography.size.sm,
                      fontWeight: typography.weight.semibold,
                      color: colors.gray[900],
                      fontFamily: typography.fontFamily,
                    }}>
                      {store.name}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: typography.size.xs,
                      color: colors.gray[400],
                      fontFamily: typography.fontFamily,
                    }}>
                      {store.category}
                    </p>
                  </div>
                  <span style={{
                    fontSize: typography.size.xs,
                    color: colors.gray[500],
                    fontFamily: typography.fontFamily,
                    flexShrink: 0,
                  }}>
                    {store.distance}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            /* 빈 상태 */
            <div style={{
              paddingTop: spacing[10],
              textAlign: 'center',
            }}>
              <p style={{
                margin: 0,
                fontSize: typography.size.sm,
                color: colors.gray[400],
                fontFamily: typography.fontFamily,
              }}>
                검색 결과가 없습니다
              </p>
            </div>
          )
        )}
      </div>
    </ScreenContainer>
  )
}
