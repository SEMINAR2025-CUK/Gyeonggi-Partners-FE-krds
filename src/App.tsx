import Typography from './components/Typography'
import { Footer } from './components/Footer'
import { MainBanner } from './components/MainBanner'
import { Header } from './components/Header'

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
      <Footer />
    </>
  )
}
