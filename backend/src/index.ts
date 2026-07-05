const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 

const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = 3000;

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const SECRET_KEY = "secret_key";

const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

app.get("/", (req: any, res: any) => {
    res.send("Backend is working!");
});

app.post("/login", async (req: any, res: any) => {
    const { email, password } = req.body || {};

    const adminEmail = "admin@test.com";
    const adminPasswordHash = await bcrypt.hash("123456", 10);

    if (email === adminEmail) {
        const passwordMatch = await bcrypt.compare(password, adminPasswordHash);

        if (passwordMatch) {
            const token = jwt.sign({ email: email }, SECRET_KEY, { expiresIn: "1h" });
            return res.json({
                message: "Login successful",
                token: token
            });
        }
    }

    res.status(401).json({ message: "Invalid credentials" });
});

app.get("/tasks", authenticateToken, async (req: any, res: any) => {
    const tasksFromDatabase = await prisma.task.findMany();
    res.json(tasksFromDatabase);
});

app.post("/tasks", authenticateToken, async (req: any, res: any) => {
    const { text } = req.body;
    if (!text || text.trim() === "") {
        return res.status(400).json({ message: "Task text is required" });
    }

    const newTask = await prisma.task.create({
        data: { text: text.trim(), completed: false }
    });
    res.status(201).json(newTask);
});

app.put("/tasks/:id", authenticateToken, async (req: any, res: any) => {
    const id = Number(req.params.id);
    const { text, completed } = req.body;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ message: "Task not found" });

    const updatedTask = await prisma.task.update({
        where: { id },
        data: {
            ...(text !== undefined && { text: text.trim() }),
            ...(completed !== undefined && { completed })
        }
    });
    res.json(updatedTask);
});

app.delete("/tasks/:id", authenticateToken, async (req: any, res: any) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid task id" });

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ message: "Task not found" });

    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
