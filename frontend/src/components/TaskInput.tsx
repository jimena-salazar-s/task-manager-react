import { useState } from "react";

type TaskInputProps = {
    onAddTask: (title: string) => void;
};

function TaskInput(props: TaskInputProps) {
    const [title, setText] = useState("");

    const handleSubmit = () => {
        if (title.trim() === "") {
            return;
        }

        props.onAddTask(title);
        setText("");
    };

    return (
        <div className="input-section">
            <div className="task-input">
                <input
                    type="text"
                    placeholder="Add a new task"
                    value={title}
                    onChange={(event) => setText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                />

                <button onClick={handleSubmit}>
                    New Task
                </button>
            </div>

            <div className="instructions">
                <p>✔ Click the circle to complete a task.</p>
                <p>✖ Click the red button to delete it.</p>
            </div>
        </div>
    );
}

export default TaskInput;