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

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (passwordMatch) {
            const token = jwt.sign(
                { id: user.id, name: user.name, email: user.email }, 
                SECRET_KEY, 
                { expiresIn: "1h" }
            );

            return res.json({
                message: "Login successful",
                token: token
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }

    res.status(401).json({ message: "Invalid credentials" });
});

app.post("/register", async (req: any, res: any) => {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.trim(),
                password: hashedPassword
            }
        });

        res.status(201).json({ message: "User registered successfully", user: {userId: newUser.id, name: newUser.name, email: newUser.email }});
    } catch (error: any) {
        console.error("ERROR EN REGISTRO:", error); 
        
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

app.get("/tasks", authenticateToken, async (req: any, res: any) => {
    const userId = req.user.id; 

    const tasksFromDatabase = await prisma.task.findMany({
        where: { userId: userId }
    });
    
    res.json(tasksFromDatabase);
});

app.post("/tasks", authenticateToken, async (req: any, res: any) => {
    const { text } = req.body;
    const userId = req.user.id; // ID extraído del token

    if (!text || text.trim() === "") {
        return res.status(400).json({ message: "Task text is required" });
    }

    const newTask = await prisma.task.create({
        data: { 
            text: text.trim(), 
            completed: false,
            userId: userId
        }
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
