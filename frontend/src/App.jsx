import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';

// User pages
import DashboardPage from './pages/user/DashboardPage';
import CameraPage from './pages/user/CameraPage';
import TextToSignPage from './pages/user/TextToSignPage';
import TextToSpeechPage from './pages/user/TextToSpeechPage';
import HistoryPage from './pages/user/HistoryPage';
import LearningPage from './pages/user/LearningPage';
import ProfilePage from './pages/user/ProfilePage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDictionary from './pages/admin/ManageDictionary';

function App() {
  const { user } = useAuth();

  // Layout cho user (có header và navbar)
  const UserLayout = ({ children }) => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <main className="flex-grow bg-gray-50">{children}</main>
      <Footer />
    </div>
  );

  // Layout cho admin (có sidebar)
  const AdminLayout = ({ children }) => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow bg-gray-50">{children}</main>
      </div>
      <Footer />
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Các route của User */}
      <Route path="/" element={<PrivateRoute><UserLayout><DashboardPage /></UserLayout></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><UserLayout><DashboardPage /></UserLayout></PrivateRoute>} />
      <Route path="/camera" element={<PrivateRoute><UserLayout><CameraPage /></UserLayout></PrivateRoute>} />
      <Route path="/text-to-sign" element={<PrivateRoute><UserLayout><TextToSignPage /></UserLayout></PrivateRoute>} />
      <Route path="/text-to-speech" element={<PrivateRoute><UserLayout><TextToSpeechPage /></UserLayout></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><UserLayout><HistoryPage /></UserLayout></PrivateRoute>} />
      <Route path="/learning" element={<PrivateRoute><UserLayout><LearningPage /></UserLayout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><UserLayout><ProfilePage /></UserLayout></PrivateRoute>} />

      {/* Các route của Admin */}
      <Route path="/admin/dashboard" element={<PrivateRoute requireAdmin><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute requireAdmin><AdminLayout><ManageUsers /></AdminLayout></PrivateRoute>} />
      <Route path="/admin/dictionary" element={<PrivateRoute requireAdmin><AdminLayout><ManageDictionary /></AdminLayout></PrivateRoute>} />
      
      {/* Mặc định redirect */}
      <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login'} />} />
    </Routes>
  );
}

export default App;