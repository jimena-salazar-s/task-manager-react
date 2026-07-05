import { useState } from "react";

type LoginProps = {
    onLoginSuccess: (token: string) => void;
};

export default function Login({ onLoginSuccess }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                onLoginSuccess(data.token);
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Error connecting to the server");
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h2>HELLO !</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="admin@test.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="login-input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="123456" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>

                {error && <div className="login-error-message">{error}</div>}
            </div>
        </div>
    );
}
