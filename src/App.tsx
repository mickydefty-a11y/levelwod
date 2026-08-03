import { Route, Routes, useLocation } from 'react-router-dom'
import BenchmarkDetail from './pages/BenchmarkDetail'
import BottomNav from './components/BottomNav'
import Breathing from './pages/Breathing'
import Home from './pages/Home'
import Library from './pages/Library'
import MovementDetail from './pages/MovementDetail'
import OnboardingFlow from './pages/OnboardingFlow'
import OneRepMaxCalculatorPage from './pages/OneRepMaxCalculatorPage'
import Programs from './pages/Programs'
import ProgramComparisonView from './pages/ProgramComparisonView'
import ProgramDetail from './pages/ProgramDetail'
import ProgramQuizPage from './pages/ProgramQuizPage'
import Progress from './pages/Progress'
import ShareCard from './pages/ShareCard'
import Timer from './pages/Timer'
import Welcome from './pages/Welcome'
import Wod from './pages/Wod'

export default function App() {
  const location = useLocation()
  const hideNav = location.pathname === '/welcome' || location.pathname === '/onboarding'

  return (
    <div className="min-h-screen bg-bg text-ink">
      <main
        className={`mx-auto max-w-md px-4 pt-[calc(env(safe-area-inset-top)+1.5rem)] ${hideNav ? 'pb-6' : 'pb-24'}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:id" element={<MovementDetail />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/quiz" element={<ProgramQuizPage />} />
          <Route path="/programs/compare" element={<ProgramComparisonView />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/progress/share" element={<ShareCard />} />
          <Route path="/tools/1rm-calculator" element={<OneRepMaxCalculatorPage />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/breathing" element={<Breathing />} />
          <Route path="/wod" element={<Wod />} />
          <Route path="/benchmarks/:id" element={<BenchmarkDetail />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
