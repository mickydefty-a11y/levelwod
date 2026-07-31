import { Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Library from './pages/Library'
import MovementDetail from './pages/MovementDetail'
import Programs from './pages/Programs'
import ProgramDetail from './pages/ProgramDetail'
import Progress from './pages/Progress'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <main className="mx-auto max-w-md px-4 pb-24 pt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:id" element={<MovementDetail />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
