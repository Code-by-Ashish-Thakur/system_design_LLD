import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()
  return (
    <a className="back-btn" onClick={() => navigate('/')}>
      &larr; Back to Home
    </a>
  )
}
