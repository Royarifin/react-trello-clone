import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities'


const TaskCard = ({ task}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable ({id: task.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,

    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="task-card"
            
        >
            {task.text}
        </div>
    );
};

export default  TaskCard;