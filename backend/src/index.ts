const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = 3000;

const prisma = new PrismaClient();

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

app.use(cors());
app.use(express.json());

app.get("/", (req: any, res: any) => {
    res.send("Backend is working!");
});

app.post("/login", (req: any, res: any) => {
    const { email, password } = req.body || {};

    if (email === "admin@test.com" && password === "123456") {
        const token = jwt.sign(
            { email: email },
            "secret_key",
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login successful",
            token: token
        });
    }

    res.status(401).json({
        message: "Invalid credentials"
    });
});

app.get("/profile", (req: any, res: any) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, "secret_key");
    
        res.json({
            message: "Protected profile data",
            user: decoded
        });
    } catch (error) {
        res.status(401).json({
            message: "Invalid token"
        });
    }
});

app.get("/tasks", async (req: any, res: any) => {
    const tasksFromDatabase = await prisma.task.findMany();
    
    res.json(tasksFromDatabase);
});

app.post("/tasks", async (req: any, res: any) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.status(400).json({
            message: "Task text is required"
        });
    }

    const newTask = await prisma.task.create({
        data: {
            text: text.trim(),
            completed: false
        }
    });

    res.status(201).json(newTask);
});

app.put("/tasks/:id", async (req: any, res: any) => {
    const id = Number(req.params.id);
    const { text, completed } = req.body;

    const existingTask = await prisma.task.findUnique({
        where: {
            id: id
        }
    });

    if (!existingTask) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const updatedTask = await prisma.task.update({
        where: {
            id: id
        },
        data: {
            ...(text !== undefined && { text: text.trim() }),
            ...(completed !== undefined && { completed })
        }
    });

    res.json(updatedTask);
});

app.delete("/tasks/:id", async (req: any, res: any) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Invalid task id"
        });
    }

    const existingTask = await prisma.task.findUnique({
        where: { id }
    });

    if (!existingTask) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const deletedTask = await prisma.task.delete({
        where: { id }
    });

    res.json({
        message: "Task deleted successfully",
        task: deletedTask
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
