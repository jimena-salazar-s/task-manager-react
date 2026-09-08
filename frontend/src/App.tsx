import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa"; 
import "./index.css";
import "./App.css";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import TaskInput from "./components/TaskInput";
import UserPanel from "./components/UserPanel";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register"; // 1. Importamos el nuevo componente Register

type Task = {
    id: number;
    text: string;
    completed: boolean;
};

function App() {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [tasks, setTasks] = useState<Task[]>([]);
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    
    const [isRegistering, setIsRegistering] = useState<boolean>(false);

    const getEmailFromToken = (jwtToken: string) => {
        try {
            const payload = jwtToken.split(".")[1];
            const decodedPayload = JSON.parse(atob(payload));
            return decodedPayload.email;
        } catch (error) {
            return "";
        }
    };

    const getNameFromToken = (jwtToken: string) => {
        try {
            const payload = jwtToken.split(".")[1];
            const decodedPayload = JSON.parse(atob(payload));
            return decodedPayload.name;
        } catch (error) {
            return "";
        }
    };

    useEffect(() => {
        if (token) {
            setUserEmail(getEmailFromToken(token));
            setUserName(getNameFromToken(token))
        }
    }, [token]);

    const handleLoginSuccess = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setTasks([]);
        setUserEmail("");
        setUserName("");
    };

    useEffect(() => {
        if (!token) return;

        const fetchTasks = async () => {
            const response = await fetch("http://localhost:3000/tasks", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                handleLogout();
            }
        };
        fetchTasks();
    }, [token]);

    const addTask = async (text: string) => {
        const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ text })
        });

        if (response.ok) {
            const newTask = await response.json();
            setTasks((currentTasks) => [...currentTasks, newTask]);
        }
    };

    const deleteTask = async (id: number) => {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error("Failed to delete task");
            return;
        }

        setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    };

    const toggleTask = async (id: number) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ completed: !task.completed })
        });

        if (response.ok) {
            const updatedTask = await response.json();
            setTasks((currentTasks) =>
                currentTasks.map((task) => (task.id === id ? updatedTask : task))
            );
        }
    };

    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = tasks.length - completedTasks;

    if (!token) {
        return isRegistering ? (
            <Register 
                onRegisterSuccess={() => setIsRegistering(false)}
                onSwitchToLogin={() => setIsRegistering(false)}
            />
        ) : (
            <Login 
                onLoginSuccess={handleLoginSuccess} 
                onSwitchToRegister={() => setIsRegistering(true)}
            />
        );
    }

    return (
        <div className="app-container">
            <Header />
            <TaskInput onAddTask={addTask} />

            <div className="main-content">
                <TaskList
                    tasks={tasks}
                    onDeleteTask={deleteTask}
                    onToggleTask={toggleTask}
                />

                <div className="sidebar-container">
                    <Footer
                        total={tasks.length}
                        completed={completedTasks}
                        pending={pendingTasks}
                    />
                    
                    <UserPanel 
                        userName={userName}
                        userEmail={userEmail} 
                        onLogout={handleLogout} 
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
