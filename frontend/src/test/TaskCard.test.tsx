// @vit-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../components/TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: 1,
    text: 'Estudiar para el examen',
    completed: false,
  };

  it('renderiza correctamente el texto de la tarea', () => {
    // Arrange & Act
    render(
      <TaskCard 
        task={mockTask} 
        onDeleteTask={() => {}} 
        onToggleTask={() => {}} 
      />
    );

    // Assert
    expect(screen.getByText('Estudiar para el examen')).toBeTruthy();
  });

  it('llama a onToggleTask al hacer clic en el icono de marcar tarea', async () => {
    // Arrange
    const onToggleTask = vi.fn();
    const usuario = userEvent.setup();

    render(
      <TaskCard 
        task={mockTask} 
        onDeleteTask={() => {}} 
        onToggleTask={onToggleTask} 
      />
    );

    // Act
    const taskIcon = document.querySelector('.task-icon');
    expect(taskIcon).not.toBeNull();
    await usuario.click(taskIcon!);

    // Assert
    expect(onToggleTask).toHaveBeenCalledWith(1);
  });

  it('llama a onDeleteTask al hacer clic en el botón de eliminar', async () => {
    // Arrange
    const onDeleteTask = vi.fn();
    const usuario = userEvent.setup();

    render(
      <TaskCard 
        task={mockTask} 
        onDeleteTask={onDeleteTask} 
        onToggleTask={() => {}} 
      />
    );

    // Act
    const deleteButton = screen.getByRole('button', {
      name: 'Eliminar tarea',
    });
    await usuario.click(deleteButton);

    // Assert
    expect(onDeleteTask).toHaveBeenCalledWith(1);
  });
});
