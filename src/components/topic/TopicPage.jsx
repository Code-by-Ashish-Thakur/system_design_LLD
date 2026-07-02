import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BackButton from '../layout/BackButton'
import TopicSidebar from './TopicSidebar'

const topicModules = import.meta.glob('../../data/topics/*.js')

export default function TopicPage() {
  const { topicId } = useParams()
  const [topic, setTopic] = useState(null)

  useEffect(() => {
    setTopic(null)
    const path = `../../data/topics/${topicId}.js`
    const loader = topicModules[path]
    if (loader) {
      loader().then(mod => setTopic(mod.default))
    }
  }, [topicId])

  if (!topic) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#78909c' }}>Loading...</div>
  }

  return (
    <>
      <BackButton />
      <TopicSidebar key={topicId} />
      <div className="topic-content has-sidebar">
        <div className="header" style={{ background: topic.headerGradient }}>
          <h1 dangerouslySetInnerHTML={{ __html: topic.title }} />
          <p style={{ color: topic.subtitleColor }} dangerouslySetInnerHTML={{ __html: topic.subtitle }} />
        </div>
        <div className="container" dangerouslySetInnerHTML={{ __html: topic.content }} />
        <div className="footer" dangerouslySetInnerHTML={{ __html: topic.footerText }} />
      </div>
    </>
  )
}
