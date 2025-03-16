import React, { useState } from "react";

const STATUS_OPTIONS = ["TO DO", "IN PROGRESS", "DONE"];

export default function TaskCard({ task, userAccessMap }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editData, setEditData] = useState({
    name: task.name || "",
    status: task.status || "TO DO",
    priority: task.priority || 0,
    assigneeId: task.assigneeId || ""
  });

  const assigneeName = task.assigneeId
    ? userAccessMap[task.assigneeId] || "Unknown"
    : "Unassigned";

  const handleOpenModal = () => {
    setEditData({
      name: task.name || "",
      status: task.status || "TO DO",
      priority: task.priority || 0,
      assigneeId: task.assigneeId || ""
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8080/taskcards/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: task.id, 
          priority: Number(editData.priority),
        }),
      });

      if (!response.ok) {
        throw new Error(`Update failed: ${response.status}`);
      }

      console.log("TaskCard updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <>
      <div
        className="border p-3 rounded flex justify-between items-center cursor-pointer"
        onClick={handleOpenModal}
      >
        <div>
          <p
            className={`font-medium ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.name || "Unnamed Task"}
          </p>
          <p className="text-sm text-gray-400">Assigned to: {assigneeName}</p>
          <p className="text-xs text-gray-500">Priority: {task.priority}</p>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-pink-50 p-6 rounded shadow-md max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Modify task</h2>
              <button onClick={handleCloseModal}>×</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="name">
                  Task Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="border p-2 w-full rounded"
                  value={editData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="border p-2 w-full rounded"
                  value={editData.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="priority">
                  Priority
                </label>
                <input
                  id="priority"
                  name="priority"
                  type="number"
                  className="border p-2 w-full rounded"
                  value={editData.priority}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Assignee
                </label>
                <select
                  name="assigneeId"
                  className="border p-2 w-full rounded"
                  value={editData.assigneeId}
                  onChange={handleChange}
                >
                  <option value="">Unassigned</option>
                  {Object.entries(userAccessMap).map(([uaId, uaName]) => (
                    <option key={uaId} value={uaId}>
                      {uaName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
