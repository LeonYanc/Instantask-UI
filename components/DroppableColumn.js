import { useDroppable } from "@dnd-kit/core";

export function DroppableColumn({ column, children }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { columnId: column.id },
  });

  return (
    <div ref={setNodeRef} className="bg-white rounded shadow p-4 min-h-[200px]">
      <h2 className="text-xl font-semibold mb-4">{column.name}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
