import { Routes, Route } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard'
import NotFound from '../pages/NotFound'
import MainLayout from '../components/layout/MainLayout'

const AppRouter = () => {
  return (
    <Routes>

      {/* Public */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      {/* Protected — MainLayout wraps all pages inside */}
      <Route element={<ProtectedRoute>
            <MainLayout />
          </ProtectedRoute> }  >

        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        {/* later you add more pages here as children */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default AppRouter