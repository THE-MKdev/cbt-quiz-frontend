import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getResult } from '../services/attemptService';

const ResultPage = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await getResult(attemptId);
        setResult(res.data.data);
      } catch (err) {
        setError('Failed to load result');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) return <div className="text-center mt-10">Loading result...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!result) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quiz Result</h2>
      <div className="bg-white rounded shadow p-6 mb-6">
        <p className="text-lg">Score: <span className="font-bold">{result.score}%</span></p>
        <p className="text-gray-600">Correct: {result.correctCount} / {result.totalQuestions}</p>
      </div>

      <div className="space-y-4">
        {result.details.map((detail, idx) => (
          <div key={idx} className={`bg-white rounded shadow p-4 border-l-4 ${detail.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
            <p className="font-semibold">{detail.question}</p>
            <p className="text-sm">Your answer: <span className="font-medium">{detail.yourAnswer || 'No answer'}</span></p>
            {!detail.isCorrect && (
              <p className="text-sm text-green-600">Correct answer: {detail.correctAnswer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPage;