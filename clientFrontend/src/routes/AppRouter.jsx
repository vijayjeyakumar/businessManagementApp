import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/auth/Login'
import Dashboard from '../pages/dashboard/Dashboard'

const AppRouter = () => {
  return (
    <Routes>

      <Route path={ROUTES.LOGIN} element={<Login />} />

      <Route path={ROUTES.DASHBOARD} element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />

    </Routes>
  )
}

export default AppRouter