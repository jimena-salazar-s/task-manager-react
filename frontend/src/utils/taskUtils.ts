export type TaskItem = {
    id: number;
    text: string;
    completed: boolean;
};

// Valida que el texto de la tarea no esté vacío o solo contenga espacios
export function esTextoTaskValido(texto: string): boolean {
    return texto.trim().length > 0;
}

// Cuenta cuántas tareas pendientes quedan en una lista
export function contarTareasPendientes(tareas: TaskItem[]): number {
    return tareas.filter((t) => !t.completed).length;
}
