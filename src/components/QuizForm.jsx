import { useState, useEffect } from 'react';

const QuizForm = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 15,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        duration: initialData.duration || 15,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'duration' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Quiz' : 'Create Quiz'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Title</label>
          <input
            type="text" name="title" value={form.title} onChange={handleChange}
            className="w-full border p-2 rounded mb-4" required
          />
          <label className="block mb-2">Description</label>
          <textarea
            name="description" value={form.description} onChange={handleChange}
            className="w-full border p-2 rounded mb-4" rows="3"
          />
          <label className="block mb-2">Duration (minutes)</label>
          <input
            type="number" name="duration" value={form.duration} onChange={handleChange}
            className="w-full border p-2 rounded mb-4" min="1" required
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCancel}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;