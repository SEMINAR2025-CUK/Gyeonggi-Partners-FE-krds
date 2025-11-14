import Typography from './components/Typography'

import { Routes, Route } from 'react-router-dom'
import { Footer } from './components/Footer'
import { MainBanner } from './components/MainBanner'
import { Header } from './components/Header'
import SignupForm from './pages/SignUpForm'
import SignInForm from './pages/SignInForm'
import SolutionForumPage from './pages/solutionforumpage/SolutionForumPage'

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
      <Footer />
    </>
  )
}
