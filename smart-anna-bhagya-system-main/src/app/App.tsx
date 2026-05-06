import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot';
import Landing from './components/Landing';
import UserRegister from './components/user/UserRegister';
import UserLogin from './components/user/UserLogin';
import UserResetPassword from './components/user/UserResetPassword';
import UserDashboard from './components/user/UserDashboard';
import DistributorLogin from './components/distributor/DistributorLogin';
import DistributorDashboard from './components/distributor/DistributorDashboard';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

export type UserType = 'user' | 'distributor' | 'admin' | null;

export interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  userData: any;
  login: (type: UserType, data: any) => void;
  logout: () => void;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [userData, setUserData] = useState<any>(null);

  const login = (type: UserType, data: any) => {
    setIsAuthenticated(true);
    setUserType(type);
    setUserData(data);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setUserData(null);
  };

  const authContext: AuthContextType = {
    isAuthenticated,
    userType,
    userData,
    login,
    logout,
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* User Routes */}
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/login" element={<UserLogin authContext={authContext} />} />
          <Route path="/user/reset-password" element={<UserResetPassword />} />
          <Route
            path="/user/dashboard"
            element={
              isAuthenticated && userType === 'user'
                ? <UserDashboard authContext={authContext} />
                : <Navigate to="/user/login" />
            }
          />

          {/* Distributor Routes */}
          <Route path="/distributor/login" element={<DistributorLogin authContext={authContext} />} />
          <Route
            path="/distributor/dashboard"
            element={
              isAuthenticated && userType === 'distributor'
                ? <DistributorDashboard authContext={authContext} />
                : <Navigate to="/distributor/login" />
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin authContext={authContext} />} />
          <Route
            path="/admin/dashboard"
            element={
              isAuthenticated && userType === 'admin'
                ? <AdminDashboard authContext={authContext} />
                : <Navigate to="/admin/login" />
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </>
  );
}
