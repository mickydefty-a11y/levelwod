import { useNavigate } from 'react-router-dom'
import BackLink from '../components/BackLink'
import ProgramQuiz from '../components/ProgramQuiz'

export default function ProgramQuizPage() {
  const navigate = useNavigate()

  return (
    <div>
      <BackLink to="/programs" label="Programs" />

      <h1 className="mt-2 text-2xl font-semibold">Find your program</h1>
      <p className="mt-1 text-sm text-ink-muted">
        A couple of quick questions to point you at the right program to start with.
      </p>

      <div className="mt-4">
        <ProgramQuiz
          onSelect={(programId, reason) =>
            navigate(`/programs/${programId}?quizReason=${encodeURIComponent(reason)}`)
          }
        />
      </div>
    </div>
  )
}
