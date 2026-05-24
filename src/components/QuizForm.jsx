import { useState, useEffect } from 'react';

const emptyQuestion = () => ({
  text: '',
  type: 'multiple_choice',
  options: ['', '', '', ''], // 4 default options
  correctAnswer: '0',
});

const QuizForm = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 15,
    questions: [],
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      // When editing, pre-fill the form with existing data (including questions)
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        duration: initialData.duration || 15,
        questions: initialData.questions?.length
          ? initialData.questions.map(q => ({
              text: q.text,
              type: q.type,
              options: q.options || ['', '', '', ''],
              correctAnswer: q.correctAnswer || '0',
            }))
          : [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'duration' ? Number(value) : value });
  };

  // ─── Question handlers ──────────────────────────────
  const addQuestion = () => {
    setForm({
      ...form,
      questions: [...form.questions, emptyQuestion()],
    });
  };

  const removeQuestion = (index) => {
    setForm({
      ...form,
      questions: form.questions.filter((_, i) => i !== index),
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...form.questions];
    updated[index] = { ...updated[index], [field]: value };
    // Reset correctAnswer if type changes to true_false (only 0/1 valid)
    if (field === 'type' && value === 'true_false') {
      updated[index].options = ['True', 'False'];
      updated[index].correctAnswer = '0';
    }
    if (field === 'type' && value === 'multiple_choice') {
      updated[index].options = ['', '', '', '']; // reset to four empty
      updated[index].correctAnswer = '0';
    }
    setForm({ ...form, questions: updated });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...form.questions];
    const options = [...updated[questionIndex].options];
    options[optionIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], options };
    setForm({ ...form, questions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      // Clean up questions before sending (ensure options array, no empty strings)
      const questionsToSend = form.questions.map(q => ({
        text: q.text,
        type: q.type,
        options: q.options.filter(opt => opt.trim() !== ''),
        correctAnswer: q.correctAnswer,
      }));
      await onSubmit({ ...form, questions: questionsToSend });
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-10">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl mx-4">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Quiz' : 'Create Quiz'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Quiz metadata */}
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

          {/* Questions Section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                + Add Question
              </button>
            </div>

            {form.questions.map((q, qIndex) => (
              <div key={qIndex} className="border p-3 mb-3 rounded relative">
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl leading-none"
                >
                  ×
                </button>

                <label className="block mb-1 text-sm">Question Text</label>
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  required
                />

                <label className="block mb-1 text-sm">Type</label>
                <select
                  value={q.type}
                  onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True / False</option>
                </select>

                {/* Options */}
                <p className="text-sm mb-1">Options</p>
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2 mb-1">
                    <span className="text-xs w-6">{optIndex}:</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                      className="flex-1 border p-1 rounded text-sm"
                      required
                    />
                  </div>
                ))}

                <label className="block mb-1 text-sm mt-2">Correct Answer (index)</label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                >
                  {q.options.map((_, i) => (
                    <option key={i} value={i.toString()}>
                      {i} - {q.options[i] || `Option ${i}`}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-6">
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