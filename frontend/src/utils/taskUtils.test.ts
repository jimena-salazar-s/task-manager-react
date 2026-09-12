import { describe, it, expect } from 'vitest';
import { esTextoTaskValido, contarTareasPendientes, TaskItem } from './taskUtils';

describe('esTextoTaskValido', () => {
  it('acepta un texto con contenido válido', () => {
    // Arrange
    const texto = 'Aprender Vitest';
    // Act
    const resultado = esTextoTaskValido(texto);
    // Assert
    expect(resultado).toBe(true);
  });

  it('rechaza un texto vacío o con puros espacios', () => {
    const texto = '   ';
    const resultado = esTextoTaskValido(texto);
    expect(resultado).toBe(false);
  });
});

describe('contarTareasPendientes', () => {
  it('cuenta solo las tareas que no están completadas', () => {
    const tareas: TaskItem[] = [
      { id: 1, text: 'Tarea 1', completed: true },
      { id: 2, text: 'Tarea 2', completed: false },
      { id: 3, text: 'Tarea 3', completed: false },
    ];
    expect(contarTareasPendientes(tareas)).toBe(2);
  });

  it('devuelve 0 cuando la lista de tareas está vacía', () => {
    expect(contarTareasPendientes([])).toBe(0);
  });
});
