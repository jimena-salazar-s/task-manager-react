import { useState } from "react";

type RegisterProps = {
    onRegisterSuccess: () => void; // Callback para avisar que se registró con éxito
    onSwitchToLogin: () => void;   // Para regresar al login
};

export default function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }) // ¡Ahora incluye name!
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Success! Your account has been created.");
                // Opcional: Ejecutar callback tras un breve delay o inmediatamente
                setTimeout(() => {
                    onRegisterSuccess();
                }, 2000);
            } else {
                setIsError(true);
                setMessage(data.message || "Oops! Something happened.");
            }
        } catch (err) {
            setIsError(true);
            setMessage("Error connecting to the server");
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <h2>Create account</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-input-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>

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

                    <button type="submit" className="login-button">Sign Up</button>
                </form>

                {message && (
                    <div 
                        className={isError ? "login-error-message" : "login-success-message"} 
                        style={!isError ? {color: '#4caf50', background: '#f0fbf0', border: '1px solid #a8e3a8', padding: '10px', borderRadius: '6px', marginTop: '15px', fontSize: '0.9rem'} : {}}
                    >
                        {message}
                    </div>
                )}

                <p style={{ marginTop: "20px", fontSize: "0.9rem", color: "#777" }}>
                    Already have an account?{" "}
                    <span 
                        onClick={onSwitchToLogin} 
                        style={{ color: "#26c6c6", cursor: "pointer", fontWeight: "bold" }}
                    >
                        Sign in
                    </span>
                </p>
            </div>
        </div>
    );
}
