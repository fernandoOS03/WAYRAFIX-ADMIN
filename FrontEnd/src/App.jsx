import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/AdminLayout';
import Login from './views/Login';

import Dashboard from './views/Dashboard';
import Historial from './views/Historial';
import Clientes from './views/Clientes';
import Finanzas from './views/Finanzas';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="historial" element={<Historial />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="finanzas" element={<Finanzas />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
