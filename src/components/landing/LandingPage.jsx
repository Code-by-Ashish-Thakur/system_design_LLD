import { topics } from '../../data/topics'
import TopicCard from './TopicCard'

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-header">
        <h1>System Design LLD Hub By Ashish Thakur</h1>
        <p>Complete Low-Level Designs for Java Spring Boot Interviews</p>
        <p className="landing-author">Isme full oops java and system design hai full </p>
      </div>
      <div className="topic-grid">
        {topics.map(t => <TopicCard key={t.id} topic={t} />)}
      </div>
    </div>
  )
}
