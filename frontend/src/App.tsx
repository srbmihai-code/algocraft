import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import LevelsList from './pages/LevelsList'
import AdminQuestions from "./pages/AdminQuestions.tsx"

const Level = lazy(() => import('./pages/Level'))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/level/:chapterName/:levelURL"
        element={
          <Suspense fallback={
            <div className="level-loading">
              <div className="spinner"></div>
            </div>
          }>
            <Level />
          </Suspense>
        }
      />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/levels" element={<LevelsList />} />
      <Route path="/admin/questions" element={<AdminQuestions />} />
    </Routes>
  )
}