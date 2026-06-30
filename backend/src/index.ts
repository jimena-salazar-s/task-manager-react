const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

type Task = {
    id: number;
    text: string;
    completed: boolean;
};

const tasks: Task[] = [
    { id: 1, text: "Estudiar Node.js", completed: false },
    { id: 2, text: "Crear servidor Express", completed: true },
    { id: 3, text: "Probar rutas del backend", completed: false }
];

app.get("/", (req: any, res: any) => {
    res.send("Backend is working!");
});

app.get("/tasks", (req: any, res: any) => {
    res.json(tasks);
});

app.post("/tasks", (req: any, res: any) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.status(400).json({
            message: "Task text is required"
        });
    }

    const newTask: Task = {
        id: Date.now(),
        text: text.trim(),
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req: any, res: any) => {
    const id = Number(req.params.id);
    const { text, completed } = req.body;
    const task = tasks.find((task) => task.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    if (text !== undefined) {
        task.text = text;
    }

    if (completed !== undefined) {
        task.completed = completed;
    }

    res.json(task);
});

app.get("/tasks/delete/:id", (req: any, res: any) => {
    const id = Number(req.params.id);
    const taskExists = tasks.some((task) => task.id === id);
    
    if (!taskExists) {
        return res.status(404).json({
            message: "Task not found"
        });
    }
    
    const updatedTasks = tasks.filter((task) => task.id !== id);
    tasks.length = 0;
    tasks.push(...updatedTasks);
    
    res.json({
        message: "Task deleted successfully",
        tasks: tasks
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
