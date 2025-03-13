
import { useState, useEffect } from "react";
import BoardPage from "../components/BoardPage";

const API_URL = "http://localhost:8080";

export default function BoardContainer() {
  const [userId, setUserId] = useState(null);
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("userId");
    setUserId(uid);
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function fetchUserBoards() {
      try {
        const res = await fetch(`${API_URL}/boards?userId=${userId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setBoards(data || []);

        if (data && data.length > 0) {
          setActiveBoardId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching user's boards:", error);
      }
    }

    fetchUserBoards();
  }, [userId]);

  const handleAddBoard = () => {
    console.log("Add new board...");
  };

  return (
    <div className="flex min-h-screen bg-pink-50">
      {/* Nav */}
      <aside className="w-20 bg-white border-r flex flex-col items-center py-4">
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => setActiveBoardId(board.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-4
              ${
                activeBoardId === board.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }
            `}
            title={board.code}
          >
            {board.code ? board.code[0] : "?"}
          </button>
        ))}

        {/* */}
        <button
          onClick={handleAddBoard}
          className="w-10 h-10 rounded-full flex items-center justify-center mt-auto mb-2 bg-green-500 text-white"
          title="Add new Board"
        >
          +
        </button>
      </aside>

      {/* BoardPage */}
      <main className="flex-1 p-6">
        {activeBoardId ? (
          <BoardPage boardId={activeBoardId} />
        ) : (
          <p className="text-gray-600">choose board</p>
        )}
      </main>
    </div>
  );
}
