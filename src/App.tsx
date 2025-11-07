import Typography from './components/Typography'
import { Footer } from './components/Footer'
import { MainBanner } from './components/MainBanner'
import { BasicChat } from './pages/ChatRoom' // chat-ui-kit 임시 테스트

export default function App() {
  return (
    <>
      <Typography variant="display" size="large"><></></Typography>

      <main>
        <MainBanner />
      </main>

      {/**chat-ui-kit 임시 테스트*/}
      <BasicChat></BasicChat>

      <Footer />
    </>
  )
}
