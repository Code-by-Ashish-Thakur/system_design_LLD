import { useState, useEffect, useCallback } from 'react'

export default function TopicSidebar() {
  const [sections, setSections] = useState([])
  const [activeId, setActiveId] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Extract sections from rendered DOM
  const extractSections = useCallback(() => {
    const container = document.querySelector('.container')
    if (!container) return
    const sectionEls = container.querySelectorAll('.section')
    const items = []
    sectionEls.forEach((el, i) => {
      const titleEl = el.querySelector('.section-title')
      if (!titleEl) return
      // Assign an ID if not present
      if (!el.id) {
        el.id = 'section-' + i
      }
      // Get text without the section number
      const numEl = titleEl.querySelector('.section-num')
      const num = numEl ? numEl.textContent.trim() : ''
      // Clone to get text without children modifications
      const clone = titleEl.cloneNode(true)
      const numClone = clone.querySelector('.section-num')
      if (numClone) numClone.remove()
      const text = clone.textContent.trim()
      items.push({ id: el.id, num, text })
    })
    setSections(items)
    if (items.length > 0) setActiveId(items[0].id)
  }, [])

  useEffect(() => {
    // Wait for content to render
    const timer = setTimeout(extractSections, 300)
    return () => clearTimeout(timer)
  }, [extractSections])

  // Track active section on scroll
  useEffect(() => {
    if (sections.length === 0) return
    const handleScroll = () => {
      let current = sections[0]?.id || ''
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) current = s.id
        }
      }
      setActiveId(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
      setIsOpen(false)
    }
  }

  if (sections.length === 0) return null

  return (
    <>
      {/* Mobile toggle button */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span className="sidebar-toggle-icon">{isOpen ? '✕' : '☰'}</span>
        <span className="sidebar-toggle-text">Sections</span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <nav className={`topic-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">Sections</div>
        <div className="sidebar-list">
          {sections.map((s) => (
            <div
              key={s.id}
              className={`sidebar-item ${activeId === s.id ? 'sidebar-active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              <span className="sidebar-num">{s.num}</span>
              <span className="sidebar-text">{s.text}</span>
            </div>
          ))}
        </div>
      </nav>
    </>
  )
}
