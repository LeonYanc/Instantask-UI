import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import TaskModal from "./TaskModal"; 

export function DraggableTask({ task, columnId }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { columnId },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : {};

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="border p-3 rounded bg-gray-100 cursor-grab flex justify-between items-center"
      >
        <div className="w-full" onClick={(e) => e.stopPropagation()}> {}
          <p className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
            {task.name || "Unnamed Task"}
          </p>
          <p className="text-sm text-gray-400">Priority: {task.priority}</p>
        </div>

        {}
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            setIsModalOpen(true);
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          ✏️
        </button>
      </div>

      {isModalOpen && (
        <TaskModal task={task} closeModal={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
