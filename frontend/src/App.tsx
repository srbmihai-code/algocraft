import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Level from './pages/Level'
import AuthPage from './pages/AuthPage'
import LevelsList from './pages/LevelsList'
import AdminQuestions from "./pages/AdminQuestions.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/level/:chapterName/:levelURL" element={<Level />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/levels" element={<LevelsList />} />
      <Route path="/admin/questions" element={<AdminQuestions />} />
    </Routes>
  )
}
