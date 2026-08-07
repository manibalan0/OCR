import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import NewComplaintModal from './components/NewComplaintModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintDetail from './pages/ComplaintDetail';
import { AlertCircle } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const MainApp = () => {
  const { toastMessage } = useContext(AuthContext);
  const [isGlobalNewOpen, setIsGlobalNewOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar onOpenNewComplaint={() => setIsGlobalNewOpen(true)} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRoles={['AGENT', 'ADMIN']}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaint/:id"
            element={
              <ProtectedRoute>
                <ComplaintDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <NewComplaintModal
        isOpen={isGlobalNewOpen}
        onClose={() => setIsGlobalNewOpen(false)}
        onCreated={() => {
          setIsGlobalNewOpen(false);
          window.location.reload();
        }}
      />

      {toastMessage && (
        <div className="toast">
          <AlertCircle size={18} style={{ color: '#818cf8' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
