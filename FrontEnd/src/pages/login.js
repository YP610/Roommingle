const Login = () => {
    // Handler to redirect to sign up page
    const handleSignUp = () => {
        window.location.href = './signup';
    };

    return ( 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #ff4e50 0%, #f5f5f5 100%)' }}>
            <div style={{
                border: '2px solid #ccc',
                borderRadius: '16px',
                padding: '40px 32px',
                background: '#fff',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                minWidth: '340px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h1 style={{ marginBottom: '32px' }}>Roommingle</h1>
                <input
                    type="text"
                    placeholder="Email"
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '20px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '16px'
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '20px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '16px'
                    }}
                />
                <button
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#ff4e50',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginBottom: '10px'

                    }}>
                        Login
                    </button>
                    <div style={{width: '100%', textAlign: 'center', fontSize: '14px', color: '#888'}}>
                        Don't have an account?{' '}
                        <button
                            onClick={handleSignUp}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#ff4e50',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '14px',
                                padding: 0,
                                textDecoration: 'underline'
                            }}>
                            Sign up
                        </button>

                    </div>
                    
            </div>
        </div>
    )
}
 
export default Login;