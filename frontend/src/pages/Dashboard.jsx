import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Notes from "../components/Notes";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, changeUserName, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [newUserName, setNewUserName] = useState(user.userName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      alert('Logout failed');
    }
  };

  const handleUpdate = async () => {
    if (!newUserName.trim()) {
      setError("Username cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await changeUserName(newUserName.trim());
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl m-5 p-8 w-full text-center">

        <div className="flex items-center justify-between mb-6">
          <p className="text-2xl font-semibold text-indigo-600">Welcome, {user.userName}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700 transition"
            >
              Change Username
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 cursor-pointer text-white hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {editing && (
          <div className="mb-6">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-3"
              placeholder="Enter new username"
            />
            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            <div className="flex justify-center gap-3">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-green-600 cursor-pointer text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => {
                  setEditing(false);
                  setNewUserName(user.userName);
                  setError("");
                }}
                className="px-5 py-2 rounded-lg cursor-pointer bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <hr className="my-6" />

        <Notes />

      </div>
    </div>
  );
};

export default Dashboard;
