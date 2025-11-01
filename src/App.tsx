import Typography from './components/Typography'
import { Footer } from './components/Footer'
import { MainBanner } from './components/MainBanner'

export default function App() {
  return (
    <>
      <Typography variant="display" size="large"><></></Typography>
      
      <main>
        <MainBanner />
      </main>
      <Footer />
    </>
  )
}
