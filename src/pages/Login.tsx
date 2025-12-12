import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Неверные email или пароль");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
          <h1 className="text-3xl font-bold text-white text-center">Вход</h1>
          <p className="text-blue-100 text-center text-sm mt-2">
            Войдите в свой аккаунт
          </p>
        </div>

        {}
        <form onSubmit={handleLogin} className="p-6 space-y-5">
          {}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              Email адрес
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition duration-200 outline-none"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-blue-600" />
              Пароль
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition duration-200 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
              <p className="font-medium text-red-800">Ошибка входа</p>
              <p className="text-red-700 text-xs mt-1">{error}</p>
            </div>
          )}

          {}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Входим...
              </span>
            ) : (
              "Войти"
            )}
          </button>
        </form>

        {}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-700">
            Нет аккаунта?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}