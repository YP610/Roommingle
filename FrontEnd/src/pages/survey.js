import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import questions from './questions';


//TODO: 1) Make it so that if user is an honors student, the website doesn't ask for their dorm ranking 2) Connect responses from frontend to groups in backend


export default function Survey() {
    const location = useLocation();
    const navigate = useNavigate();
    // 1) user info
    const { state } = useLocation();
    // answers map: { [questionId]: 'A' | 'B' | ...}
    const { email, password } = state || {};
    const [answers, setAnswers] = useState(
        questions.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {})
    );
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // If someone lands directly on /survey with no state, send them back
    useEffect(() => {
        if(!email || !password) {
            navigate('/signup');
        }
    }, [email, password, navigate]);


    const handleAnswer = (id, val) => {
        setAnswers(prev => ({...prev, [id]: val }));
    };


    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess(' ');

       
        const allRequiredAnswered=questions
            .filter(q=>q.required||q.options)
            .every(q => answers[q.id] !== null && answers[q.id] !== '')
       
        if(!allRequiredAnswered||!answers.name||!email){
            setError("Not All Required Fields Completed");
            return;
        }

        if (!location.state) {
            navigate('/signup');
            return null;
        }
        const body = {
            name:answers.name,
            email,
            password,
            prof_questions:{
                q1:answers.q1,
                q2:answers.q2,
                q3:answers.q3,
                q4:answers.q4,
                q5:answers.q5
            },
            contact:{
                number:answers.number||"",
                snap:answers.snap||"",
                insta:answers.insta||""
            },
            feed:{
                is_freshman:answers.is_freshman,
                gender:answers.gender,
                is_honors:answers.is_honors,
                rank:[answers.dorm1,answers.dorm2,answers.dorm3]
            },
            livingConditions:{
                sleep_attitude:answers.sleep_attitude,
                major:answers.major,
            },
            hobbies:answers.hobbies||'',
            bio:answers.bio||'',
        };
        try{
            const res=await fetch('http://localhost:1000/api/auth/register',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Signup failed.");

            // Store the token (and user) so Home can see it
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                _id: data._id,
                name: data.name,
                email: data.email
            }));
            
            setSuccess("User created successfully! Redirecting...");
            
            setTimeout(() => {
                navigate('/home');
            }, 500);
        } catch (err) {
            setError(err.message);
        }
    };
    return (
    <div className="container-fluid">
        <div className = "container-fluid">
            <div className="row">
                <div className="col-1 col-md-2">

                </div>
                <div className="col-10 text-center col-md-8">
                    <h1>
                        Complete Your Profile
                    </h1>
                </div>
                <div className="col-1 col-md-2">
                    
                </div>
            </div>
            <div className="row">

                <form onSubmit={handleSubmit} className="space-y-6">
                    {questions.map(q => (
                        <div key={q.id} className="flex flex-col mb-4">
                            <label htmlFor={q.id} className="mb-2 font-medium text-gray-700">
                                {q.text}
                                {q.required && 
                                <span className="text-red-500 ml-1">
                                    *
                                </span>}
                            </label>
                            {q.type === 'text' ? (
                                <input
                                    id={q.id}
                                    type="text"
                                    value={answers[q.id]}
                                    onChange={e => handleAnswer(q.id, e.target.value)}
                                    required={q.required}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                ) : (
                                    <div className="space-y-2">
                                        {q.options.map
                                            (opt => 
                                                (
                                                    <label key={opt.value} className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={q.id}
                                                            value={opt.value}
                                                            checked={answers[q.id] === opt.value}
                                                            onChange={() => handleAnswer(q.id, opt.value)}
                                                            required={q.required}
                                                            className="form-radio text-blue-600"
                                                        />
                                                        <span className="ml-2">
                                                            {opt.label}
                                                        </span>
                                                    </label>
                                                )
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    ))}
                    {error && 
                    <p className="text-red-600">
                        {error}
                    </p>
                    }
                    {success && 
                        <p className="text-green-600">
                            {success}
                        </p>
                    }
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </form> 
            </div>
        </div>
    </div>
)}


//TODO: 1) Make sure id's of questions are consistent with schema 2) Refine schema 3) Make sure schema and question format are consistent
