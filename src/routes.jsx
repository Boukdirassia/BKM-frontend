import React from 'react';
import { Routes, Route, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import CarDetails from './pages/CarDetails/CarDetails';
import AdminLayout from './components/Admin/Layout/AdminLayout';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Reservation from './pages/Reservation/Reservation';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const route = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      
    ]
  }
])

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} children= {[ ]} />
      <Route path="/search" element={<Search />} />
      <Route path="/car/:id" element={<CarDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route
        path="/reservation/:id"
        element={
          <ProtectedRoute>
            <Reservation />
          </ProtectedRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="vehicles" element={<div>Vehicles Management</div>} />
                <Route path="users" element={<div>Users Management</div>} />
                <Route path="reservations" element={<div>Reservations Management</div>} />
                <Route path="reports" element={<div>Reports</div>} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
