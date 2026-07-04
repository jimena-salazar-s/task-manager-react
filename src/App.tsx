import { useEffect, useState } from "react";
import "./index.css";
import "./App.css";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import TaskInput from "./components/TaskInput";
import Footer from "./components/Footer";

type Task = {
    id: number;
    text: string;
    completed: boolean;
};

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch("http://localhost:3000/tasks");
            const data = await response.json();
            setTasks(data);
        };
        fetchTasks();
    }, []);

    const addTask = async (text: string) => {
        const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text
            })
        });

        const newTask = await response.json();

        setTasks((currentTasks) => [...currentTasks, newTask]);
    };

    const deleteTask = async (id: number) => {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            console.error("Failed to delete task");
            return;
        }

        setTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== id)
        );
    };

    const toggleTask = async (id: number) => {
        // Buscar el task actual
        const task = tasks.find((t) => t.id === id);

        if (!task) return;

        // Llamar al API
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: !task.completed
            })
        });

        const updatedTask = await response.json();

        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id ? updatedTask : task
            )
        );
    };


    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = tasks.length - completedTasks;

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

                <Footer
                    total={tasks.length}
                    completed={completedTasks}
                    pending={pendingTasks}
                />

            </div>
        </div>
    );
}

export default App;