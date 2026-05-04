import { useAuth } from '../../context/AuthContext'

const Dashboard = () => {
  const { user, logout } = useAuth()
 
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          You are logged in successfully.
        </p>
        <button
          onClick={logout}
          className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard