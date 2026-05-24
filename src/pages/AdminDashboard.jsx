import { useState } from 'react';
import QuizList from '../components/QuizList';
import QuizForm from '../components/QuizForm';
import { createQuiz, updateQuiz, deleteQuiz, getQuizById } from '../services/quizService';

const AdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setEditingQuiz(null);
    setShowForm(true);
  };

  const handleEdit = async (quiz) => {
    try {
      const res = await getQuizById(quiz.id);
      setEditingQuiz(res.data.data);   // full quiz with questions
      setShowForm(true);
    } catch (err) {
      alert('Failed to load quiz details');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(id);
        setRefreshKey(prev => prev + 1);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete quiz');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingQuiz) {
      await updateQuiz(editingQuiz.id, formData);
    } else {
      await createQuiz(formData);
    }
    setShowForm(false);
    setEditingQuiz(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quiz Management</h2>
        <button onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Create New Quiz
        </button>
      </div>

      <QuizList key={refreshKey} onEdit={handleEdit} onDelete={handleDelete} refreshKey={refreshKey} />

      {showForm && (
        <QuizForm
          initialData={editingQuiz}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingQuiz(null); }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;