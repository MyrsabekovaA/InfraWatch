import { Link, useNavigate } from "react-router-dom";
import { LogOut, Plus, BarChart3, Shield, Menu, X, ChevronDown, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
// @ts-ignore
import logo from "../assets/logo.svg";

type HeaderProps = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

export default function Header({ mobileMenuOpen, setMobileMenuOpen }: HeaderProps) {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen
            ? "bg-white/80 backdrop-blur-xl shadow-glass border-b border-white/20"
            : "bg-white/5 backdrop-blur-sm border-b border-transparent"
          }`}
      >
        <nav className="container mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img src={logo} alt="InfraWatch Logo" className="w-full h-full object-cover" />
            </div>
            <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 ${!scrolled && !mobileMenuOpen ? 'text-gray-800' : ''}`}>
              InfraWatch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {loading || roleLoading ? (
              <div className="animate-pulse flex items-center gap-2">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            ) : user ? (
              <>
                <Link
                  to="/add"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 font-semibold rounded-xl hover:bg-primary-100 transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Проблема</span>
                </Link>

                {userRole === "org" && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-100">
                    <Link
                      to="/moderation"
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-all"
                      title="Модерация"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/reports"
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-all"
                      title="Отчеты"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/admin"
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                      title="Админ"
                    >
                      <Shield className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                <div className="pl-4 ml-2 border-l border-gray-200 flex items-center gap-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">{user.email}</p>
                    {userRole && (
                      <p className="text-xs text-primary-500 font-medium">
                        {userRole === "org" ? "Организация" : "Житель"}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Выход"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 font-semibold hover:text-primary-600 transition"
                >
                  Вход
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:scale-105"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </header>

      {/* Spacer to prevent content overlap */}
      <div className="h-20" />

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] md:hidden animate-in fade-in duration-200"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[1000] w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <User className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-800">Меню</span>
          </div>
          <button
            onClick={closeMobileMenu}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading || roleLoading ? (
            <div className="flex justify-center p-4">
              <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : user ? (
            <>
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm">
                <p className="text-gray-900 font-semibold truncate">{user.email}</p>
                {userRole && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${userRole === "org"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                      }`}>
                      {userRole === "org" ? "Организация" : "Житель"}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Link
                  to="/add"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 w-full px-4 py-3.5 bg-primary-50 text-primary-700 font-semibold rounded-xl hover:bg-primary-100 transition shadow-sm border border-primary-100"
                >
                  <Plus className="w-5 h-5" />
                  <span>Сообщить проблему</span>
                </Link>

                {userRole === "org" && (
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 pb-1">Управление</p>
                    <Link
                      to="/moderation"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
                    >
                      <BarChart3 className="w-5 h-5 text-orange-500" />
                      <span>Модерация</span>
                    </Link>
                    <Link
                      to="/reports"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
                    >
                      <BarChart3 className="w-5 h-5 text-indigo-500" />
                      <span>Отчеты</span>
                    </Link>
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
                    >
                      <Shield className="w-5 h-5 text-red-500" />
                      <span>Админ-панель</span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-auto border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium rounded-xl hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Выход</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4 pt-4">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center w-full px-4 py-3.5 bg-gray-50 text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition border border-gray-200"
              >
                Вход
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="flex items-center justify-center w-full px-4 py-3.5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg shadow-primary-500/30 transition"
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
