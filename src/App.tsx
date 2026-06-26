import { useState } from "react";
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
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, text: "Learn React", completed: false },
        { id: 2, text: "Practice Components", completed: false },
        { id: 3, text: "Understand Props", completed: false },
        { id: 4, text: "Practice TypeScript", completed: false },
        { id: 5, text: "Use State", completed: false }
    ]);

    const addTask = (title: string) => {
        const newTask: Task = {
            id: Date.now(),
            text: title,
            completed: false
        };

        setTasks([...tasks, newTask]);
    };

    const deleteTask = (id: number) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
    };

    const toggleTask = (id: number) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === id) {
                return {
                    ...task,
                    completed: !task.completed
                };
            }
            return task;
        });
        setTasks(updatedTasks);
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