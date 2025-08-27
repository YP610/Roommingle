import { useState, useEffect, useMemo } from 'react';
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

  // Initialize answers
  const [answers, setAnswers] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {})
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter questions based on answers (conditionally show dorm questions)
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (!q.condition) return true;
      return q.condition(answers);
    });
  }, [answers]);

  // Group filtered questions into pages based on their type/category
  const questionGroups = useMemo(() => {
    const groups = [];
    
    // Group 1: Basic contact info
    const basicInfo = filteredQuestions.filter(q => 
      ['name', 'number', 'insta', 'snap'].includes(q.id)
    );
    if (basicInfo.length > 0) groups.push(basicInfo);
    
    // Group 2: Academic info (year, gender, honors)
    const academicInfo = filteredQuestions.filter(q => 
      ['year', 'gender', 'is_honors'].includes(q.id)
    );
    if (academicInfo.length > 0) groups.push(academicInfo);
    
    // Group 3: Dorm preferences (only if not honors)
    if (!answers.is_honors) {
      const dormPrefs = filteredQuestions.filter(q => 
        ['dorm1', 'dorm2', 'dorm3'].includes(q.id)
      );
      if (dormPrefs.length > 0) groups.push(dormPrefs);
    }
    
    // Group 4: Cleanliness questions
    const cleanliness = filteredQuestions.filter(q => 
      ['q1', 'q2', 'q3', 'q4', 'q5'].includes(q.id)
    );
    if (cleanliness.length > 0) groups.push(cleanliness);
    
    // Group 5: Lifestyle info
    const lifestyle = filteredQuestions.filter(q => 
      ['hobbies', 'sleep_attitude', 'major'].includes(q.id)
    );
    if (lifestyle.length > 0) groups.push(lifestyle);
    
    // Group 6: Bio
    const bio = filteredQuestions.filter(q => q.id === 'bio');
    if (bio.length > 0) groups.push(bio);
    
    return groups;
  }, [filteredQuestions, answers.is_honors]);

  const totalSteps = questionGroups.length;
  const [step, setStep] = useState(1);

  // Update step if needed when honors status changes
  useEffect(() => {
    if (answers.is_honors === true && step > 2) {
      // Check if current step contains dorm questions
      const currentGroup = questionGroups[step - 1];
      const isOnDormQuestions = currentGroup && currentGroup.some(q => 
        ['dorm1', 'dorm2', 'dorm3'].includes(q.id)
      );
      
      if (isOnDormQuestions) {
        // Find the next non-dorm step
        const nextStep = questionGroups.findIndex((group, index) => 
          index >= step && !group.some(q => ['dorm1', 'dorm2', 'dorm3'].includes(q.id))
        );
        if (nextStep !== -1) {
          setStep(nextStep + 1);
        }
      }
    }
  }, [answers.is_honors, step, questionGroups]);

  const validateDormUniqueness = (a) => {
    const picks = [a.dorm1, a.dorm2, a.dorm3].filter(Boolean);
    const unique = new Set(picks);
    return unique.size === picks.length;
  };

  const handleAnswer = (id, val) => {
    if (id === 'is_honors') {
      // If switching to honors, clear dorm answers
      if (val === true) {
        setAnswers(prev => ({
          ...prev,
          [id]: val,
          dorm1: '',
          dorm2: '',
          dorm3: ''
        }));
        setError('');
      } else {
        setAnswers(prev => ({ ...prev, [id]: val }));
      }
      return;
    }

    if (id==='dorm1' || id==='dorm2' || id==='dorm3') {
      setAnswers(prev => ({ ...prev, [id]: val }));
      setError('');
      return;
    }
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  // Proceed to next page after validating current group
  const handleNext = () => {
    const group = questionGroups[step - 1];
    const allAnswered = group
      .filter(q => q.required)
      .every(q => answers[q.id] !== '' && answers[q.id] != null);

    if (!allAnswered) {
      setError('Please answer all required questions before proceeding.');
      return;
    }

    const hasDorms = group.some(q => ['dorm1', 'dorm2', 'dorm3'].includes(q.id));
    if (hasDorms && !answers.is_honors) {
      if (!validateDormUniqueness(answers)) {
        setError('Each dorm preference must be different. Please choose a different dorm for each preference.');
        return;
      }
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

    if (!answers.is_honors) {
      if (!validateDormUniqueness(answers)) {
        setError('Each dorm preference must be different. Please choose a different dorm for each preference.');
        return;
      }
    }

    // Validate all required answers from filtered questions
    const allRequired = filteredQuestions
      .filter(q => q.required)
      .every(q => answers[q.id] !== '' && answers[q.id] != null);
    
    if (!allRequired) {
      setError('Please complete all required fields before submitting.');
      return;
    }

    // Build payload with conditional dorm ranking
    const payload = {
      name: answers.name,
      email,
      password,
      prof_questions: {
        q1: parseInt(answers.q1) || 0,
        q2: parseInt(answers.q2) || 0,
        q3: parseInt(answers.q3) || 0,
        q4: parseInt(answers.q4) || 0,
        q5: parseInt(answers.q5) || 0
      },
      contact: {
        number: answers.number || '',
        snap: answers.snap || '',
        insta: answers.insta || ''
      },
      feed: {
        year: answers.year,
        gender: answers.gender,
        is_honors: answers.is_honors,
        rank: answers.is_honors ? [] : [answers.dorm1, answers.dorm2, answers.dorm3]
      },
      livingConditions: {
        sleep_attitude: answers.sleep_attitude,
        major: answers.major,
        cleanliness_score: calculateCleanScore(answers)
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

  // Helper function to calculate cleanliness score
  const calculateCleanScore = (answers) => {
    const scores = [
      parseInt(answers.q1) || 0,
      parseInt(answers.q2) || 0,
      parseInt(answers.q3) || 0,
      parseInt(answers.q4) || 0,
      parseInt(answers.q5) || 0
    ];
    return scores.reduce((sum, score) => sum + score, 0);
  };

  const currentQuestions = questionGroups[step - 1] || [];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Complete Your Profile</h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Step {step} of {totalSteps}
      </p>
      
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
                required={q.required}
              />
            ) : (
              <div className="space-y-2">
                {q.options.map(opt => (
                  <label key={opt.value} className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      checked={answers[q.id] === opt.value}
                      onChange={() => handleAnswer(q.id, opt.value)}
                      className="form-radio"
                      required={q.required}
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

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}