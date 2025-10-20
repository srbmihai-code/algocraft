import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Level from './pages/Level'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/level/:levelName" element={<Level />} />
    </Routes>
  )
}
