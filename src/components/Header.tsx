import { Link, useNavigate } from "react-router-dom";
import { LogOut, Plus, BarChart3, Shield, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

type HeaderProps = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

export default function Header({ mobileMenuOpen, setMobileMenuOpen }: HeaderProps) {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
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
                    to="/reports"
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition text-sm"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Отчеты
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




      {
        mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[1000] backdrop-blur-sm md:hidden animate-in fade-in duration-200"
            onClick={closeMobileMenu}
          />
        )
      }


      <div className={`fixed inset-y-0 right-0 z-[1001] w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">Меню</h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading || roleLoading ? (
              <div className="text-gray-500 text-sm py-2 text-center">⏳ Загрузка...</div>
            ) : user ? (
              <>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-gray-900 font-medium truncate">{user.email}</p>
                  {userRole && (
                    <p className="text-blue-600 text-xs mt-1 font-semibold">
                      {userRole === "org" ? "🏢 ЖКХ/Организация" : "👤 Житель"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Link
                    to="/add"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                  >
                    <Plus className="w-5 h-5 text-blue-500" />
                    <span>Сообщить проблему</span>
                  </Link>

                  {userRole === "org" && (
                    <>
                      <Link
                        to="/moderation"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <BarChart3 className="w-5 h-5 text-orange-500" />
                        <span>Модерация</span>
                      </Link>
                      <Link
                        to="/reports"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition"
                      >
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        <span>Отчеты</span>
                      </Link>
                      <Link
                        to="/admin"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition"
                      >
                        <Shield className="w-5 h-5 text-red-500" />
                        <span>Админ-панель</span>
                      </Link>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t mt-auto">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Выход</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  Вход
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header >
  );
}
