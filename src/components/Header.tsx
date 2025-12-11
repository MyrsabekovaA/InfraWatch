import { Link, useNavigate } from "react-router-dom";
import { LogOut, Plus, BarChart3, Shield, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Header() {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !userRole) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      setRoleLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.error("Ошибка загрузки роли:", error);
        return;
      }

      if (data) {
        setUserRole(data.role);
      }
    } catch (err) {
      console.error("Ошибка при получении роли:", err);
    } finally {
      setRoleLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold text-white hover:text-blue-100 transition flex-shrink-0"
        >
          🏙️ InfraWatch
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {loading || roleLoading ? (
            <div className="text-white text-sm">⏳ Загрузка...</div>
          ) : user ? (
            <>
              <Link
                to="/add"
                className="flex items-center gap-2 px-3 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                Проблема
              </Link>

              {userRole === "org" && (
                <>
                  <Link
                    to="/moderation"
                    className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition text-sm"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Модерация
                  </Link>
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Админ
                  </Link>
                </>
              )}

              <div className="flex items-center gap-2">
                <div className="text-white text-xs text-right hidden lg:block">
                  <p className="font-medium truncate max-w-[150px]">{user.email}</p>
                  {userRole && (
                    <p className="text-xs text-blue-100">
                      {userRole === "org" ? "ЖКХ/Организация" : "Житель"}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Выход</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition text-sm"
              >
                Вход
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white hover:text-blue-100 transition"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-blue-600 to-indigo-700 border-t border-blue-500 px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {loading || roleLoading ? (
            <div className="text-blue-100 text-sm py-2">⏳ Загрузка...</div>
          ) : user ? (
            <>
              <div className="bg-blue-500 bg-opacity-30 px-3 py-2 rounded-lg mb-3">
                <p className="text-white text-sm font-medium truncate">
                  {user.email}
                </p>
                {userRole && (
                  <p className="text-blue-100 text-xs mt-1">
                    {userRole === "org" ? "🏢 ЖКХ/Организация" : "👤 Житель"}
                  </p>
                )}
              </div>

              <Link
                to="/add"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 w-full px-4 py-3 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Сообщить проблему</span>
              </Link>

              {userRole === "org" && (
                <>
                  <Link
                    to="/moderation"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Модерация</span>
                  </Link>
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Админ-панель</span>
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition mt-3"
              >
                <LogOut className="w-5 h-5" />
                <span>Выход</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center w-full px-4 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                Вход
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="flex items-center justify-center w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
