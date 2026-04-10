import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // The main takes the full height of the screen minus the layout. 
  // It relies on child views to set padding if they want it.
  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 h-screen bg-background relative overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
