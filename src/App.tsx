import { Routes, Route } from 'react-router-dom'
import Typography from './components/temp/Typography'
import { Footer } from './components/Footer'
import { MainBanner } from './components/MainBanner'
import { Header } from './components/Header'
import SignupForm from './pages/SignUpForm'
import SignInForm from './pages/SignInForm'
import SolutionForumPage from './pages/solutionforumpage/SolutionForumPage'
// import { BasicChat } from './pages/ChatRoom' // chat-ui-kit 임시 테스트
import Temp from './Temp'

export default function App() {
  return (
    <>
      <Typography variant="display" size="large">
        <></>
      </Typography>
      <header>
        <Header />
        <Routes>
          <Route path="/" element={<div>홈</div>} />
          <Route path="/signup" element={<SignupForm />} />  
          <Route path="/signin" element={<SignInForm />} />  
          <Route path="/solutionforum" element={<SolutionForumPage />} />  
        </Routes>
      </header>

      <main>
        <MainBanner />
      </main>

      {/**chat-ui-kit 임시 테스트*/}
      {/* <BasicChat></BasicChat> */}

      {/** 그룹 채팅 확인용 임시 컴포넌트 */}
      <Temp />

      <Footer />
    </>
  )
}
