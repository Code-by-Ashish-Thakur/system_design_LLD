import { useNavigate } from 'react-router-dom'

export default function TopicCard({ topic }) {
  const navigate = useNavigate()
  return (
    <div className={`topic-card ${topic.cardClass}`} onClick={() => navigate(`/topic/${topic.id}`)}>
      <div className="topic-icon">{topic.icon}</div>
      <h3>{topic.title}</h3>
      <p>{topic.desc}</p>
      <span className="topic-tag">{topic.tag}</span>
    </div>
  )
}
