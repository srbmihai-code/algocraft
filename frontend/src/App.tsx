import { Routes, Route } from 'react-router-dom'
// import Home from './pages/Home'
import Level from './pages/Level'
import AuthPage from './pages/AuthPage'
import LevelsList from './pages/LevelsList'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LevelsList />} />
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/level/:chapterName/:levelURL" element={<Level />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/levels" element={<LevelsList />} />
    </Routes>
  )
}
