import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handler to redirect to sign up page
    const handleSignUp = () => {
        window.location.href = './signup';
    };
    
    const handleLogin = async e => {
        setError('');
        try{
            const res=await fetch('http://localhost:1000/api/auth/login',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({email,password})
            });
            const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');

        // save token and user
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email
        }));

        console.log('✅ Logged in successfully:', data); // success message
        navigate('/home');
    } catch (err) {
        console.log("Trying to login with:", email, password);
        console.log('❌ Could not log in:', err.message); // error message
    }
};

    return ( 
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ background: 'linear-gradient(135deg, #ff4e50 0%, #881c1c 100%)', minHeight: '100vh' }}>
            <div className="container-fluid w-25 border border-dark p-4" style={{ backgroundColor: 'white' }}>
                <div className="row" style={{minWidth:"200px"}}>
                    <div className="col-lg-12" style={{minWidth:"200px"}}>
                        <h1 className="logo text-center" style={{ minWidth: "200px" }}>Roommingle</h1>
                    </div>
                </div>
                <div className="row">
                    <div class="form-floating">
                        <input type="email" className="form-control" id="floatingInputGrid" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)}/>
                            <label for="floatingInputGrid">Email address</label>
                    </div>
                </div>
                <div className="row">
                    <div class="form-floating">
                        <input type="password" className="form-control" id="floatingInputGrid" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                        <label for="floatingInputGrid">Password</label>
                    </div>
                </div>

                {error && <div style={{ color: 'red' }}>{error}</div>}
                
                <div className="row">
                    <div className="col-12">
                        <button onClick={handleLogin} className="btn btn-light w-100 text-light mb-2" style={{ background: '#ff4e50', color: '#fff' }}>
                            Login
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-center" style={{ color: '#888' }}>
                        Don't have an account?{' '}
                        <button onClick={handleSignUp} className="btn btn-light text-6" style={{ color: '#ff4e50', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>)
}
 
export default Login;