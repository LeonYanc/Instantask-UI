import { useState, useEffect } from "react";
import Column from "./Column";

const API_URL = "http://localhost:8080";

export default function BoardPage({ boardId }) {
  const [userId, setUserId] = useState(null);

  const [columns, setColumns] = useState([]);
  const [userAccessMap, setUserAccessMap] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("userId");
    setUserId(uid);
  }, []);

  useEffect(() => {
    if (!boardId) return;

    async function fetchBoardData() {
      try {
        const userAccessResponse = await fetch(
          `${API_URL}/api/user-access/board/${boardId}`
        );
        if (!userAccessResponse.ok) {
          throw new Error(`HTTP error! Status: ${userAccessResponse.status}`);
        }
        const userAccessList = await userAccessResponse.json();

        const userIds = userAccessList.map((ua) => ua.userId);
        const userPromises = userIds.map(async (uid) => {
          const userRes = await fetch(`${API_URL}/api/users/${uid}/detail`);
          if (!userRes.ok) {
            throw new Error(`HTTP error! Status: ${userRes.status}`);
          }
          return userRes.json();
        });
        const users = await Promise.all(userPromises);

        const tempMap = {};
        userAccessList.forEach((ua, index) => {
          tempMap[ua.id] = users[index]?.name || "Unknown";
        });
        setUserAccessMap(tempMap);

        const boardResponse = await fetch(`${API_URL}/boards/${boardId}`);
        if (!boardResponse.ok) {
          throw new Error(`HTTP error! Status: ${boardResponse.status}`);
        }
        const boardData = await boardResponse.json();
        console.log(boardData.columns);
        if (boardData.columns) {
          setColumns(boardData.columns);
        } else {
          setColumns([]);
        }
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    }

    fetchBoardData();
  }, [boardId]);

  const handleUserIconClick = () => {
    if (!boardId || !userId) {
      console.warn("boardId 或 userId 不存在，无法跳转");
      return;
    }
    const url = `http://localhost:3000/UserListPage?boardId=${boardId}&userId=${userId}`;
    window.location.href = url;
  };

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Board</h1>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleUserIconClick}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
            title="查看用户列表"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A9.993 9.993 0 0112 15c2.29 0 4.397.76 6.064 2.036M15 10a3 3 0 10-6 0 3 3 0 006 0z"
              />
            </svg>
          </button>

          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
            Filter
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
            Search
          </button>
        </div>
      </header>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((columnId) => (
          <Column key={columnId} columnId={columnId} userAccessMap={userAccessMap} />
        ))}
      </div>
    </div>
  );
}
