import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Shield } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type Role = "user" | "org";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      setError("Пожалуйста, введите email");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Пожалуйста, введите корректный email");
      return false;
    }

    if (!password) {
      setError("Пожалуйста, введите пароль");
      return false;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError || !data.user) {
        setError(signUpError?.message || "Ошибка регистрации");
        setLoading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: email.toLowerCase(),
        role: role,
      });

      if (profileError) {
        console.error("Profile error:", profileError);
        setError("Аккаунт создан, но профиль не сохранён. Попробуйте войти.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccess(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Ошибка регистрации: " + String(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Регистрация
          </h1>
          <p className="text-blue-100 text-center text-sm mt-2">
            Создайте аккаунт, чтобы начать
          </p>
        </div>

        <form onSubmit={handleRegister} className="p-6 space-y-5">
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

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-blue-600" />
              Пароль
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition duration-200 outline-none"
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {password && (
              <p
                className={`text-xs mt-1 ${password.length >= 6
                    ? "text-green-600"
                    : "text-orange-600"
                  }`}
              >
                {password.length >= 6
                  ? "✓ Пароль надежный"
                  : "✗ Минимум 6 символов"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-blue-600" />
              Подтвердите пароль
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition duration-200 outline-none"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            {confirmPassword && password && (
              <p
                className={`text-xs mt-1 ${password === confirmPassword
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                {password === confirmPassword
                  ? "✓ Пароли совпадают"
                  : "✗ Пароли не совпадают"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-blue-600" />
              Тип аккаунта
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-lg text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition duration-200 outline-none cursor-pointer"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              disabled={loading}
            >
              <option value="user">👤 Горожанин</option>
              <option value="org">🏢 ЖКХ / организация</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
              <p className="font-medium text-red-800">Ошибка регистрации</p>
              <p className="text-red-600 text-xs mt-1">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded text-sm">
              <p className="font-medium text-green-800">✓ Аккаунт создан успешно!</p>
              <p className="text-green-600 text-xs mt-1">
                Перенаправляем на вход...
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Создаем аккаунт...
              </span>
            ) : success ? (
              "✓ Готово!"
            ) : (
              "Создать аккаунт"
            )}
          </button>
        </form>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-700">
            Уже есть аккаунт?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}