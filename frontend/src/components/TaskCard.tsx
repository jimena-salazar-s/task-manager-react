import { FaCheck, FaTimes } from "react-icons/fa";

type Task = {
    id: number;
    text: string;
    completed: boolean;
};

type TaskCardProps = {
    task: Task;
    onDeleteTask: (id: number) => void;
    onToggleTask: (id: number) => void;
};

function TaskCard({
    task,
    onDeleteTask,
    onToggleTask
}: TaskCardProps) {
    return (
        <li className={`task-card ${task.completed ? "completed" : ""}`}>
            <div
                className={`task-icon ${task.completed ? "completed" : ""}`}
                onClick={() => onToggleTask(task.id)}
            >
                <FaCheck />
            </div>

            <div className="task-title">
                {task.text}
            </div>

            <button
                className="delete-button"
                onClick={() => onDeleteTask(task.id)}
            >
                <FaTimes />
            </button>
        </li>
    );
}

export default TaskCard;