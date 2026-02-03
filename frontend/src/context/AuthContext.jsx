import api from "../api/api.js";
import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/users/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const registerUser = async (userName, email, password) => {
    try {
      const { data } = await api.post("/users/register", {
        userName,
        email,
        password,
      });
      setUser(data);
      return data;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const { data } = await api.post("/users/login", {
        email,
        password,
      });
      setUser(data);
      return data;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    await api.post("/users/logout");
    setUser(null);
  };


  const changeUserName = async (userName) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const { data } = await api.patch("/users/me", { userName });

      setUser((prev) => ({
        ...prev,
        userName: data.userName,
      }));

      return data;
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="border-4 inline-block h-8 w-8 rounded-full border-indigo-600 border-r-transparent animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerUser,
        loginUser,
        logout,
        changeUserName, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
