// src/components/Board.jsx
import React, { useState } from 'react';
// Impor DragOverlay dan sensor
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import TaskCard from './TaskCard.jsx';

const initialData = [
    { id: 'col-1', title: "To Do", tasks: [{ id: 'task-101', text: "Analisis kebutuhan" }, { id: 'task-102', text: "Buat desain UI/UX" }] },
    { id: 'col-2', title: "In Progress", tasks: [{ id: 'task-201', text: "Kembangkan komponen utama" }] },
    { id: 'col-3', title: "Done", tasks: [{ id: 'task-301', text: "Setup proyek awal" }] }
];

const Board = () => {
    const [columns, setColumns] = useState(initialData);
    const [activeTask, setActiveTask] = useState(null); // State baru untuk menyimpan task yang di-drag

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Hanya mulai drag jika mouse bergerak lebih dari 8px
            },
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        const task = columns.flatMap(col => col.tasks).find(t => t.id === active.id);
        setActiveTask(task);
    };

    const handleDragEnd = (event) => {
        
        const { active, over } = event;
        if (!over) { setActiveTask(null); return; }
        if (active.id === over.id) { setActiveTask(null); return; }
        const activeColumn = columns.find(col => col.tasks.some(task => task.id === active.id));
        let overColumn = columns.find(col => col.id === over.id || col.tasks.some(task => task.id === over.id));
        if (!overColumn) { overColumn = columns.find(col => col.id === over.id); }
        if (!activeColumn || !overColumn) { setActiveTask(null); return; }
        if (activeColumn.id === overColumn.id) {
            const oldIndex = activeColumn.tasks.findIndex(task => task.id === active.id);
            const newIndex = overColumn.tasks.findIndex(task => task.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                const newTasks = arrayMove(activeColumn.tasks, oldIndex, newIndex);
                setColumns(currentColumns => currentColumns.map(col => (col.id === activeColumn.id) ? { ...col, tasks: newTasks } : col));
            }
        } else {
            const activeTask = activeColumn.tasks.find(task => task.id === active.id);
            const newActiveColumnTasks = activeColumn.tasks.filter(task => task.id !== active.id);
            const newOverColumnTasks = [...overColumn.tasks];
            const overIndex = overColumn.tasks.findIndex(task => task.id === over.id);
            if (overIndex !== -1) {
                newOverColumnTasks.splice(overIndex, 0, activeTask);
            } else {
                newOverColumnTasks.push(activeTask);
            }
            setColumns(currentColumns => currentColumns.map(col => {
                if (col.id === activeColumn.id) return { ...col, tasks: newActiveColumnTasks };
                if (col.id === overColumn.id) return { ...col, tasks: newOverColumnTasks };
                return col;
            }));
        }
        setActiveTask(null);
    };

    return (
        <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="board">
                {columns.map(column => (
                    <div key={column.id} className="column">
                        <h2>{column.title}</h2>
                        <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                            <div className="tasks">
                                {column.tasks.map(task => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                ))}
            </div>

            <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
};

export default Board;