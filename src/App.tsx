import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProblemScreen from './pages/AddProblemScreen';
import ModerationPanel from './pages/ModerationPanel';
import AdminPanel from './pages/AdminPanel';
import AccessDenied from './pages/AccessDenied';
import { useAuth } from './hooks/useAuth';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">⏳ Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function RoleProtectedRoute({ children, role }: { children: React.ReactNode; role: 'org' | 'user' }) {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoleLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching role:', error);
          setUserRole(null);
        } else {
          console.log('User role:', data?.role);
          setUserRole(data?.role || null);
        }
      } catch (err) {
        console.error('Error:', err);
        setUserRole(null);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-3">⏳</div>
          <p className="text-lg text-gray-600">Проверка прав доступа...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== role) {
    console.warn(`Access denied: expected ${role}, got ${userRole}`);
    return <AccessDenied />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddProblemScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderation"
          element={
            <RoleProtectedRoute role="org">
              <ModerationPanel />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute role="org">
              <AdminPanel />
            </RoleProtectedRoute>
          }
        />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}