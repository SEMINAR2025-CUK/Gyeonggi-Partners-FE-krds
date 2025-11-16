import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Typography from './components/Typography'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { MainBanner } from './pages/mainpage/MainBanner'
import SignupForm from './pages/SignUpForm'
import SignInForm from './pages/SignInForm'
import SolutionForumPage from './pages/solutionforumpage/SolutionForumPage'

export default function App() {
  //  로그인 여부를 관리하는 전역 상태(추후에 recoil, zustand로 바꿔주면 좋음)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 처음 렌더될 시 한 번만 세션에서 accessToken 꺼내서 로그인 상태 복구
  useEffect(() => {
    // 세션 스토리지에 토큰 남아있으면 → 새로고침 후에도 로그인 유지
    const token = window.sessionStorage.getItem('accessToken')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  //  로그아웃 눌렀을 때 세션에 있는 토큰 싹 지우고 로그인 상태도 false
  const handleLogout = () => {
    window.sessionStorage.removeItem('accessToken')
    window.sessionStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
  }

  return (
    <>
      <Typography variant="display" size="large">
        <></>
      </Typography>

      <header>
        <Header
          // 헤더 쪽에서 자식 요소로 받고 있었음 따라서, 로그인/로그아웃 버튼 토글하는 기준값
          isLoggedIn={isLoggedIn}
          // 헤더에서 로그아웃 버튼 누르면 이 함수 타게 연결해둔거
          onLogoutClick={handleLogout}
        />
      </header>

      <main>
        <Routes>
          
          <Route path="/" element={<MainBanner />} />       
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/signin"
            element={
              <SignInForm
                onLoginSuccess={() => {
                  //  로그인 성공하면 isLoggedIn true로 올려주는 콜백
                  setIsLoggedIn(true)
                }}
              />
            }
          />

          <Route path="/solutionforum" element={<SolutionForumPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}
