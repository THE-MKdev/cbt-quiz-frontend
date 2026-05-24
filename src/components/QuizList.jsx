import { useEffect, useState } from 'react';
import { getQuizzes } from '../services/quizService';

const QuizList = ({ onEdit, onDelete, refreshKey }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuizzes = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await getQuizzes(page, 10);
      setQuizzes(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [refreshKey]); // refresh when parent triggers

  const handlePageChange = (newPage) => {
    fetchQuizzes(newPage);
  };

  if (loading) return <div className="text-center py-4">Loading quizzes...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;

  return (
    <div>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Duration (min)</th>
            <th className="py-2 px-4 text-left">Created</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id} className="border-t">
              <td className="py-2 px-4">{quiz.title}</td>
              <td className="py-2 px-4">{quiz.duration}</td>
              <td className="py-2 px-4">{new Date(quiz.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4 flex gap-2 justify-center">
                <button onClick={() => onEdit(quiz)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                  Edit
                </button>
                <button onClick={() => onDelete(quiz.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={pagination.page <= 1}
          onClick={() => handlePageChange(pagination.page - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {pagination.page} of {pagination.totalPages} (total {pagination.total} quizzes)
        </span>
        <button
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizList;