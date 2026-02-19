import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import AddUser from './pages/AddUser'
import ManageUsers from './pages/ManageUsers'
import SetRent from './pages/SetRent'
import PaymentHistory from './pages/PaymentHistory'
import UploadReceipt from './pages/UploadReceipt'
import BillView from './pages/BillView'
import Reports from './pages/Reports'
import UserProfile from './pages/UserProfile'
import Analytics from './pages/Analytics'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="set-rent" element={<SetRent />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="payment-history" element={<PaymentHistory />} />
             

            </Route>

            {/* User Routes */}
            <Route path="/user" element={<PrivateRoute allowedRoles={['user']} />}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="bill" element={<BillView />} />
              <Route path="upload-receipt" element={<UploadReceipt />} />
              <Route path="payment-history" element={<PaymentHistory />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
