import { useState, useEffect } from "react";

const API_URL = "http://localhost:8080"; 

export default function BoardPage() {
  const [columns, setColumns] = useState([]);
  const [userAccessMap, setUserAccessMap] = useState({}); 

  useEffect(() => {
    async function fetchBoardData() {
      try {
        const boardResponse = await fetch(`${API_URL}/boards`);
        if (!boardResponse.ok) throw new Error(`HTTP error! Status: ${boardResponse.status}`);
        const boards = await boardResponse.json();
        if (!boards || boards.length === 0) {
          console.error("No boards found!");
          return;
        }
        const board = boards[0]; 
        console.log("Board Data:", board);

        const userAccessResponse = await fetch(`${API_URL}/api/user-access/board/${board.id}`);
        if (!userAccessResponse.ok) throw new Error(`HTTP error! Status: ${userAccessResponse.status}`);
        const userAccessList = await userAccessResponse.json();
        console.log("UserAccess List:", userAccessList);

        const userIds = userAccessList.map(userAccess => userAccess.userId);

        const userPromises = userIds.map(async (userId) => {
          const userResponse = await fetch(`${API_URL}/api/users/${userId}/detail`);
          if (!userResponse.ok) throw new Error(`HTTP error! Status: ${userResponse.status}`);
          return userResponse.json();
        });

        const users = await Promise.all(userPromises);

        //{ userAccessId: userName }
        const userAccessMap = {};
        userAccessList.forEach((userAccess, index) => {
          userAccessMap[userAccess.id] = users[index].name;
        });

        setUserAccessMap(userAccessMap);
        console.log("User Access Map:", userAccessMap);

        //Columns
        const columnPromises = board.columns.map(async (columnId) => {
          const columnResponse = await fetch(`${API_URL}/columns/${columnId}`);
          if (!columnResponse.ok) throw new Error(`HTTP error! Status: ${columnResponse.status}`);
          const column = await columnResponse.json();

          console.log(`Column Data (${columnId}):`, column);

          const taskPromises = column.taskCardList.map(async (taskCardId) => {
            const taskResponse = await fetch(`${API_URL}/tasks/${taskCardId}`);
            if (!taskResponse.ok) throw new Error(`HTTP error! Status: ${taskResponse.status}`);
            const task = await taskResponse.json();

            console.log("Task Data:", task);

            const assigneeName = task.assigneeId ? userAccessMap[task.assigneeId] || "Unknown" : "Unassigned";

            return { ...task, assigneeName };
          });

          const tasks = await Promise.all(taskPromises);
          tasks.sort((a, b) => a.priority - b.priority); 

          console.log(`Tasks for Column ${column.name}:`, tasks);

          return { ...column, tasks };
        });

        const columnsData = await Promise.all(columnPromises);
        console.log("Final Columns Data:", columnsData);
        setColumns(columnsData);
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    }

    fetchBoardData();
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Board</h1>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
            Filter
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
            Search
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="bg-white rounded shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{column.name}</h2>
            </div>
            <div className="space-y-3">
              {column.tasks.length > 0 ? (
                column.tasks.map((task) => (
                  <div key={task.id} className="border p-3 rounded flex justify-between items-center">
                    <div>
                      <p className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.name ? task.name : "Unnamed Task"}
                      </p>
                      <p className="text-sm text-gray-400">
                        Assigned to: {task.assigneeName}
                      </p>
                      <p className="text-xs text-gray-500">Priority: {task.priority}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">No tasks in this column</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
