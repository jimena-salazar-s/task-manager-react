import { test, expect } from '@playwright/test'

test('un usuario se registra, inicia sesión, crea una tarea y la ve en la lista', async ({ page, request }) => {
  // Generar un correo único para evitar conflictos si la prueba corre varias veces
  const uniqueEmail = `test_${Date.now()}@ejemplo.com`;
  const password = 'password123';

  // 1. Registrar el usuario directamente por la API para preparar el entorno
  const registerResponse = await request.post('http://localhost:3000/register', {
    data: {
      name: 'Usuario Test',
      email: uniqueEmail,
      password: password
    }
  });
  
  expect(registerResponse.ok()).toBeTruthy();

  // 2. Entrar a la aplicación (pantalla de Login)
  await page.goto('/');

  // 3. Iniciar sesión con el usuario recién creado
  await page.getByPlaceholder('your@email.com').fill(uniqueEmail);
  await page.getByPlaceholder('********').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  // 4. Crear una tarea en el panel principal
  await page.getByPlaceholder('Add a new task').fill('Comprar pan');
  await page.getByRole('button', { name: 'New Task' }).click();

  // 5. Verificar que la tarea aparezca visible en la lista
  await expect(page.getByText('Comprar pan')).toBeVisible();
});