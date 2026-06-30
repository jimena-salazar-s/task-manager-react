const express = require("express");

const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
