import Typography from './components/temp/Typography'
import { Footer } from './components/Footer'
import { MainBanner } from './components/MainBanner'
import { Header } from './components/Header'
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
