import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();



    const handleSignUp = async () => {
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords don't match.");

            return;
        }
        navigate('/survey', { state: { email, password } });
    };


    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ background: 'linear-gradient(135deg, #ff4e50 0%, #881c1c 100%)', minHeight: '100vh' }}>
            <div className="container-fluid w-25 border border-dark p-4" style={{ backgroundColor: 'white' }}>
                <div className="row" style={{ minWidth: "200px" }}>
                    <div className="col-lg-12" style={{ minWidth: "200px" }}>
                        <h1 className="logo text-center" style={{ minWidth: "200px" }}>Roommingle</h1>
                    </div>
                </div>
                <div className="row m-2">
                    <div className="col-12 form-floating">
                        <input type="text" id ="floatingInputGrid" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="form-control w-100 border border-dark" />
                        <label for="floatingInputGrid">
                            Email address
                        </label>
                    </div>
                </div>
                <div className="row m-2">
                    <div className="col-12 form-floating">
                        <input type="password" id="floatingInputGrid" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} className="form-control w-100 border border-dark" />
                        <label for="floatingInputGrid">
                            New Password
                        </label>
                    </div>
                </div>
                <div className="row m-2">
                    <div className="col-12 form-floating">
                        <input type="password" id="floatingInputGrid" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="form-control w-100 mb-4 border border-dark" />
                        <label for="floatingInputGrid">
                            Confirm Password
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-center" style={{ color: '#888' }}>
                        <button onClick={handleSignUp} className="btn btn-light text-6 w-100" style={{background: '#ff4e50',color: '#fff',}}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>)
}

export default SignUp;