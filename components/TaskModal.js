import { useState } from "react";
import Modal from "react-modal";

const API_URL = "http://localhost:8080";

export default function TaskModal({ task, closeModal }) {
  const [taskData, setTaskData] = useState({ ...task });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_URL}/tasks/${taskData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      closeModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal}
      contentLabel="Modify Task"
      className="bg-white p-6 rounded shadow-lg max-w-md mx-auto"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-lg font-bold mb-4">Modify task</h2>
      
      <label className="block mb-2">Task Name</label>
      <input
        type="text"
        name="name"
        value={taskData.name}
        onChange={handleChange}
        className="border rounded w-full p-2 mb-4"
      />

      <label className="block mb-2">Status</label>
      <select
        name="status"
        value={taskData.status}
        onChange={handleChange}
        className="border rounded w-full p-2 mb-4"
      >
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>

      <label className="block mb-2">Priority</label>
      <input
        type="number"
        name="priority"
        value={taskData.priority}
        onChange={handleChange}
        className="border rounded w-full p-2 mb-4"
      />

      <div className="flex justify-end space-x-2">
        <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
      </div>
    </Modal>
  );
}
