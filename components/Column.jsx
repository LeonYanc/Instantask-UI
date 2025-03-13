import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";

const API_URL = "http://localhost:8080";

export default function Column({ columnId, userAccessMap }) {
  const [columnData, setColumnData] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!columnId) return;

    async function fetchColumnData() {
      try {
        const colRes = await fetch(`${API_URL}/columns/${columnId}`);
        if (!colRes.ok) {
          throw new Error(`HTTP error! Status: ${colRes.status}`);
        }
        const col = await colRes.json();
        setColumnData(col);

        const taskPromises = (col.taskCardList || []).map(async (taskId) => {
          const taskRes = await fetch(`${API_URL}/tasks/${taskId}`);
          if (!taskRes.ok) {
            throw new Error(`HTTP error! Status: ${taskRes.status}`);
          }
          return taskRes.json();
        });
        let tasksData = await Promise.all(taskPromises);

        tasksData.sort((a, b) => a.priority - b.priority);
        setTasks(tasksData);
        console.log(tasksData)
      } catch (error) {
        console.error("Error fetching column data:", error);
      }
    }

    fetchColumnData();
  }, [columnId]);

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{columnData?.name}</h2>
      </div>
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} userAccessMap={userAccessMap} />
          ))
        ) : (
          <p className="text-gray-400 text-sm italic">No tasks in this column</p>
        )}
      </div>
    </div>
  );
}
