import { HashRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/landing/LandingPage'
import TopicPage from './components/topic/TopicPage'
import ScrollToTop from './components/layout/ScrollToTop'

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
