import { useEffect, useRef, useState } from 'react'
import { Search, Menu, User, LogOut } from 'lucide-react'
import { Button, TextInput, Link } from '@krds-ui/core'

interface HeaderProps {
  isLoggedIn?: boolean
  onLoginClick?: () => void
  onLogoutClick?: () => void
  onNavigate?: (page: string) => void
  currentPage?: string
}

export function Header({
  isLoggedIn = false,
  onLoginClick,
  onLogoutClick,
  onNavigate,
  currentPage = 'main',
}: HeaderProps) {
  const navItems = [
    { key: 'main', label: '홈' },
    { key: 'discussions', label: '솔루션 토의실' },
    { key: 'proposals', label: '진행중인 제안' },
    { key: 'completed', label: '완료된 프로젝트' },
    { key: 'guide', label: '가이드' },
    { key: 'notice', label: '공지사항' },
  ] as const

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (!mobileMenuRef.current) return
      if (!mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    if (mobileMenuOpen) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [mobileMenuOpen])

  return (
    <header className="bg-gray-0 border-b border-gray-20 shadow-sm">
      {/* Top utility bar */}
      <div className="bg-gray-0 border-b border-gray-20 mobile:hidden tablet:block">
        <div className="mx-auto mobile:px-4 tablet:max-w-7xl tablet:px-6 desktop:px-8">
          <div className="flex justify-between items-center h-8 text-sm text-gray-70">
            <div className="flex items-center space-x-4">
              <span>시민참여 플랫폼</span>
              <span>•</span>
              <span>경기도청 공식 웹사이트</span>
            </div>

            <div className="flex items-center space-x-4">
              {
                <>
                  <Link
                    size="s"
                    weight="regular"
                    color="gray-60"
                    href="/login"
                    title="로그인"
                    className="no-underline inline-flex items-center h-6 leading-none cursor-pointer hover:text-primary-50"
                  >
                    로그인
                  </Link>
                  <span className="self-center">•</span>
                  <Link
                    size="s"
                    weight="regular"
                    color="gray-60"
                    href="/signup"
                    title="회원가입"
                    className="no-underline inline-flex items-center h-6 leading-none cursor-pointer hover:text-primary-50"
                  >
                    회원가입
                  </Link>
                </>
              }
              <span className="self-center">•</span>
              <Link
                size="s"
                weight="regular"
                color="gray-60"
                href="/sitemap"
                title="사이트맵"
                className="no-underline inline-flex items-center h-6 leading-none cursor-pointer hover:text-primary-50"
              >
                사이트맵
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto bg-gray-0 mobile:px-4 tablet:max-w-7xl tablet:px-6 desktop:px-8">
        <div
          className="
            flex mobile:flex-col mobile:items-start mobile:gap-3 mobile:py-3 mobile:h-auto mobile:relative
            tablet:flex-row tablet:items-center tablet:justify-between tablet:h-16 tablet:py-0
          "
        >
          {/* Logo */}
          <button
            onClick={() => onNavigate?.('main')}
            className="mobile:inline-flex mobile:w-auto flex items-center space-x-4 hover:opacity-80 transition-opacity mobile:pr-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-40 rounded-lg"
          >
            <div className="w-9 h-9 bg-primary-50 rounded-md flex items-center justify-center">
              <span className="text-gray-0 font-bold text-lg">경</span>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-90 leading-tight">
                경기 파트너스
              </h1>
              <p className="text-sm text-gray-60 leading-tight">
                Gyeonggi Partners
              </p>
            </div>
          </button>

          {/* Search */}
          <div className="mobile:w-full tablet:flex-1 tablet:max-w-lg tablet:mx-8 mobile:order-3 tablet:order-none">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-50 w-4 h-4 pointer-events-none z-10" />
              <TextInput
                id="header-search"
                placeholder="솔루션 토의실 검색"
                length="full"
                className="
                  w-full pl-10 pr-4 py-2
                  bg-gray-10 border border-gray-20 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-gray-40
                "
              />
            </div>
          </div>

          {/* User menu + 햄버거 */}
          <div
            className="
              flex items-center space-x-2
              tablet:relative tablet:-top-1
              desktop:relative desktop:-top-1
              mobile:absolute mobile:top-2 mobile:right-3 mobile:z-40 tablet:z-40 mobile:-my-1
            "
          >
            {isLoggedIn ? (
              <>
                <Button
                  variant="text"
                  size="small"
                  className="
                    px-2 py-0
                    [&>label]:flex [&>label]:items-center [&>label]:gap-1
                    [&>label]:no-underline
                    [&>label]:text-gray-70 hover:[&>label]:text-primary-50
                  "
                >
                  <User className="w-4 h-4 mr-1 align-middle" />
                  <span className="mobile:hidden">내 활동</span>
                </Button>
                <Button
                  variant="text"
                  size="small"
                  onClick={onLogoutClick}
                  className="
                    px-2 py-0
                    [&>label]:flex [&>label]:items-center [&>label]:gap-1
                    [&>label]:no-underline
                    [&>label]:text-gray-70 hover:[&>label]:text-primary-50
                  "
                >
                  <LogOut className="w-4 h-4 mr-1 align-middle" />
                  로그아웃
                </Button>
              </>
            ) : (
              <Button
                variant="text"
                size="small"
                onClick={onLoginClick}
                className="
                  px-2 py-0
                  [&>label]:flex [&>label]:items-center [&>label]:gap-1
                  [&>label]:no-underline
                  [&>label]:text-gray-70 hover:[&>label]:text-primary-50
                "
              >
                <User className="w-4 h-4 mr-1 align-middle" />
                로그인
              </Button>
            )}

            {/* 햄버거 버튼 */}
            <Button
              variant="text"
              size="small"
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-haspopup="menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-quick-menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="
                px-2 py-0
                [&>label]:flex [&>label]:items-center
                [&>label]:no-underline
                [&>label]:text-gray-70 hover:[&>label]:text-primary-50
                tablet:hidden desktop:hidden mobile:inline-flex 
              "
            >
              <Menu className="w-4 h-4 align-middle" />
            </Button>
          </div>

          {/* 모바일 전용 드롭다운 패널 */}
          <div
            ref={mobileMenuRef}
            id="mobile-quick-menu"
            role="menu"
            className={`
              mobile:block tablet:hidden desktop:hidden
              absolute right-3 top-12
              w-40 rounded-xl border border-gray-10 bg-gray-0 shadow-lg
              transition-all duration-150 z-50
              ${
                mobileMenuOpen
                  ? 'opacity-100 pointer-events-auto translate-y-0'
                  : 'opacity-0 pointer-events-none -translate-y-1'
              }
            `}
          >
            <ul className="py-2">
              <li>
                <Link
                  size="s"
                  weight="regular"
                  color="gray-70"
                  href="/login"
                  title="로그인"
                  className="block w-full px-3 py-2 no-underline hover:bg-gray-10"
                >
                  로그인
                </Link>
              </li>
              <li>
                <Link
                  size="s"
                  weight="regular"
                  color="gray-70"
                  href="/signup"
                  title="회원가입"
                  className="block w-full px-3 py-2 no-underline hover:bg-gray-10"
                >
                  회원가입
                </Link>
              </li>
              <li>
                <Link
                  size="s"
                  weight="regular"
                  color="gray-70"
                  href="/sitemap"
                  title="사이트맵"
                  className="block w-full px-3 py-2 no-underline hover:bg-gray-10"
                >
                  사이트맵
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-primary-50">
        <div className="mx-auto mobile:px-2 tablet:max-w-7xl tablet:px-6 desktop:px-8">
          <nav className="flex items-center h-12 gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            {navItems.map(({ key, label }) => {
              const active = currentPage === key
              return (
                <Link
                  key={key}
                  size="s"
                  weight="regular"
                  color="gray-0"
                  href="#"
                  title={label}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'no-underline px-3 py-2 rounded-md transition-colors',
                    'hover:text-gray-30 focus:outline-none focus:ring-1 focus:ring-gray-30',
                    active ? 'font-bold' : 'font-normal',
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
