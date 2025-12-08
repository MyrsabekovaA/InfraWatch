import { useState } from "react";
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {}
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
        
        {}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Вход</h1>

        {}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition duration-200 placeholder-gray-400"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Пароль</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition duration-200 placeholder-gray-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform active:scale-98 mt-8"
          >
            Войти
          </button>
        </form>
        
        {}
        <div className="mt-4 text-center">
    <Link 
        to="/register"  
        className="text-sm text-gray-600 hover:text-blue-600 transition"
    >
        Нет аккаунта? <span className="font-semibold text-blue-600">Зарегистрироваться</span>
    </Link>
</div>
        
      </div>
    </div>
  );
}