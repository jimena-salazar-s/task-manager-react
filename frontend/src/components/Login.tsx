import { useState } from "react";

type LoginProps = {
    onLoginSuccess: (token: string) => void;
    onSwitchToRegister: () => void; // Para alternar la vista si los usas en el mismo contenedor
};

export default function Login({ onLoginSuccess, onSwitchToRegister }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);

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
                setIsError(true);
                setMessage(data.message || "Oops! Something happened, please contact the administrator.");
            }
        } catch (err) {
            setIsError(true);
            setMessage("Error connecting to the server");
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h2>Log in</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="your@email.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="login-input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="********" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="login-button">Sign In</button>
                </form>

                {message && (
                    <div className={isError ? "login-error-message" : "login-success-message"}>
                        {message}
                    </div>
                )}

                <p style={{ marginTop: "20px", fontSize: "0.9rem", color: "#777" }}>
                    Don't have an account?{" "}
                    <span 
                        onClick={onSwitchToRegister} 
                        style={{ color: "#26c6c6", cursor: "pointer", fontWeight: "bold" }}
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
}