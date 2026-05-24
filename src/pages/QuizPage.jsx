import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResult, submitAttempt } from '../services/attemptService';
import api from '../services/api'; // we'll use api directly for fetching attempt details

const QuizPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  // Fetch attempt details (we don't have a direct endpoint, so we can use getResult if allowed,
  // but getResult requires the attempt to be completed. Better: we stored the attempt data in startQuiz response.
  // We'll modify the startQuiz flow to pass data via navigation state.
  // Actually, the backend returns questions and duration when starting a quiz.
  // We can either pass them via location state or fetch from a non-existent /attempts/:id endpoint.
  // Simplest: we already got duration & questions from startQuiz response; we should pass them via navigate state.
  // For now, assume we passed them; we'll adjust Dashboard to include the full start data.

  // Let's refactor: in Dashboard, after startQuiz we get res.data.data containing { attemptId, startTime, duration, questions }
  // We'll pass that to QuizPage via navigate state.
  // We'll update Dashboard accordingly.

  // For now, we'll read from location.state and fallback to alert.
  useEffect(() => {
    const fetchAttemptData = async () => {
      try {
        // If we have state from navigation, use it
        const state = window.history.state?.usr;
        if (state && state.questions && state.duration && state.startTime) {
          setQuestions(state.questions);
          const startTime = new Date(state.startTime).getTime();
          const durationMs = state.duration * 60 * 1000;
          const endTime = startTime + durationMs;
          const remaining = Math.max(0, endTime - Date.now());
          setTimeLeft(remaining);
          setLoading(false);
          return;
        }
        // Fallback: try to get from API? But we don't have an endpoint for incomplete attempt.
        // We'll just error.
        setError('Quiz data not found. Please start again.');
      } catch (err) {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchAttemptData();
  }, [attemptId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timerRef.current);
          handleSubmit(); // auto-submit on timeout
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const handleOptionChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const answersArray = Object.entries(answers).map(([questionId, chosenOption]) => ({
        questionId,
        chosenOption,
      }));
      const res = await submitAttempt(attemptId, answersArray);
      navigate(`/result/${attemptId}`, { state: { score: res.data.data.score, total: res.data.data.totalQuestions, correctCount: res.data.data.correctCount } });
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading quiz...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quiz</h2>
        <div className="text-xl font-mono bg-gray-200 px-4 py-2 rounded">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className="bg-white rounded shadow p-4 mb-4">
          <p className="font-semibold mb-2">{idx + 1}. {q.text}</p>
          <div className="space-y-2">
            {q.options.map((option, optIdx) => (
              <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={optIdx.toString()}
                  checked={answers[q.id] === optIdx.toString()}
                  onChange={() => handleOptionChange(q.id, optIdx.toString())}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:opacity-50 text-lg"
      >
        {submitting ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </div>
  );
};

export default QuizPage;