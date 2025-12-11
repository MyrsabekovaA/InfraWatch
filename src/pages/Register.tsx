import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

type Role = "user" | "org";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message || "Ошибка регистрации");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      role,
    });

    if (profileError) {
      console.error(profileError);
      setError("Аккаунт создан, но профиль не сохранён");
      setLoading(false);
      return;
    }

    setLoading(false);


    navigate("/login");
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Регистрация
          </h1>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>

            {/* password */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Пароль
              </label>
              <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>

            {/* confirm */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Подтвердите пароль
              </label>
              <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
              />
            </div>

            {/* role */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Тип аккаунта
              </label>
              <select
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value="user">Горожанин</option>
                <option value="org">ЖКХ / организация</option>
              </select>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-lg hover:bg-blue-700 transition mt-4"
            >
              {loading ? "Создаем аккаунт..." : "Создать аккаунт"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">
              Уже есть аккаунт? <span className="font-semibold">Войти</span>
            </Link>
          </div>
        </div>
      </div>
  );
}