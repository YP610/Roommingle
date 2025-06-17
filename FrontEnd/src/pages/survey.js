import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import questions from './questions';

export default function Survey() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { email, password } = state || {};

  // Redirect if accessed directly
  useEffect(() => {
    if (!email || !password) {
      navigate('/signup');
    }
  }, [email, password, navigate]);

  // Group questions into pages
  const questionGroups = [
    questions.slice(0, 4),    // Q1-4
    questions.slice(4, 7),    // Q5-7
    questions.slice(7, 10),   // Q8-10
    questions.slice(10, 15),  // Q11-15
    questions.slice(15, 18),  // Q16-18
    questions.slice(18, 19)   // Q19
  ];
  const totalSteps = questionGroups.length;
  const [step, setStep] = useState(1);

  // Initialize answers
  const [answers, setAnswers] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {})
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAnswer = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  // Proceed to next page after validating current group
  const handleNext = () => {
    const group = questionGroups[step - 1];
    const allAnswered = group
      .filter(q => q.required || q.options)
      .every(q => answers[q.id] !== '' && answers[q.id] != null);

    if (!allAnswered) {
      setError('Please answer all required questions before proceeding.');
      return;
    }
    setError('');
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(s => s - 1);
  };

  // Submit the completed survey
  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validate all required answers
    const allRequired = questions
      .filter(q => q.required || q.options)
      .every(q => answers[q.id] !== '' && answers[q.id] != null);
    if (!allRequired) {
      setError('Please complete all required fields before submitting.');
      return;
    }

    // Build payload
    const payload = {
      name: answers.name,
      email,
      password,
      prof_questions: {
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5
      },
      contact: {
        number: answers.number || '',
        snap: answers.snap || '',
        insta: answers.insta || ''
      },
      feed: {
        is_freshman: answers.is_freshman,
        gender: answers.gender,
        is_honors: answers.is_honors,
        rank: [answers.dorm1, answers.dorm2, answers.dorm3]
      },
      livingConditions: {
        sleep_attitude: answers.sleep_attitude,
        major: answers.major
      },
      hobbies: answers.hobbies || '',
      bio: answers.bio || ''
    };

    try {
      const res = await fetch('http://localhost:1000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email
      }));

      setSuccess('Profile completed! Redirecting...');
      setTimeout(() => navigate('/home'), 500);
    } catch (err) {
      setError(err.message);
    }
  };

  const currentQuestions = questionGroups[step - 1];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Complete Your Profile</h1>
      <div>
        {currentQuestions.map(q => (
          <div key={q.id} className="mb-6">
            <label className="block mb-2 font-medium">
              {q.text}
              {q.required && <span className="text-red-500"> *</span>}
            </label>
            {q.type === 'text' ? (
              <input
                type="text"
                value={answers[q.id]}
                onChange={e => handleAnswer(q.id, e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <div className="space-y-2">
                {q.options.map(opt => (
                  <label key={opt.value} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      checked={answers[q.id] === opt.value}
                      onChange={() => handleAnswer(q.id, opt.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <div className="flex justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
