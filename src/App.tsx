import { Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Library from './pages/Library'
import MovementDetail from './pages/MovementDetail'
import Programs from './pages/Programs'
import ProgramDetail from './pages/ProgramDetail'
import Progress from './pages/Progress'
import Timer from './pages/Timer'
import Welcome from './pages/Welcome'

export default function App() {
  const location = useLocation()
  const hideNav = location.pathname === '/welcome'

  return (
    <div className="min-h-screen bg-bg text-ink">
      <main className={`mx-auto max-w-md px-4 pt-6 ${hideNav ? 'pb-6' : 'pb-24'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:id" element={<MovementDetail />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/timer" element={<Timer />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
