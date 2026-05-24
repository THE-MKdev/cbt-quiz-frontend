import { useEffect, useState } from 'react';
import { getQuizzes } from '../services/quizService';
import { startQuiz } from '../services/attemptService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await getQuizzes(1, 100); // get all quizzes for student
        setQuizzes(res.data.data);
      } catch (err) {
        setError('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleStartQuiz = async (quizId) => {
    try {
      const res = await startQuiz(quizId);
      const { attemptId, startTime, duration, questions } = res.data.data;
      navigate(`/quiz/${attemptId}`, { state: { startTime, duration, questions } });
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot start quiz');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading quizzes...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded shadow p-4 flex flex-col">
              <h3 className="text-lg font-semibold">{quiz.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{quiz.description || 'No description'}</p>
              <p className="text-sm mt-2">Duration: {quiz.duration} min</p>
              <button
                onClick={() => handleStartQuiz(quiz.id)}
                className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;