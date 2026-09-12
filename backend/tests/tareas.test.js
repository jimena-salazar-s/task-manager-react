import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../src/index' // Importa tu app de Express

describe('API de tareas', () => {
    let token = '';

    it('registra y loguea un usuario de prueba para obtener token', async () => {
        // Primero intentamos registrarlo por si no existe
        await request(app)
            .post('/register')
            .send({ name: 'Test', email: 'test@ejemplo.com', password: 'password123' });

        // Luego hacemos el login para capturar el token
        const res = await request(app)
            .post('/login')
            .send({ email: 'test@ejemplo.com', password: 'password123' });

        token = res.body.token;
        expect(token).toBeDefined();
    });

    it('lista las tareas creadas (protegido por token)', async () => {
        const res = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('crea una tarea nueva', async () => {
        const res = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Escribir informe técnico' });

        expect(res.status).toBe(201);
        expect(res.body.text).toBe('Escribir informe técnico');
        expect(res.body.completed).toBe(false);
    });

    it('rechaza crear una tarea con texto vacío', async () => {
        const res = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: '   ' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Task text is required");
    });

    it('falla al intentar actualizar una tarea con un ID inválido o no numérico', async () => {
        const invalidId = 'abc-id-invalido';
        const res = await request(app)
            .put(`/tasks/${invalidId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Actualización inválida', completed: true });

        // Ronda 1: Detectamos si el servidor maneja mal el tipado del ID o falla
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid task id");
    });
});
